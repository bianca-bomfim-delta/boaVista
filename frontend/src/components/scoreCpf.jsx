import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "../styles/scoreCpf.css";
import logo from "../images/logo.png";

const Score = () => {
  const [cpf, setCpf] = useState("");
  const [resultado, setResultado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  // Formatador do CPF
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
      showAlert("Por favor, digite um CPF válido.");
      return;
    }
    if (cpfNumerico.length < 11) {
      showAlert("Informe um CPF com 11 dígitos");
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
        showAlert(data.erro || "Erro na consulta.");
        setResultado(null);
      }
    } catch (error) {
      console.error("Erro:", error);
      showAlert("Falha ao conectar com o servidor.");
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

  const getColorByScore = (score) => {
    if (score < 200) return "#FF4444";
    if (score < 400) return "#FF8042";
    if (score < 700) return "#FFBB28";
    return "#00C49F";
  };

  return (
    <div className="score-panel-wrapper">
      <motion.div
        className="cpf-score-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          Acerta Mais Positivo
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2>Resultado da Consulta</h2>

              {/* ===== VELOCÍMETRO ===== */}
              <div className="gauge-container">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={[{ value: 1000 }]}
                      startAngle={180}
                      endAngle={0}
                      cx="50%"
                      cy="100%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      fill="#E0E0E0"
                      stroke="none"
                    />
                    <Pie
                      data={[{ value: Number(resultado.score) || 0 }]}
                      cx="50%"
                      cy="100%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={180}
                      endAngle={180 - ((Number(resultado.score) || 0) / 1000) * 180}
                      stroke="none"
                    >
                      <Cell fill={getColorByScore(Number(resultado.score) || 0)} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* AGULHA */}
                {(() => {
                  const score = Number(resultado.score) || 0;
                  const angle = -90 + (score / 1000) * 180;

                  return (
                    <>
                      <div
                        className="gauge-needle"
                        style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                      ></div>
                      <div className="gauge-center"></div>
                    </>
                  );
                })()}

                <div className="gauge-score">
                  {resultado.score || "—"}
                </div>
              </div>

              {/* ===== INFORMAÇÕES ===== */}
              <div className="score-info">
                <h2>Identificação</h2>

                <p><strong>Nome:</strong> {resultado.nome || "—"}</p>
                <p><strong>CPF:</strong> {resultado.cpf || "—"}</p>
                <p><strong>Score:</strong> {resultado.score || "—"}</p>
                <p><strong>Recomendação:</strong> {resultado.recomendacao || "—"}</p>
                <p><strong>Texto da Recomendação:</strong> {resultado.textoRecomendacao || "—"}</p>
                <p>
                  <strong>Probabilidade de Inadimplência:</strong>{" "}
                  {resultado.probabilidadeInadimplencia
                    ? `${resultado.probabilidadeInadimplencia}%`
                    : "—"}
                </p>
                <p><strong>Renda Presumida:</strong> {resultado.rendaPresumida || "—"}</p>
                <p><strong>Pontualidade nos Pagamentos:</strong> {resultado.pontualidadePagamentos || "—"}</p>
                <p><strong>Contratos Recentes:</strong> {resultado.contratosRecentes || "—"}</p>
                <p><strong>Faturas em Atraso:</strong> {resultado.faturasAtraso || "—"}</p>

                <p><strong>Mensagem:</strong> {resultado.mensagem || "—"}</p>
              </div>

              <motion.button
                onClick={novaConsulta}
                className="button-cpf-score"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ marginTop: "20px" }}
              >
                Nova Consulta
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== MODAL ===== */}
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
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <img src={logo} alt="Logo" className="modal-logo" />
                <h3>{modalType === "success" ? "Sucesso!" : "Atenção"}</h3>
                <p>{modalMessage}</p>
                <motion.button
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.05 }}
                >
                  OK
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Score;
