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

  return (
    <div className="sidebar">
      <h2>Delta</h2>

      {user && (
        <div className="user-info">
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
            <img
              src="/logo.png"
              alt="Logo da empresa"
              className="user-logo-bg"
            />
          </div>

          <h3 className="user-name">{user.nome_usuario}</h3>
          <p className="user-email">{user.email}</p>
        </div>
      )}

      <div className="menu-item">
        <button
          onClick={() => setOpenServicos(!openServicos)}
          className="submenu-toggle"
        >
          <ClipboardList size={18} style={{ marginRight: "8px" }} />
          Serviços{" "}
          {openServicos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openServicos && (
          <div className="submenu">
            <Link to="/scoreCpf" className="submenu-link">
              <FileText size={16} style={{ marginRight: "6px" }} />
              Consulta por CPF
            </Link>
            <Link to="/scoreCnpj" className="submenu-link">
              <FileText size={16} style={{ marginRight: "6px" }} />
              Consulta por CNPJ
            </Link>
          </div>
        )}
      </div>

      <Link to="/editProfile" className="menu-link">
        <User size={18} style={{ marginRight: "8px" }} />
        Editar Perfil
      </Link>

      {user?.id === 1 && (
        <>
          <Link to="/register" className="menu-link">
            <Users size={18} style={{ marginRight: "8px" }} />
            Cadastrar Usuário
          </Link>

          <Link to="/adminPanel" className="menu-link">
            <Settings size={18} style={{ marginRight: "8px" }} />
            Alterar Senhas
          </Link>
        </>
      )}

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} style={{ marginRight: "8px" }} />
        Sair
      </button>
    </div>
  );
}
