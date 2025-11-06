import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/editProfile.css";

const EditProfile = () => {
  const [user, setUser] = useState({
    id: "",
    nome_usuario: "",
    email: "",
    senha: "",
    foto: null,
    fotoPreview: null,
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser({
        ...parsedUser,
        fotoPreview: parsedUser.foto
          ? `http://127.0.0.1:5000/uploads/${parsedUser.foto}`
          : null,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({
        ...user,
        foto: file,
        fotoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (user.senha && user.senha.length < 8) {
      alert("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("nome_usuario", user.nome_usuario);
    formData.append("email", user.email);

    if (user.senha) {
      formData.append("senha", user.senha);
    }

    if (user.foto instanceof File) {
      formData.append("foto", user.foto);
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/update-profile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = data.user;
        const fotoUrl = updatedUser.foto
          ? `http://127.0.0.1:5000/uploads/${updatedUser.foto}?t=${Date.now()}`
          : null;

        const userToStore = { ...updatedUser, fotoPreview: fotoUrl };
        setUser(userToStore);
        localStorage.setItem("user", JSON.stringify(userToStore));

        alert("Perfil atualizado com sucesso!");
      } else {
        alert(data.error || "Erro ao atualizar o perfil.");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro na conexão com o servidor.");
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
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="user-edit-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="user-photo-section">
          <motion.img
            src={user.fotoPreview || "/default-avatar.png"}
            alt="Foto de perfil"
            className="user-avatar"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="user-photo-input"
          />
        </div>

        <label className="user-label">Nome:</label>
        <input
          type="text"
          name="nome_usuario"
          value={user.nome_usuario}
          onChange={handleChange}
          className="user-input"
          required
        />

        <label className="user-label">Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          className="user-input"
          required
        />

        <label className="user-label">Senha:</label>
        <input
          type="password"
          name="senha"
          value={user.senha}
          onChange={handleChange}
          className="user-input"
          placeholder="Alterar a Senha"
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
    </motion.div>
  );
};

export default EditProfile;
