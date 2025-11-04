import React, { useEffect, useState } from "react";
import "../styles/adminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Erro ao carregar usuários:", err));
  }, []);

  const handlePasswordChange = (id, value) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, senha: value } : user
    ));
  };

  const handleSave = async (id, senha) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, senha }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Não foi possível atualizar a senha.");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Editar Senha dos Usuários</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Nova Senha</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nome_usuario}</td>
              <td>{user.email}</td>
              <td>
                <input
                  type="password"
                  value={user.senha || ""}
                  onChange={(e) => handlePasswordChange(user.id, e.target.value)}
                  placeholder="Digite nova senha"
                />
              </td>
              <td>
                <button onClick={() => handleSave(user.id, user.senha)}>Salvar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
