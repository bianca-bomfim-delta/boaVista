const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome_usuario = document.getElementById("nome_usuario").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const response = await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome_usuario, email, senha })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Usuário cadastrado com sucesso!");
      window.location.href = "login.html";
    } else {
      alert(data.error || "Erro ao cadastrar usuário.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível conectar ao servidor.");
  }
});
