/*
======================================
Carrega o conteúdo dinâmico do data.json
======================================
*/

// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarConteudo();
});

// Função assíncrona para buscar os dados
async function carregarConteudo() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error(`Erro ao carregar dados: ${response.statusText}`);
        }
        
        const data = await response.json();

        // Atualiza informações do casal
        atualizarInfoCasal(data.casal);
        
        // Carrega as seções
        carregarCuriosidades(data.curiosidades);
        carregarGaleria(data.galeria);
        carregarPlaylist(data.playlist);

    } catch (error) {
        console.error("Não foi possível carregar o conteúdo:", error);
        const containerCuriosidades = document.getElementById('curiosidades-container');
        if (containerCuriosidades) { // Adicionada verificação de segurança
            containerCuriosidades.innerHTML = "<p>Ops! Não consegui carregar nossas memórias. Tente recarregar a página.</p>";
        }
    }
}

// Atualiza informações do casal no header
function atualizarInfoCasal(casal) {
    // Seletor trocado para ID (mais robusto)
    const heroTitle = document.getElementById('hero-titulo');
    const heroSubtitle = document.getElementById('hero-subtitulo');
    
    if (heroTitle && casal) {
        heroTitle.textContent = `${casal.nome1} e ${casal.nome2}`;
    }
    // (Opcional: você pode adicionar um subtitulo no seu data.json)
    if (heroSubtitle && casal.subtitulo) {
        heroSubtitle.textContent = casal.subtitulo;
    }
    
    /* NOTA: O seu script.js já tem a data correta do contador.
    Não precisamos passá-la do data.json, a menos que você queira.
    Vamos manter o seu script.js como está, pois funciona.
    */
}

// Função para criar os cards de curiosidades com carrossel
function carregarCuriosidades(curiosidades) {
    const container = document.getElementById('curiosidades-container');
    container.innerHTML = '';

    curiosidades.forEach((item, index) => {
        const carrosselHtml = item.carrossel && item.carrossel.length > 0 
            ? criarCarrossel(item.carrossel, index)
            : '<p class="sem-fotos">Nenhuma foto adicionada ainda</p>';

        const cardHtml = `
            <div class="card" data-aos="fade-up">
                <h3>${item.titulo}</h3>
                <p>${item.texto}</p>
                <div class="carrossel-container">
                    ${carrosselHtml}
                </div>
            </div>
        `;
        
        container.innerHTML += cardHtml;
    });

    // Inicializa os carrosseis após criar o HTML
    setTimeout(inicializarCarrosseis, 100);
}

// Função para criar o HTML do carrossel
function criarCarrossel(fotos, index) {
    const slides = fotos.map((foto, slideIndex) => `
        <div class="carrossel-item">
            <img src="${foto.url}" alt="${foto.descricao}" class="carrossel-img" loading="lazy">
            <div class="carrossel-descricao">${foto.descricao}</div>
        </div>
    `).join('');

    const indicadores = fotos.map((_, i) => 
        `<div class="carrossel-indicador" data-slide="${i}"></div>`
    ).join('');

    return `
        <div class="carrossel" id="carrossel-${index}">
            ${slides}
        </div>
        <div class="carrossel-controles">
            <button class="carrossel-btn prev" data-carrossel="${index}">‹</button>
            <button class="carrossel-btn next" data-carrossel="${index}">›</button>
        </div>
        <div class="carrossel-indicadores">
            ${indicadores}
        </div>
    `;
}

// Função para criar a galeria com filtros
function carregarGaleria(galeria) {
    const container = document.getElementById('galeria-container');
    
    // Cria os filtros
    const filtrosHtml = galeria.categorias.map(categoria => `
        <button class="filtro-btn ${categoria === 'todos' ? 'ativo' : ''}" 
                data-categoria="${categoria}">
            ${formatarCategoria(categoria)}
        </button>
    `).join('');

    // Cria o grid de fotos
    const fotosHtml = galeria.fotos.map(foto => `
        <div class="galeria-item" data-categoria="${foto.categoria}" data-data="${foto.data}">
            <img src="${foto.url}" alt="${foto.descricao}" loading="lazy">
            <div class="galeria-overlay">
                <div class="galeria-descricao">${foto.descricao}</div>
                <div class="galeria-data">${formatarData(foto.data)}</div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="galeria-filtros">
            ${filtrosHtml}
        </div>
        <div class="grid-galeria">
            ${fotosHtml}
        </div>
    `;

    // Inicializa os filtros
    inicializarFiltrosGaleria();
}

// ======================================
// MUDANÇA CRÍTICA AQUI
// ======================================
function carregarPlaylist(playlist) {
    // IDs dos novos elementos do index.html
    const container = document.getElementById('playlist-container');
    const tituloElement = document.getElementById('playlist-titulo');
    const descricaoElement = document.getElementById('playlist-descricao');

    // Atualiza o título e a descrição
    if (tituloElement && playlist.titulo) {
        tituloElement.innerText = playlist.titulo;
    }
    if (descricaoElement && playlist.descricao) {
        descricaoElement.innerText = playlist.descricao;
    }

    if (!container) return; // Se o container não existir, para aqui

    // Verifica se a URL da playlist existe e NÃO é o placeholder
    if (playlist && playlist.url && playlist.url !== 'LINK_DA_SUA_PLAYLIST_EMBUTIDA_AQUI') {
        container.innerHTML = `
            <iframe style="border-radius:12px" 
                src="${playlist.url}" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy">
            </iframe>
        `;
    } else {
        // Se não houver link, mostra o placeholder
        container.innerHTML = `
            <div class="playlist-placeholder">
                <p>🎵 Nossa playlist especial em breve aqui!</p>
                <small>Adicione o link da playlist do Spotify no data.json</small>
            </div>
        `;
    }
}

// ======================================
// FUNÇÕES AUXILIARES
// ======================================

function formatarCategoria(categoria) {
    const categorias = {
        'todos': 'Todas as Fotos',
        'primeiros-momentos': 'Primeiros Momentos',
        'viagens': 'Viagens',
        'cotidiano': 'Dia a Dia',
        'eventos': 'Eventos',
        'datas-especiais': 'Datas Especiais',
        'natureza': 'Natureza',
        'especiais': 'Especiais'
    };
    return categorias[categoria] || categoria;
}

function formatarData(dataString) {
    // Adiciona "T00:00:00" para evitar problemas de fuso horário (Timezone)
    const data = new Date(dataString + "T00:00:00");
    return data.toLocaleDateString('pt-BR');
}

// ======================================
// INICIALIZAÇÃO DOS COMPONENTES
// ======================================

function inicializarCarrosseis() {
    document.querySelectorAll('.carrossel-container').forEach(container => {
        const carrossel = container.querySelector('.carrossel');
        const prevBtn = container.querySelector('.carrossel-btn.prev');
        const nextBtn = container.querySelector('.carrossel-btn.next');
        const indicadores = container.querySelectorAll('.carrossel-indicador');
        
        if (!carrossel || !prevBtn || !nextBtn || !indicadores) return; // Proteção

        let currentSlide = 0;
        
        function updateCarrossel() {
            carrossel.scrollTo({
                left: currentSlide * carrossel.offsetWidth,
                behavior: 'smooth'
            });
            
            indicadores.forEach((ind, index) => {
                ind.classList.toggle('ativo', index === currentSlide);
            });
        }
        
        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(0, currentSlide - 1);
            updateCarrossel();
        });
        
        nextBtn.addEventListener('click', () => {
            currentSlide = Math.min(indicadores.length - 1, currentSlide + 1);
            updateCarrossel();
        });
        
        indicadores.forEach((ind, index) => {
            ind.addEventListener('click', () => {
                currentSlide = index;
                updateCarrossel();
            });
        });
        
        carrossel.addEventListener('scroll', () => {
            const slide = Math.round(carrossel.scrollLeft / carrossel.offsetWidth);
            if (slide !== currentSlide) {
                currentSlide = slide;
                indicadores.forEach((ind, index) => {
                    ind.classList.toggle('ativo', index === currentSlide);
                });
            }
        });
        
        // Seta o primeiro indicador como ativo
        if(indicadores.length > 0) {
            indicadores[0].classList.add('ativo');
        }
    });
}

function inicializarFiltrosGaleria() {
    const filtros = document.querySelectorAll('.filtro-btn');
    const itens = document.querySelectorAll('.galeria-item');
    
    filtros.forEach(filtro => {
        filtro.addEventListener('click', () => {
            const categoria = filtro.dataset.categoria;
            
            filtros.forEach(f => f.classList.remove('ativo'));
            filtro.classList.add('ativo');
            
            itens.forEach(item => {
                if (categoria === 'todos' || item.dataset.categoria === categoria) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}