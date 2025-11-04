import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

         <h2>Menu</h2>
         
      {user && (
        <div className="user-info">
          <img
            src={
              user.foto
                ? `http://127.0.0.1:5000/uploads/${user.foto}?t=${Date.now()}`
                : "/default-avatar.png"
            }
            alt="Foto do usuário"
            className="user-avatar"
          />
          <h3 className="user-name">{user.nome_usuario}</h3>
          <p className="user-email">{user.email}</p>
        </div>
      )}

      <div className="menu-item">
        <button
          onClick={() => setOpenServicos(!openServicos)}
          className="submenu-toggle"
        >
          Serviços {openServicos ? "▲" : "▼"}
        </button>

        {openServicos && (
          <div className="submenu">
            <Link to="/scoreCpf">Consulta por CPF</Link>
            <Link to="/scoreCnpj">Consulta por CNPJ</Link>
          </div>
        )}
      </div>

      <Link to="/editProfile" className="menu-link">
        Editar Perfil
      </Link>

      {user?.id === 1 && (
        <>
          <Link to="/register" className="menu-link">
            Cadastrar Usuário
          </Link>
          <Link to="/adminPanel" className="menu-link">
            Alterar Senhas
          </Link>
        </>
      )}

      <button className="logout-btn" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
