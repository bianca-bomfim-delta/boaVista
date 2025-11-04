import React, { useState, useEffect } from "react";
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

        const formData = new FormData();
        formData.append("id", user.id);
        formData.append("nome_usuario", user.nome_usuario);
        formData.append("email", user.email);
        formData.append("senha", user.senha);
        if (user.foto) formData.append("foto", user.foto);

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

                const userToStore = {
                    ...updatedUser,
                    fotoPreview: fotoUrl,
                };

                setUser(userToStore);
                localStorage.setItem("user", JSON.stringify(userToStore));

                alert("Perfil atualizado com sucesso!");
            }
            else {
                alert(data.error || "Erro ao atualizar o perfil.");
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro na conexão com o servidor.");
        }
    };

    return (
        <div className="edit-profile-container">
            <h2>Editar Meu Perfil</h2>
            <form onSubmit={handleSave} className="profile-form">
                <div className="profile-photo">
                    <img
                        src={user.fotoPreview || "/default-avatar.png"}
                        alt="Foto de perfil"
                        className="avatar"
                    />
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                <label>Nome:</label>
                <input
                    type="text"
                    name="nome_usuario"
                    value={user.nome_usuario}
                    onChange={handleChange}
                    required
                />

                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    required
                />

                <label>Senha:</label>
                <input
                    type="password"
                    name="senha"
                    value={user.senha}
                    onChange={handleChange}
                />

                <button type="submit" className="save-btn">
                    Salvar Alterações
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
