import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  FileText,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import "../styles/sidebar.css";

export default function Sidebar() {
  const [openServicos, setOpenServicos] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.2 + i * 0.1 },
    }),
  };

  return (
    <motion.div
      className="sidebar"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={itemVariants} custom={0}>
        Delta
      </motion.h2>

      {user && (
        <motion.div
          className="user-info"
          variants={itemVariants}
          custom={1}
        >
          <div className="user-avatar-wrapper">
            <motion.img
              src={
                user.foto
                  ? `http://127.0.0.1:5000/uploads/${user.foto}?t=${Date.now()}`
                  : "/default-avatar.png"
              }
              alt="Foto do usuário"
              className="user-avatar"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            <motion.img
              src="/logo.png"
              alt="Logo da empresa"
              className="user-logo-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </div>

          <motion.h3
            className="user-name"
            variants={itemVariants}
            custom={2}
          >
            {user.nome_usuario}
          </motion.h3>

          <motion.p
            className="user-email"
            variants={itemVariants}
            custom={3}
          >
            {user.email}
          </motion.p>
        </motion.div>
      )}

      <motion.div className="menu-item" variants={itemVariants} custom={4}>
        <button
          onClick={() => setOpenServicos(!openServicos)}
          className="submenu-toggle"
        >
          <ClipboardList size={18} style={{ marginRight: "8px" }} />
          Serviços{" "}
          {openServicos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openServicos && (
          <motion.div
            className="submenu"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link to="/scoreCpf" className="submenu-link">
              <FileText size={16} style={{ marginRight: "6px" }} />
              Consulta por CPF
            </Link>
            <Link to="/scoreCnpj" className="submenu-link">
              <FileText size={16} style={{ marginRight: "6px" }} />
              Consulta por CNPJ
            </Link>
          </motion.div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} custom={5}>
        <Link to="/editProfile" className="menu-link">
          <User size={18} style={{ marginRight: "8px" }} />
          Editar Perfil
        </Link>
      </motion.div>

      {user?.id === 1 && (
        <>
          <motion.div variants={itemVariants} custom={6}>
            <Link to="/register" className="menu-link">
              <Users size={18} style={{ marginRight: "8px" }} />
              Cadastrar Usuário
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} custom={7}>
            <Link to="/adminPanel" className="menu-link">
              <Settings size={18} style={{ marginRight: "8px" }} />
              Alterar Senhas
            </Link>
          </motion.div>
        </>
      )}

      <motion.button
        className="logout-btn"
        onClick={handleLogout}
        variants={itemVariants}
        custom={8}
      >
        <LogOut size={18} style={{ marginRight: "8px" }} />
        Sair
      </motion.button>
    </motion.div>
  );
}
