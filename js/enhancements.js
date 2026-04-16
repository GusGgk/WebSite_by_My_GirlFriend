// Arquivo: js/enhancements.js
// Adiciona melhorias visuais e interações

document.addEventListener('DOMContentLoaded', function() {
    initEnhancements();
});

document.addEventListener('contentReady', function() {
    setupImageLoading();
    addScrollAnimations();
});

let observer;

function initEnhancements() {
    createHeartDecorations();
    setupBackToTop();
    setupScrollProgress();
    setupCardTilt();
    setupLetterModal();
    setupSurpriseMode();
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

function setupScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

// Melhor carregamento de imagens
function setupImageLoading() {
    const images = document.querySelectorAll('.grid-galeria img');
    
    images.forEach(img => {
        if (img.dataset.imageEnhanced === 'true') return;
        img.dataset.imageEnhanced = 'true';

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
    if (!observer) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
    }

    // Observa os cards e imagens
    const animatedElements = document.querySelectorAll('.card, .grid-galeria img, .contador-section, .playlist-section, .galeria');
    animatedElements.forEach(el => {
        if (el.dataset.scrollAnimated === 'true') return;
        el.dataset.scrollAnimated = 'true';

        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function setupCardTilt() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        if (card.dataset.tiltEnabled === 'true') return;
        card.dataset.tiltEnabled = 'true';

        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateX = ((y / rect.height) - 0.5) * -4;
            const rotateY = ((x / rect.width) - 0.5) * 4;

            card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function setupGalleryLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const galleryItems = Array.from(document.querySelectorAll('.galeria-item'));

    if (!lightbox || !lightboxImage || !lightboxCaption || !closeBtn || !prevBtn || !nextBtn || galleryItems.length === 0) {
        return;
    }

    if (lightbox.dataset.bound === 'true') return;
    lightbox.dataset.bound = 'true';

    let currentIndex = 0;

    function renderByIndex(index) {
        const validIndex = (index + galleryItems.length) % galleryItems.length;
        const img = galleryItems[validIndex].querySelector('img');
        if (!img) return;

        currentIndex = validIndex;
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = img.alt;
    }

    function open(index) {
        renderByIndex(index);
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    galleryItems.forEach((item, index) => {
        if (item.dataset.lightboxBound === 'true') return;
        item.dataset.lightboxBound = 'true';

        item.addEventListener('click', () => open(index));
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => renderByIndex(currentIndex - 1));
    nextBtn.addEventListener('click', () => renderByIndex(currentIndex + 1));

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) close();
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('open')) return;

        if (event.key === 'Escape') close();
        if (event.key === 'ArrowLeft') renderByIndex(currentIndex - 1);
        if (event.key === 'ArrowRight') renderByIndex(currentIndex + 1);
    });
}

function setupLetterModal() {
    const openBtn = document.getElementById('openLetterBtn');
    const modal = document.getElementById('letterModal');
    const closeBtn = document.getElementById('letterClose');

    if (!openBtn || !modal || !closeBtn) return;

    if (modal.dataset.bound === 'true') return;
    modal.dataset.bound = 'true';

    const openModal = () => {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
}

function setupSurpriseMode() {
    const trigger = document.getElementById('surpriseModeBtn');
    if (!trigger) return;

    if (trigger.dataset.bound === 'true') return;
    trigger.dataset.bound = 'true';

    trigger.addEventListener('click', async () => {
        const selectors = [
            '.hero-section',
            '.contador-section',
            '.curiosidades',
            '.playlist-section',
            '.special-section',
            '.galeria'
        ];

        trigger.disabled = true;
        trigger.textContent = 'Modo Surpresa em andamento...';

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (!element) continue;

            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('spotlight-target');
            await esperar(1500);
            element.classList.remove('spotlight-target');
            await esperar(350);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        trigger.disabled = false;
        trigger.textContent = 'Ativar Modo Surpresa';
    });
}

function esperar(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

// Efeito de digitação no subtítulo (opcional)
function typeWriterEffect() {
    const subtitle = document.getElementById('hero-subtitulo');
    if (!subtitle) return;

    if (subtitle.dataset.typed === 'true') return;
    subtitle.dataset.typed = 'true';
    
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

document.addEventListener('contentReady', function() {
    setupGalleryLightbox();
    setupCardTilt();
    setupLetterModal();
    setupSurpriseMode();
});

