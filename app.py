from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import xml.etree.ElementTree as ET
#import requests

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
    cur.execute("SELECT * FROM usuario WHERE email = %s AND senha = %s", (email, senha))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user:
        return jsonify({"message": f"Bem-vindo, {user[1]}!"}), 200
    else:
        return jsonify({"error": "Email ou senha incorretos"}), 401


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

    cur.execute(
        "INSERT INTO usuario (nome_usuario, email, senha) VALUES (%s, %s, %s) RETURNING id, nome_usuario, email",
        (nome, email, senha)
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
            "email": new_user[2]
        }
    }), 201


@app.route("/fetch-score", methods=["POST"])
def fetch_score():
    data = request.get_json()
    cpf = data.get("cpf")

    if not cpf:
        return jsonify({"error": "CPF é obrigatório"}), 400
    
    # alterar essa parte quando tivermos acesso a api da boa vista 


    # isso daqui é apenas a simulação temporaria
    xml_response = """
    <root>
        <tr_601:score_classificacao_varios_modelos xmlns:tr_601="urn:exemplo">
            <tr_601:registro>S</tr_601:registro>
            <tr_601:score>9</tr_601:score>
            <tr_601:nomeScore>Renda Presum Faixa</tr_601:nomeScore>
            <tr_601:texto>De R$ 7.001 até R$ 9.000</tr_601:texto>
            <tr_601:descricaoNatureza>RENDA PRESUMIDA</tr_601:descricaoNatureza>
        </tr_601:score_classificacao_varios_modelos>

        <tr_940:mensagem_registro xmlns:tr_940="urn:exemplo">
            <tr_940:registro>S</tr_940:registro>
            <tr_940:texto>Consulta simulada de score.</tr_940:texto>
        </tr_940:mensagem_registro>
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
        "cpf": cpf,
        "scores": scores,
        "messages": messages or [{"texto": "Nenhuma mensagem disponível."}]
    }

    return jsonify(result), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
