const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            window.location.href = "/score";
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível conectar ao servidor.");
    }
});
