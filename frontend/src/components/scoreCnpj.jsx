import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/score.css";

const ScoreCnpj = () => {
  const [cnpj, setCnpj] = useState("");
  const [resultado, setResultado] = useState(null);

  const formatCnpj = (value) => {
    let v = value.replace(/\D/g, "").slice(0, 14);
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cnpj) {
      alert("Por favor, digite um CNPJ válido.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/fetch-score-cnpj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj }),
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
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
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
        Consulta de Score CNPJ
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <input
          type="text"
          id="cnpj"
          placeholder="Digite o CNPJ"
          value={cnpj}
          onChange={(e) => setCnpj(formatCnpj(e.target.value))}
          maxLength={18}
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
            <p><strong>CNPJ:</strong> {resultado.cnpj}</p>
            <p><strong>Score:</strong> {resultado.scores?.[0]?.score || "—"}</p>
            <p><strong>Nome do Score:</strong> {resultado.scores?.[0]?.nomeScore || "—"}</p>
            <p><strong>Faixa:</strong> {resultado.scores?.[0]?.texto || "—"}</p>
            <p><strong>Natureza:</strong> {resultado.scores?.[0]?.descricaoNatureza || "—"}</p>
            <p><strong>Mensagem:</strong> {resultado.messages?.[0]?.texto || "—"}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ScoreCnpj;
