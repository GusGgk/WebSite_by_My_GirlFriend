// Arquivo: js/enhancements.js
// Adiciona melhorias visuais e interações

document.addEventListener('DOMContentLoaded', function() {
    initEnhancements();
});

function initEnhancements() {
    createHeartDecorations();
    setupBackToTop();
    setupImageLoading();
    addScrollAnimations();
}

// Elementos decorativos de coração
function createHeartDecorations() {
    const body = document.body;
    const heartCount = 5;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-decoration';
        heart.innerHTML = '❤';
        body.appendChild(heart);
    }
}

// Botão de voltar ao topo
function setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Voltar ao topo');
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
}

// Melhor carregamento de imagens
function setupImageLoading() {
    const images = document.querySelectorAll('.grid-galeria img');
    
    images.forEach(img => {
        // Adiciona loading state
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 50);
        });
        
        // Adiciona erro handling
        img.addEventListener('error', function() {
            this.alt = 'Imagem não carregada';
            this.style.filter = 'grayscale(100%)';
        });
    });
}

// Animações de scroll
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observa os cards e imagens
    const animatedElements = document.querySelectorAll('.card, .grid-galeria img');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Efeito de digitação no subtítulo (opcional)
function typeWriterEffect() {
    const subtitle = document.querySelector('.hero-section p');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    
    // Inicia o efeito depois de 1 segundo
    setTimeout(type, 1000);
}

// Inicializa o efeito de digitação quando a página carrega
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', typeWriterEffect);
} else {
    typeWriterEffect();
}

