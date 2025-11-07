import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/adminPanel.css";
import logo from "../images/logo.png";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Erro ao carregar usuários:", err);
        showAlert("Erro ao carregar usuários.", "error");
      });
  }, []);

  const showAlert = (message, type = "info") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const handlePasswordChange = (id, value) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, senha: value } : user
      )
    );
  };

  const handleSave = async (id, senha) => {
    if (!senha || senha.trim().length < 8) {
      showAlert("Use ao menos 8 caracteres.", "error");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, senha }),
      });

      const data = await response.json();
      if (response.ok) {
        showAlert(data.message || "Senha atualizada com sucesso!", "success");
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, senha: "" } : user
          )
        );
      } else {
        showAlert(data.error || "Erro ao atualizar senha.", "error");
      }
    } catch (error) {
      console.error("Erro:", error);
      showAlert("Não foi possível conectar ao servidor.", "error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.05, duration: 0.4 },
    }),
  };

  return (
    <motion.div
      className="edit-profile-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Editar Senha dos Usuários
      </motion.h2>

      <motion.table
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Nova Senha</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              variants={tableRowVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <td>{user.nome_usuario}</td>
              <td>{user.email}</td>
              <td>
                <motion.input
                  type="password"
                  value={user.senha || ""}
                  onChange={(e) => handlePasswordChange(user.id, e.target.value)}
                  placeholder="Digite nova senha"
                  whileFocus={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                />
              </td>
              <td>
                <motion.button
                  onClick={() => handleSave(user.id, user.senha)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Salvar
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

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

export default AdminPanel;
