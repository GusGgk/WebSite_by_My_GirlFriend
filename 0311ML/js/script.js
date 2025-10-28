/* --- 
======================================
Arquivo: js/script.js
(Versão limpa - Apenas o Contador)
======================================
--- */

document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos ---
    const contadorElement = document.getElementById('contador');

    // --- Lógica do Contador de Tempo Juntos ---

    // !! IMPORTANTE: COLOQUE A DATA DE VOCÊS AQUI !!
    // Formato: Ano, Mês (Janeiro=0, Fev=1, ... Dez=11), Dia, Hora, Minuto, Segundo
    const dataInicio = new Date(2024, 5, 21, 20, 18, 0); // Exemplo: 15 de Outubro de 2022, às 20:00

    function atualizarContador() {
        if (!contadorElement) return; // Garante que o elemento exista

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