import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/register.css";
import logo from "../images/logo.png";

const Register = () => {
  const [nome_usuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!senha || senha.trim().length < 8) {
      setModalMessage("Use ao menos 8 caracteres.");
      setModalType("error");
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_usuario, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        setModalMessage("Usuário cadastrado com sucesso!");
        setModalType("success");
        setShowModal(true);

      } else {
        setModalMessage(data.error || "Erro ao cadastrar usuário.");
        setModalType("error");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Erro:", error);
      setModalMessage("Não foi possível conectar ao servidor.");
      setModalType("error");
      setShowModal(true);
    }
  };

  return (
    <motion.div
      className="register-wrapper"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="register-box"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="register-title">Novo Usuário</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-label">Nome</label>
          <input
            type="text"
            className="register-input"
            placeholder="Digite seu nome"
            value={nome_usuario}
            onChange={(e) => setNomeUsuario(e.target.value)}
            required
          />

          <label className="register-label">Email</label>
          <input
            type="email"
            className="register-input"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="register-label">Senha</label>
          <input
            type="password"
            className="register-input"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <motion.button
            className="register-button"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cadastrar
          </motion.button>
        </form>
      </motion.div>

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

export default Register;
