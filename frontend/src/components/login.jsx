import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/authentication.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/scoreCpf");
      }
      else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
  <div className="login-container">
    <div className="login-left">
      <img src="/logo.png" alt="Logo" />
      <h1>Delta Global Bank</h1>
    </div>

    <div className="login-right">
      <div className="login-box">
        <h2>Bem-vindo</h2>
        <p>Entre com suas credenciais para acessar a plataforma</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  </div>
);

};

export default Login;
