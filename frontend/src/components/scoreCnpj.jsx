import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/scoreCnpj.css";
import NotificationModal from "../components/notificationModal/notificationModal";

const ScoreCnpj = () => {
  const [cnpj, setCnpj] = useState("");
  const [resultado, setResultado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  const formatCnpj = (value) => {
    let v = value.replace(/\D/g, "").slice(0, 14);
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    return v;
  };

  const showAlert = (message, type = "error") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cnpjNumerico = cnpj.replace(/\D/g, "");

    if (!cnpjNumerico) {
      showAlert("Digite um CNPJ válido.", "error");
      return;
    }

    if (cnpjNumerico.length < 14) {
      showAlert("Informe um CNPJ com 14 dígitos", "error");
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
        showAlert(data.error || "Erro na consulta.", "error");
        setResultado(null);
      }
    } catch (error) {
      console.error("Erro:", error);
      showAlert("Servidor indisponível.", "error");
    }
  };

  const novaConsulta = () => {
    setResultado(null);
    setCnpj("");
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
    <div className="cnpj-panel-wrapper">
      <motion.div
        className="cnpj-score-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Define Risco Positivo
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
                id="cnpj"
                placeholder="Digite o CNPJ"
                value={cnpj}
                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                maxLength={18}
                required
              />
              <motion.button
                type="submit"
                className="button-cnpj-score"
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
              className="cnpj-card"
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

              <motion.button
                onClick={novaConsulta}
                className="button-cnpj-score"
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

        <NotificationModal
          show={showModal}
          type={modalType}      // success | error | warning | info
          mode="ok"             // ok | confirm
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      </motion.div>
    </div>
  );
};

export default ScoreCnpj;
