from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import xml.etree.ElementTree as ET
import os

app = Flask(__name__)
CORS(app)

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


UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/")
def home():
    return "Teste do flask"


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400

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

    if user:
        user_id = user[0]
        nome = user[1]
        email = user[2]
        foto = user[3]
        administrador = user[4]  

        return jsonify({
            "id": user_id,
            "nome_usuario": nome,
            "email": email,
            "administrador": administrador,
            "foto": foto,
        }), 200
    else:
        return jsonify({"error": "Credenciais inválidas"}), 401


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    nome = data.get("nome_usuario")
    email = data.get("email")
    senha = data.get("senha")

    if not nome or not email or not senha:
        return jsonify({"error": "Nome, email e senha são obrigatórios"}), 400

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

    return jsonify({
        "message": "Usuário cadastrado com sucesso",
        "usuario": {
            "id": new_user[0],
            "nome_usuario": new_user[1],
            "email": new_user[2],
            "foto": new_user[3]
        }
    }), 201

 
@app.route("/fetch-score", methods=["POST"])
def fetch_score():
    data = request.get_json()
    cpf = data.get("cpf")

    # 🔸 Simulação da resposta XML da API real
    xml_response = f"""
    <consulta>
        <nome>MICHAEL SANTOS GOMES</nome>
        <cpf>{cpf}</cpf>
        <score>275</score>
        <recomendacao>Reprovar</recomendacao>
        <textoRecomendacao>Essa sugestão ocorre quando o documento se enquadra em ao menos um dos cenários abaixo...</textoRecomendacao>
        <probabilidadeInadimplencia>18</probabilidadeInadimplencia>
        <rendaPresumida>R$ 1.401 até R$ 2.000</rendaPresumida>
        <pontualidadePagamentos>B</pontualidadePagamentos>
        <contratosRecentes>C</contratosRecentes>
        <faturasAtraso>D</faturasAtraso>
        <enderecos>
            <endereco>
                <logradouro>R FLOR DA REDENCAO, 513</logradouro>
                <bairro>VL JACUI</bairro>
                <cidade>SAO PAULO</cidade>
                <cep>08050-060</cep>
            </endereco>
        </enderecos>
    </consulta>
    """

    # 🔸 Converter XML → JSON (mantendo formato do frontend)
    root = ET.fromstring(xml_response)

    resultado = {
        "nome": root.findtext("nome"),
        "cpf": root.findtext("cpf"),
        "scores": [{"score": int(root.findtext("score") or 0)}],
        "recomendacao": root.findtext("recomendacao"),
        "textoRecomendacao": root.findtext("textoRecomendacao"),
        "probabilidadeInadimplencia": int(root.findtext("probabilidadeInadimplencia") or 0),
        "rendaPresumida": root.findtext("rendaPresumida"),
        "pontualidadePagamentos": root.findtext("pontualidadePagamentos"),
        "contratosRecentes": root.findtext("contratosRecentes"),
        "faturasAtraso": root.findtext("faturasAtraso"),
        "enderecos": [
            {
                "logradouro": root.findtext(".//enderecos/endereco/logradouro"),
                "bairro": root.findtext(".//enderecos/endereco/bairro"),
                "cidade": root.findtext(".//enderecos/endereco/cidade"),
                "cep": root.findtext(".//enderecos/endereco/cep"),
            }
        ],
        "mensagem": "Consulta simulada (XML convertido para JSON)."
    }

    return jsonify(resultado)


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
