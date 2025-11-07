import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/authentication.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modal, setModal] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showModal = (message, type = "info") => {
    setModal({ show: true, message, type });
    setTimeout(() => {
      setModal({ show: false, message: "", type: "" });
    }, 2500);
  };

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

      } else {
        showModal(data.error || "Credenciais inválidas.", "error");
      }
    } catch (error) {
      console.error("Erro:", error);
      showModal("Servidor indisponível", "info");
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <motion.img
          src="/logo.png"
          alt="Logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          Delta Global Bank
        </motion.h1>
      </div>

      <motion.div
        className="login-right"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
    {modal.show && (
      <motion.div
        key="modal-alert"
        className={`modal-alert ${modal.type}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {modal.message}
      </motion.div>
    )}
  </AnimatePresence>

        <motion.div className="login-box" variants={formVariants}>
          <motion.h2 variants={childVariants}>Bem-vindo</motion.h2>
          <motion.p variants={childVariants}>
            Entre com suas credenciais para acessar a plataforma
          </motion.p>

          <motion.form onSubmit={handleSubmit} variants={formVariants}>
            <motion.label htmlFor="email" variants={childVariants}>
              E-mail
            </motion.label>
            <motion.input
              type="email"
              id="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variants={childVariants}
            />

            <motion.label htmlFor="senha" variants={childVariants}>
              Senha
            </motion.label>
            <motion.input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              variants={childVariants}
            />

            <motion.button type="submit" variants={childVariants}>
              Entrar
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
