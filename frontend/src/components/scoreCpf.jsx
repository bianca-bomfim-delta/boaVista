import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NotificationModal from "../components/notificationModal/notificationModal";
import mockData from "../mocks/consultaMock.json";
import "../styles/scoreCpf.css";

const ScoreCpf = () => {
  const [cpf, setCpf] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();
  const USE_MOCK = true;

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

    if (!cpfNumerico || cpfNumerico.length < 11) {
      showAlert("Digite um CPF válido.");
      return;
    }

    if (USE_MOCK) {
      navigate("/resultCpf", { state: { resultado: mockData } });
      return;
    }

/** ------------------------------
     * CHAMADA REAL DA API (DESATIVADO NO MOMENTO)
     * ------------------------------*/
    try {
      const response = await fetch("http://127.0.0.1:5000/fetch-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/resultCpf", { state: { resultado: data } });
      } else {
        showAlert(data.erro || "Erro na consulta.");
      }
    } catch (err) {
      showAlert("Falha ao conectar com o servidor.");
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="score-panel-wrapper">
      <motion.div
        className="cpf-score-container"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          Acerta Mais Positivo
        </motion.h1>

        <AnimatePresence>
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
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
            >
              Consultar
            </motion.button>
          </motion.form>
        </AnimatePresence>

        <NotificationModal
          show={showModal}
          type={modalType}
          mode="ok"
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      </motion.div>
    </div>
  );
};

export default ScoreCpf;
