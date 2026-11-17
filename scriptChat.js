
const botao = document.getElementById("btnEnviar");
const campoApi = document.getElementById("apiKey");
const campoMensagem = document.getElementById("mensagem");
const campoResposta = document.getElementById("resposta");

botao.addEventListener("click", enviarMensagem);

async function enviarMensagem() {

    const apiKey = campoApi.value.trim();
    const mensagem = campoMensagem.value.trim();

    if (!apiKey) {
        campoResposta.textContent =
            "Por favor, informe sua chave da API.";
        return;
    }

    if (!mensagem) {
        campoResposta.textContent =
            "Digite uma mensagem para iniciar o atendimento.";
        return;
    }

    botao.disabled = true;
    botao.textContent = "Preparando resposta...";

    campoResposta.textContent =
        "Nossa assistente está preparando uma resposta especial...";

    try {

        const resposta = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },

                body: JSON.stringify({
                    model: "gpt-5.5",

                    instructions: `
                        Você é a assistente virtual da Anastacio's Confeitaria.

                        O slogan da empresa é:
                        "Transformando açúcar em amor".

                        Sua função é atender os clientes de forma
                        educada, simpática, acolhedora e profissional.

                        Você deve ajudar com dúvidas sobre:
                        - Doces e sobremesas;
                        - Cones recheados;
                        - Produtos da confeitaria;
                        - Encomendas;
                        - Pedidos e atendimento.

                        Não invente preços, sabores disponíveis,
                        horários ou prazos de entrega.

                        Quando não souber alguma informação,
                        informe que o cliente deve consultar
                        diretamente a equipe da confeitaria.

                        Responda sempre em português do Brasil.
                    `,

                    input: mensagem
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.error?.message || "Erro ao acessar a API."
            );
        }

        const texto = (dados.output || [])
            .filter(item => item.type === "message")
            .flatMap(item => item.content || [])
            .filter(item => item.type === "output_text")
            .map(item => item.text)
            .join("\n");

        campoResposta.textContent =
            texto || "Não foi possível obter uma resposta.";

    } catch (erro) {

        campoResposta.textContent =
            "Não foi possível realizar o atendimento: " +
            erro.message;

    } finally {

        botao.disabled = false;
        botao.textContent = "Enviar mensagem 💗";

    }
}
