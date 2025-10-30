
const form = document.getElementById("formConsulta");
const resultadoDiv = document.getElementById("resultado");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cpf = document.getElementById("cpf").value.trim();
    if (!cpf) {
        alert("Por favor, digite um CPF válido.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/fetch-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cpf })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Retorno da API:", data);

            resultadoDiv.innerHTML = `
                        <div class="card">
                            <h2>Resultado da Consulta</h2>
                            <p><strong>CPF:</strong> ${data.cpf}</p>
                            <p><strong>Score:</strong> ${data.scores?.[0]?.score || "—"}</p>
                            <p><strong>Nome do Score:</strong> ${data.scores?.[0]?.nomeScore || "—"}</p>
                            <p><strong>Faixa:</strong> ${data.scores?.[0]?.texto || "—"}</p>
                            <p><strong>Natureza:</strong> ${data.scores?.[0]?.descricaoNatureza || "—"}</p>
                            <p><strong>Mensagem:</strong> ${data.messages?.[0]?.texto || "—"}</p>
                        </div>
                    `;
        } else {
            alert(data.error || "Erro na consulta.");
            resultadoDiv.innerHTML = "";
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao conectar com o servidor.");
    }
});

const cpfInput = document.getElementById('cpf');

cpfInput.addEventListener('input', () => {
    let value = cpfInput.value.replace(/\D/g, "");

    if (value.length > 11) value = value.slice(0, 11); 

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    cpfInput.value = value;
});