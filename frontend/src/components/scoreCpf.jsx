import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const novaConsulta = () => {
    setResultado(null);
    setCpf("");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="score-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Consulta de Score CPF
      </motion.h1>

      <AnimatePresence>
        {!resultado && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <input
              type="text"
              id="cpf"
              placeholder="Digite o CPF"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              maxLength={14}
              required
            />
            <motion.button
              type="submit"
              className="button-score"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Consultar
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resultado && (
          <motion.div
            key="resultado-card"
            className="card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2>Resultado da Consulta</h2>
            <p><strong>CPF:</strong> {resultado.cpf}</p>
            <p><strong>Score:</strong> {resultado.scores?.[0]?.score || "—"}</p>
            <p><strong>Nome do Score:</strong> {resultado.scores?.[0]?.nomeScore || "—"}</p>
            <p><strong>Faixa:</strong> {resultado.scores?.[0]?.texto || "—"}</p>
            <p><strong>Natureza:</strong> {resultado.scores?.[0]?.descricaoNatureza || "—"}</p>
            <p><strong>Mensagem:</strong> {resultado.messages?.[0]?.texto || "—"}</p>

            <motion.button
              onClick={novaConsulta}
              className="button-score"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ marginTop: "20px" }}
            >
              Nova Consulta
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Score;
