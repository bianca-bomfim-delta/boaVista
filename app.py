from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import psycopg2
import xml.etree.ElementTree as ET
import requests
import os
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ----------------------
# Configurações do banco
# ----------------------
DB_HOST = "10.174.1.116"
DB_NAME = "score"
DB_USER = "postgres"
DB_PASS = "XwrNUm9YshZsdQxQ"

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )

# ----------------------
# Uploads
# ----------------------
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ----------------------
# Rotas básicas
# ----------------------
@app.route("/")
def home():
    return "Teste do Flask"

# ----------------------
# Login
# ----------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, nome_usuario, email, foto, administrador
            FROM usuario
            WHERE email = %s AND senha = %s
        """, (email, senha))
        user = cur.fetchone()
        cur.close()
        conn.close()
    except Exception as e:
        return jsonify({"error": "Erro no banco de dados", "detalhes": str(e)}), 500

    if user:
        user_id, nome, email, foto, administrador = user
        return jsonify({
            "id": user_id,
            "nome_usuario": nome,
            "email": email,
            "administrador": administrador,
            "foto": foto,
        }), 200
    else:
        return jsonify({"error": "Credenciais inválidas"}), 401

# ----------------------
# Register
# ----------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    nome = data.get("nome_usuario")
    email = data.get("email")
    senha = data.get("senha")

    if not nome or not email or not senha:
        return jsonify({"error": "Nome, email e senha são obrigatórios"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM usuario WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"error": "Email já cadastrado"}), 409

        imagem_padrao = "default-avatar.jpeg"

        cur.execute(
            """
            INSERT INTO usuario (nome_usuario, email, senha, foto)
            VALUES (%s, %s, %s, %s)
            RETURNING id, nome_usuario, email, foto
            """,
            (nome, email, senha, imagem_padrao)
        )
        new_user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return jsonify({"error": "Erro no banco de dados", "detalhes": str(e)}), 500

    return jsonify({
        "message": "Usuário cadastrado com sucesso",
        "usuario": {
            "id": new_user[0],
            "nome_usuario": new_user[1],
            "email": new_user[2],
            "foto": new_user[3]
        }
    }), 201

# ----------------------
# Fetch Score (CPF)
# ----------------------

@app.route("/fetch-score", methods=["POST"])
def fetch_score():
    cpf = request.json.get("cpf", "").replace(".", "").replace("-", "")
    usuario = "01338101"
    senha = "YH82TV"

    xml_body = f"""<?xml version="1.0" encoding="UTF-8"?>
<acertaPositivoContratoEntrada xmlns="http://boavistaservicos.com.br/familia/acerta/positivo/pf">
    <usuario>{usuario}</usuario>
    <senha>{senha}</senha>
    <cpf>{cpf}</cpf>
    <tipoCredito>CC</tipoCredito>
</acertaPositivoContratoEntrada>
"""

    url = "https://acerta.bvsnet.com.br/FamiliaAcertaPositivoPFXmlWeb/essencial/v4"
    headers = {"Content-Type": "application/xml", "Accept": "application/xml"}

    ns = {
        "ns": "http://boavistaservicos.com.br/familia/acerta/positivo/pf",
        "tr_020": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/resumo_de_acoes_civeis",
        "tr_021": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/relacao_de_acoes_civeis",
        "tr_108": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/resumo_ocorrencias_de_debitos",
        "tr_111": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/resumoConsultas_anteriores_90_dias",
        "tr_123": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/informacoes_complementares",
        "tr_124": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/debitos",
        "tr_126": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/consultas_anteriores",
        "tr_142": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/titulos_protestados",
        "tr_146": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/resumo_titulos_protestados",
        "tr_241": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/nome_documentos",
        "tr_282": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/participacoes_do_documento_consultado",
        "tr_295": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/relacao_falencia_recuperacao_judicial",
        "tr_500": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/identificacao",
        "tr_501": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/localizacao",
        "tr_601": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/score_classificacao_varios_modelos",
        "tr_700": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/nota_comportamento",
        "tr_801": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/painel_controle_positivo/v4/essencial",
        "tr_804": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/status_consumidor",
        "tr_940": "http://boavistaservicos.com.br/familia/acerta/positivo/pf/mensagem_registro"
    }

    try:
        response = requests.post(url, data=xml_body, headers=headers)
        response.raise_for_status()
        xml_response = response.text
        root = ET.fromstring(xml_response)

        # --------------------------------------------
        # STATUS DO CONSUMIDOR
        # --------------------------------------------
        status_consumidor = root.findtext(".//tr_804:mensagem", None, ns)

        # --------------------------------------------
        # IDENTIFICAÇÃO
        # --------------------------------------------
        identificacao = {
            "nome": root.findtext(".//tr_500:nome", None, ns),
            "cpf": root.findtext(".//tr_500:documento", None, ns),
            "nomeMae": root.findtext(".//tr_500:nomeMae", None, ns),
            "dataNascimento": root.findtext(".//tr_500:dataNascimento", None, ns),
            "situacaoReceita": root.findtext(".//tr_500:situacaoReceita", None, ns),
            "sexo": root.findtext(".//tr_500:sexoConsultado", None, ns),
            "estadoCivil": root.findtext(".//tr_500:estadoCivil", None, ns),
            "dependentes": root.findtext(".//tr_500:numeroDependentes", None, ns),
            "grauInstrucao": root.findtext(".//tr_500:grauInstrucao", None, ns),
            "dataAtualizacao": root.findtext(".//tr_500:dataAtualizacao", None, ns),
            "regiaoCpf": root.findtext(".//tr_500:regiaoCpf", None, ns)
        }

        # --------------------------------------------
        # ENDEREÇO COMPLETO
        # --------------------------------------------
        endereco = {
            "tipoLogradouro": root.findtext(".//tr_501:tipoLogradouro", None, ns),
            "logradouro": root.findtext(".//tr_501:nomeLogradouro", None, ns),
            "numero": root.findtext(".//tr_501:numeroLogradouro", None, ns),
            "complemento": root.findtext(".//tr_501:complemento", None, ns),
            "bairro": root.findtext(".//tr_501:bairro", None, ns),
            "cidade": root.findtext(".//tr_501:cidade", None, ns),
            "uf": root.findtext(".//tr_501:unidadeFederativa", None, ns),
            "cep": root.findtext(".//tr_501:cep", None, ns)
        }

        # --------------------------------------------
        # SCORES (todos os blocos)
        # --------------------------------------------
        scores = []
        for s in root.findall(".//tr_601:score_classificacao_varios_modelos", ns):
            scores.append({
                "score": s.findtext("tr_601:score", None, ns),
                "tipoScore": s.findtext("tr_601:tipoScore", None, ns),
                "modeloScore": s.findtext("tr_601:modeloScore", None, ns),
                "nomeScore": s.findtext("tr_601:nomeScore", None, ns),
                "classificacao": s.findtext("tr_601:classificacaoAlfabetica", None, ns),
                "probabilidade": s.findtext("tr_601:probabilidade", None, ns),
                "natureza": s.findtext("tr_601:descricaoNatureza", None, ns),
                "texto": s.findtext("tr_601:texto", None, ns),
                "texto2": s.findtext("tr_601:texto2", None, ns)
            })

        # O primeiro score é o principal
        score_principal = scores[0] if scores else None

        # --------------------------------------------
        # CONSULTAS ANTERIORES
        # --------------------------------------------
        consultas = []
        for c in root.findall(".//tr_126:consultas_anteriores", ns):
            consultas.append({
                "data": c.findtext("tr_126:data", None, ns),
                "tipoOcorrencia": c.findtext("tr_126:tipoOcorrencia", None, ns),
                "valor": c.findtext("tr_126:valor", None, ns),
                "informante": c.findtext("tr_126:informante", None, ns)
            })

        # --------------------------------------------
        # RESUMO CONSULTAS 90 DIAS (tr_111)
        # --------------------------------------------
        resumo_90d = {
            "total": root.findtext(".//tr_111:total", None, ns),
            "periodo": [
                {
                    "ano": root.findtext(".//tr_111:ano_1", None, ns),
                    "mes": root.findtext(".//tr_111:mes_1", None, ns),
                    "total": root.findtext(".//tr_111:total_1", None, ns)
                },
                {
                    "ano": root.findtext(".//tr_111:ano_2", None, ns),
                    "mes": root.findtext(".//tr_111:mes_2", None, ns),
                    "total": root.findtext(".//tr_111:total_2", None, ns)
                },
                {
                    "ano": root.findtext(".//tr_111:ano_3", None, ns),
                    "mes": root.findtext(".//tr_111:mes_3", None, ns),
                    "total": root.findtext(".//tr_111:total_3", None, ns)
                },
                {
                    "ano": root.findtext(".//tr_111:ano_4", None, ns),
                    "mes": root.findtext(".//tr_111:mes_4", None, ns),
                    "total": root.findtext(".//tr_111:total_4", None, ns)
                }
            ]
        }

        # --------------------------------------------
        # PARTICIPAÇÕES EM EMPRESAS
        # --------------------------------------------
        participacoes = []
        for p in root.findall(".//tr_282:participacoes_do_documento_consultado", ns):
            participacoes.append({
                "documentoA": p.findtext("tr_282:numeroDocumentoA", None, ns),
                "documentoB": p.findtext("tr_282:numeroDocumentoB", None, ns),
                "razaoSocial": p.findtext("tr_282:razaoSocial", None, ns),
                "funcao": p.findtext("tr_282:funcao", None, ns),
                "percentual": p.findtext("tr_282:valorEmPercentual", None, ns),
                "dataEntrada": p.findtext("tr_282:dataDeEntrada", None, ns)
            })

        # --------------------------------------------
        # INDICADORES POSITIVOS
        # --------------------------------------------
        comportamento = {
            "faturaEmAtraso": root.findtext(".//tr_700:nota_comportamento_fatura_em_atraso/tr_700:nota", None, ns),
            "contratosRecentes": root.findtext(".//tr_700:nota_comportamento_contratos_recentes/tr_700:nota", None, ns)
        }

        # --------------------------------------------
        # REGISTROS NEGATIVOS (NADA CONSTA)
        # --------------------------------------------
        negativos = {
            "acoesCiveis": root.findtext(".//tr_020:registro", "N", ns),
            "debitos": root.findtext(".//tr_124:registro", "N", ns),
            "titulosProtestados": root.findtext(".//tr_142:registro", "N", ns),
            "falencias": root.findtext(".//tr_295:registro", "N", ns)
        }

        # --------------------------------------------
        # JSON FINAL — IGUAL AO PDF
        # --------------------------------------------
        json_final = {
            "statusConsumidor": status_consumidor,
            "scoreAprovacaoPositivo": score_principal,
            "identificacao": identificacao,
            "endereco": endereco,
            "consultasAnteriores": consultas,
            "resumoConsultas90Dias": resumo_90d,
            "participacoesEmpresas": participacoes,
            "indicadoresPositivos": comportamento,
            "registrosNegativos": negativos,
            "todosScores": scores
        }

        return jsonify(json_final)

    except Exception as e:
        return jsonify({"erro": str(e)}), 500


@app.route("/fetch-score-cnpj", methods=["POST"])
def fetch_score_cnpj():
    data = request.get_json()
    cnpj = data.get("cnpj")

    if not cnpj:
        return jsonify({"error": "CNPJ é obrigatório"}), 400

    # Simulação de resposta XML para CNPJ
    xml_response = """
    <root>
        <tr_602:score_classificacao_varios_modelos xmlns:tr_602="urn:exemplo">
            <tr_602:registro>S</tr_602:registro>
            <tr_602:score>8</tr_602:score>
            <tr_602:nomeScore>Risco Empresarial</tr_602:nomeScore>
            <tr_602:texto>Baixo risco</tr_602:texto>
            <tr_602:descricaoNatureza>EMPRESARIAL</tr_602:descricaoNatureza>
        </tr_602:score_classificacao_varios_modelos>

        <tr_941:mensagem_registro xmlns:tr_941="urn:exemplo">
            <tr_941:registro>S</tr_941:registro>
            <tr_941:texto>Consulta simulada de score para CNPJ.</tr_941:texto>
        </tr_941:mensagem_registro>
    </root>
    """

    root = ET.fromstring(xml_response)
    scores = []
    messages = []

    for score in root.findall(".//{urn:exemplo}score_classificacao_varios_modelos"):
        registro = score.find("{urn:exemplo}registro")
        if registro is not None and registro.text == "S":
            scores.append({
                "score": score.findtext("{urn:exemplo}score"),
                "nomeScore": score.findtext("{urn:exemplo}nomeScore"),
                "texto": score.findtext("{urn:exemplo}texto"),
                "descricaoNatureza": score.findtext("{urn:exemplo}descricaoNatureza"),
            })

    for msg in root.findall(".//{urn:exemplo}mensagem_registro"):
        registro = msg.find("{urn:exemplo}registro")
        if registro is not None and registro.text == "S":
            messages.append({
                "texto": msg.findtext("{urn:exemplo}texto")
            })

    result = {
        "cnpj": cnpj,
        "scores": scores,
        "messages": messages or [{"texto": "Nenhuma mensagem disponível."}]
    }

    return jsonify(result), 200


@app.route("/users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, nome_usuario, email FROM usuario")
    users = cur.fetchall()
    cur.close()
    conn.close()

    users_list = [{"id": u[0], "nome_usuario": u[1], "email": u[2]} for u in users]
    return jsonify(users_list), 200


@app.route("/update-password", methods=["POST"])
def update_password():
    data = request.get_json()
    user_id = data.get("id")
    new_password = data.get("senha")

    if not user_id or not new_password:
        return jsonify({"error": "ID do usuário e nova senha são obrigatórios"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE usuario SET senha = %s WHERE id = %s", (new_password, user_id))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Senha atualizada com sucesso"}), 200


@app.route("/update-profile", methods=["POST"])
def update_profile():
    user_id = request.form.get("id")
    nome = request.form.get("nome_usuario")
    email = request.form.get("email")
    senha = request.form.get("senha")
    foto = request.files.get("foto")

    if not user_id:
        return jsonify({"error": "ID do usuário é obrigatório"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    
    update_query = "UPDATE usuario SET nome_usuario = %s, email = %s"
    params = [nome, email]

    if senha: 
        update_query += ", senha = %s"
        params.append(senha)

    foto_nome = None
    if foto:
        from datetime import datetime
        from werkzeug.utils import secure_filename

        ext = os.path.splitext(secure_filename(foto.filename))[1]
        foto_nome = f"user_{user_id}_{int(datetime.now().timestamp())}{ext}"
        upload_path = os.path.join("uploads", foto_nome)
        foto.save(upload_path)

        update_query += ", foto = %s"
        params.append(foto_nome)

    update_query += " WHERE id = %s"
    params.append(user_id)

    cur.execute(update_query, params)
    conn.commit()

    cur.execute("SELECT id, nome_usuario, email, foto FROM usuario WHERE id = %s", (user_id,))
    updated_user = cur.fetchone()
    cur.close()
    conn.close()

    if not updated_user:
        return jsonify({"error": "Usuário não encontrado"}), 404

    user_data = {
        "id": updated_user[0],
        "nome_usuario": updated_user[1],
        "email": updated_user[2],
        "foto": updated_user[3],
    }

    print("USER_DATA RETORNO:", user_data)


    return jsonify({"message": "Perfil atualizado com sucesso", "user": user_data}), 200

from flask import send_from_directory


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.route("/delete-user/<int:id>", methods=["DELETE"])
def delete_user(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM usuario WHERE id = %s", (id,))
        user = cursor.fetchone()
        if not user:
            conn.close()
            return jsonify({"error": "Usuário não encontrado."}), 404

        cursor.execute("DELETE FROM usuario WHERE id = %s", (id,))
        conn.commit()
        conn.close()

        return jsonify({"message": "Usuário excluído com sucesso!"}), 200

    except Exception as e:
        print("Erro ao excluir usuário:", e)
        return jsonify({"error": "Erro interno no servidor."}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
