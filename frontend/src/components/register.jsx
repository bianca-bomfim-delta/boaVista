import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/register.css";

const Register = () => {
  const [nome_usuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome_usuario, email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        navigate("/login");
      } else {
        alert(data.error || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Não foi possível conectar ao servidor.");
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

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="register-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="register-box"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="register-title"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Novo Usuário
        </motion.h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <motion.label
            className="register-label"
            htmlFor="nome_usuario"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Nome
          </motion.label>
          <motion.input
            type="text"
            id="nome_usuario"
            className="register-input"
            placeholder="Digite seu nome"
            value={nome_usuario}
            onChange={(e) => setNomeUsuario(e.target.value)}
            required
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          />

          <motion.label
            className="register-label"
            htmlFor="email"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            Email
          </motion.label>
          <motion.input
            type="email"
            id="email"
            className="register-input"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          />

          <motion.label
            className="register-label"
            htmlFor="senha"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Senha
          </motion.label>
          <motion.input
            type="password"
            id="senha"
            className="register-input"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          />

          <motion.button
            className="register-button"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Cadastrar
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Register;
