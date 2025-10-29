
document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos ---
    const contadorElement = document.getElementById('contador');

    // --- Lógica do Contador de Tempo Juntos ---
    const dataInicio = new Date(2024, 5, 21, 20, 18, 0);

    function atualizarContador() {
        if (!contadorElement) return; 

        const agora = new Date();
        const diferenca = agora.getTime() - dataInicio.getTime();

        // Cálculos
        let segundos = Math.floor(diferenca / 1000);
        let minutos = Math.floor(segundos / 60);
        let horas = Math.floor(minutos / 60);
        let dias = Math.floor(horas / 24);

        // Pega o "resto" de cada um para exibir
        horas = horas % 24;
        minutos = minutos % 60;
        segundos = segundos % 60;

        // Formata para ter sempre dois dígitos (ex: 08h 05m 01s)
        const strDias = String(dias).padStart(2, '0');
        const strHoras = String(horas).padStart(2, '0');
        const strMinutos = String(minutos).padStart(2, '0');
        const strSegundos = String(segundos).padStart(2, '0');

        // Atualiza o HTML
        contadorElement.innerText = `${strDias} dias, ${strHoras}h ${strMinutos}m ${strSegundos}s`;
    }

    // Chama a função pela primeira vez
    atualizarContador();

    // Define um intervalo para atualizar o contador a cada segundo
    setInterval(atualizarContador, 1000);


});
