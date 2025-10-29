/* ======================================
   ROSA NEO - ANIMAÇÃO (Híbrido Final)
   Arquivo: js/rosa-neo.js
======================================*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Seletores de Elementos ---
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const rosaWrapper = document.getElementById('rosaWrapper');
    const instruction = document.getElementById('instruction');
    const btnContinuar = document.getElementById('btnContinuar');
    let animacaoIniciada = false;

    // --- Configuração do Canvas (DO SEU TEMA) ---
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // --- Classe de Partículas de Fundo (DO SEU TEMA) ---
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y > canvas.height) {
                this.y = 0;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(255, 0, 128, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    const particles = Array.from({ length: 50 }, () => new Particle());

    // --- Loop de Animação do Canvas (DO SEU TEMA) ---
    function animate() {
        ctx.fillStyle = 'rgba(10, 0, 20, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate(); // Inicia a animação de fundo

    // --- Animação Principal (Clique na Rosa) ---
    rosaWrapper.addEventListener('click', () => {
        if (animacaoIniciada) return;
        animacaoIniciada = true;

        // 1. Esconde a instrução
        instruction.classList.add('hidden');
        
        // 2. Adiciona a classe '.aberta' ao rosaWrapper
        // O CSS vai ver isso e iniciar as animações 'openRose...'
        rosaWrapper.classList.add('aberta');

        // 3. Mostra o botão "Continuar" após a animação
        // A animação dura 3 segundos (definido no CSS)
        setTimeout(() => {
            btnContinuar.classList.add('visible');
        }, 3000); // 3 segundos
    });

    // --- Botão Continuar - Redireciona para o site principal ---
    btnContinuar.addEventListener('click', () => {
        // Efeito de fade out no body antes de redirecionar
        document.body.style.transition = 'opacity 0.5s ease-out';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500); // Espera o fade acabar
    });

});