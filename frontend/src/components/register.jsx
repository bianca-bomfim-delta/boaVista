import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/register.css";
import NotificationModal from "../components/notificationModal/notificationModal";

const Register = () => {
  const [nome_usuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    type: "info",  
    mode: "ok",
    message: "",
  });

  const openModal = (type, message, mode = "ok") => {
    setModalData({ type, message, mode });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!senha || senha.trim().length < 8) {
      openModal("error", "Use ao menos 8 caracteres.");
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
        openModal("success", "Usuário cadastrado com sucesso!");
      } else {
        openModal("error", data.error || "Erro desconhecido.");
      }
    } catch (error) {
      console.error("Erro:", error);
      openModal("error", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className="register-panel-wrapper">
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

        <NotificationModal
          show={modalOpen}
          type={modalData.type}
          mode={modalData.mode}
          message={modalData.message}
          onClose={() => setModalOpen(false)}
        />
      </motion.div>
    </div>
  );
};

export default Register;
