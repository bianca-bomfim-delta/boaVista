import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/userContext";
import "../styles/editProfile.css";
import NotificationModal from "../components/notificationModal/notificationModal";

const EditProfile = () => {
  const { user, setUser } = useUser();
  const [localUser, setLocalUser] = useState({
    id: "",
    nome_usuario: "",
    email: "",
    senha: "",
    foto: null,
    fotoPreview: null,
  });

  const [modal, setModal] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (user && user.id) {
      setLocalUser({
        ...user,
        senha: "",
        fotoPreview: user.foto
          ? `http://127.0.0.1:5000/uploads/${user.foto}`
          : null,
      });
    } else {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setLocalUser({
          ...parsedUser,
          senha: "",
          fotoPreview: parsedUser.foto
            ? `http://127.0.0.1:5000/uploads/${parsedUser.foto}`
            : null,
        });
        setUser(parsedUser);
      }
    }
  }, [user, setUser]);

  const showModal = (message, type = "info") => {
    setModal({ show: true, message, type });
    setTimeout(() => setModal({ show: false, message: "", type: "" }), 2500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalUser({ ...localUser, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocalUser({
        ...localUser,
        foto: file,
        fotoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (localUser.senha?.trim() !== "" && localUser.senha.length < 8) {
      showModal("Mínimo de 8 caracteres.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("id", localUser.id);
    formData.append("nome_usuario", localUser.nome_usuario);
    formData.append("email", localUser.email);

    if (localUser.senha) formData.append("senha", localUser.senha);
    if (localUser.foto instanceof File) formData.append("foto", localUser.foto);

    try {
      const response = await fetch("http://127.0.0.1:5000/update-profile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = data.user;
        const novaFotoUrl = updatedUser.foto
          ? `http://127.0.0.1:5000/uploads/${updatedUser.foto}?t=${Date.now()}`
          : null;

        setLocalUser((prevUser) => ({
          ...prevUser,
          nome_usuario: updatedUser.nome_usuario,
          email: updatedUser.email,
          foto: updatedUser.foto,
          fotoPreview: novaFotoUrl,
        }));

        setUser((prev) => {
          const newUser = {
            ...prev,
            ...updatedUser,
            administrador: prev.administrador,
            fotoPreview: novaFotoUrl,
          };

          localStorage.setItem("user", JSON.stringify(newUser));
          return newUser;
        });

        showModal("Alterações salvas", "success");
      } else {
        showModal(data.error || "Erro ao atualizar o perfil.", "error");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      showModal("Falha na Conexão", "error");
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="edit-profile-wrapper">
      <motion.div
        className="user-edit-container"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="user-edit-title"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Editar Meu Perfil
        </motion.h2>

        <motion.form
          onSubmit={handleSave}
          className="user-edit-form"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="user-photo-section">
            <motion.img
              src={localUser.fotoPreview || "/default-avatar.png"}
              alt="Foto de perfil"
              className="profile-avatar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />

            <input
              type="file"
              id="foto"
              accept="image/*"
              onChange={handleFileChange}
              className="user-photo-input"
            />

            <label htmlFor="foto" className="choose-photo-btn">
              Escolher arquivo
            </label>
          </div>

          <label className="user-label">Nome:</label>
          <input
            type="text"
            name="nome_usuario"
            value={localUser.nome_usuario}
            onChange={handleChange}
            className="user-input"
            required
          />

          <label className="user-label">Email:</label>
          <input
            type="email"
            name="email"
            value={localUser.email}
            onChange={handleChange}
            className="user-input"
            required
          />

          <label className="user-label">Senha:</label>
          <input
            type="password"
            name="senha"
            value={localUser.senha}
            onChange={handleChange}
            className="user-input"
            placeholder="Alterar a senha"
          />

          <motion.button
            type="submit"
            className="user-save-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Salvar Alterações
          </motion.button>
        </motion.form>

        <NotificationModal
          show={modal.show}
          type={modal.type}
          mode="ok"             
          message={modal.message}
          onClose={() => setModal({ show: false, message: "", type: "" })}
        />
      </motion.div>
    </div>
  );
};

export default EditProfile;
