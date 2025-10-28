from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import psycopg2

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


@app.route("/")  # mudar essa tela depois
def home():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json() or request.form
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

    return render_template("login.html")



@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        data = request.get_json() or request.form
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

    return render_template("register.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
