import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const [nome_usuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_usuario, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        navigate("/login");
      } else {
        alert(data.error || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
  <div className="register-wrapper">
    <div className="register-box">
      <h2 className="register-title">Novo Usuário</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label className="register-label" htmlFor="nome_usuario">
          Nome
        </label>
        <input
          type="text"
          id="nome_usuario"
          className="register-input"
          placeholder="Digite seu nome"
          value={nome_usuario}
          onChange={(e) => setNomeUsuario(e.target.value)}
          required
        />

        <label className="register-label" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="register-input"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="register-label" htmlFor="senha">
          Senha
        </label>
        <input
          type="password"
          id="senha"
          className="register-input"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button className="register-button" type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  </div>
);

};

export default Register;
