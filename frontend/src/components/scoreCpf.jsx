import React, { useState } from "react";
import "../styles/score.css";

const Score = () => {
  const [cpf, setCpf] = useState("");
  const [resultado, setResultado] = useState(null);

  const formatCpf = (value) => {
    let v = value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cpf) {
      alert("Por favor, digite um CPF válido.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/fetch-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf }),
      });

      const data = await response.json();

      if (response.ok) {
        setResultado(data);
      } else {
        alert(data.error || "Erro na consulta.");
        setResultado(null);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Falha ao conectar com o servidor.");
    }
  };

  return (
    <div className="score-container">
      <h1>Consulta de Score CPF</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="cpf"
          placeholder="Digite o CPF"
          value={cpf}
          onChange={(e) => setCpf(formatCpf(e.target.value))}
          maxLength={14}
          required
        />
        <button type="submit">Consultar</button>
      </form>

      {resultado && (
        <div className="card">
          <h2>Resultado da Consulta</h2>
          <p><strong>CPF:</strong> {resultado.cpf}</p>
          <p><strong>Score:</strong> {resultado.scores?.[0]?.score || "—"}</p>
          <p><strong>Nome do Score:</strong> {resultado.scores?.[0]?.nomeScore || "—"}</p>
          <p><strong>Faixa:</strong> {resultado.scores?.[0]?.texto || "—"}</p>
          <p><strong>Natureza:</strong> {resultado.scores?.[0]?.descricaoNatureza || "—"}</p>
          <p><strong>Mensagem:</strong> {resultado.messages?.[0]?.texto || "—"}</p>
        </div>
      )}
    </div>
  );
};

export default Score;
