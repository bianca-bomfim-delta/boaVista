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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/sidebar.css";

export default function Sidebar() {
  const [openServicos, setOpenServicos] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const sidebarVariants = {
    expanded: { width: "220px", transition: { duration: 0.3 } },
    collapsed: { width: "70px", transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
    >
      <div className="sidebar-header">
        {!isCollapsed && <h2>Delta</h2>}
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {user && (
        <div className={`user-info ${isCollapsed ? "collapsed-user" : ""}`}>
          <div className="user-avatar-wrapper">
            <img
              src={
                user.foto
                  ? `http://127.0.0.1:5000/uploads/${user.foto}?t=${Date.now()}`
                  : "/default-avatar.png"
              }
              alt="Foto do usuário"
              className="user-avatar"
            />
            {!isCollapsed && (
              <>
                <img src="/logo.png" alt="Logo" className="user-logo-bg" />
                <h3 className="user-name">{user.nome_usuario}</h3>
                <p className="user-email">{user.email}</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="menu-item">
        <button onClick={() => setOpenServicos(!openServicos)} className="submenu-toggle">
          <ClipboardList size={18} />
          {!isCollapsed && (
            <>
              <span>Serviços</span>
              {openServicos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </>
          )}
        </button>

        <AnimatePresence>
          {openServicos && !isCollapsed && (
            <motion.div
              className="submenu"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.1 }}
            >
              <Link to="/scoreCpf">
                <FileText size={16} />
                <span>Consulta por CPF</span>
              </Link>
              <Link to="/scoreCnpj">
                <FileText size={16} />
                <span>Consulta por CNPJ</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link to="/editProfile" className="menu-link">
        <User size={18} />
        {!isCollapsed && <span>Editar Perfil</span>}
      </Link>

      {user?.administrador && (
        <>
          <Link to="/register" className="menu-link">
            <Users size={18} />
            {!isCollapsed && <span>Cadastrar Usuário</span>}
          </Link>

          <Link to="/adminPanel" className="menu-link">
            <Settings size={18} />
            {!isCollapsed && <span>Alterar Senhas</span>}
          </Link>
        </>
      )}

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        {!isCollapsed && <span>Sair</span>}
      </button>
    </motion.div>
  );
}
