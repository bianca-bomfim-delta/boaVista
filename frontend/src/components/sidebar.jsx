import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/sidebar.css"

export default function Sidebar() {
  const [openServicos, setOpenServicos] = useState(false);

  return (
    <div className="sidebar">
      <h2>Menu</h2>

      <div className="menu-item">
        <button onClick={() => setOpenServicos(!openServicos)} className="submenu-toggle">
          Serviços {openServicos ? "▲" : "▼"}
        </button>
        {openServicos && (
          <div className="submenu">
            <Link to="/scoreCpf">Consulta por CPF</Link>
            <Link to="/scoreCnpj">Consulta por CNPJ</Link>
          </div>
        )}
      </div>

      <Link to="/register" className="menu-link">Cadastrar Usuário</Link>
      <Link to="/adminPanel" className="menu-link">Editar Perfil</Link>

      <button className="logout-btn" onClick={() => window.location.href = "/login"}>
        Logout
      </button>
    </div>
  );
}
