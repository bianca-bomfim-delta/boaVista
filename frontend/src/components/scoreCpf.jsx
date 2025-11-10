import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/scoreCpf.css";
import logo from "../images/logo.png";

const Score = () => {
  const [cpf, setCpf] = useState("");
  const [resultado, setResultado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const formatCpf = (value) => {
    let v = value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  };

  const showAlert = (message, type = "error") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cpfNumerico = cpf.replace(/\D/g, "");

    if (!cpfNumerico) {
      showAlert("Por favor, digite um CPF válido.", "error");
      return;
    }

    if (cpfNumerico.length < 11) {
      showAlert("Informe um CPF com 11 dígitos", "error");
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
        showAlert(data.error || "Erro na consulta.", "error");
        setResultado(null);
      }
    } catch (error) {
      console.error("Erro:", error);
      showAlert("Falha ao conectar com o servidor.", "error");
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
      className="cpf-score-container"
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
              className="button-cpf-score"
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
            className="cpf-card"
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
              className="button-cpf-score"
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

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`modal-content ${modalType}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <img src={logo} alt="Logo" className="modal-logo" />

              <h3 className="modal-title">
                {modalType === "success" ? "Sucesso!" : "Atenção"}
              </h3>

              <p className="modal-text">{modalMessage}</p>

              <motion.button
                className="modal-close"
                onClick={() => setShowModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                OK
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Score;
