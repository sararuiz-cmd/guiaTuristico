// /C:/Users/juanp/OneDrive/Escritorio/revisar/guiaTuristico/js/script.js
// Funcionalidades principales para guía turístico: carga de lugares, búsqueda, filtros, favoritos y modal con mapa.

// Configuración
const RUTA_DATOS = '/guiaTuristico/data/lugares.json'; // ajustar según proyecto
const CLAVE_FAVS = 'guiaturistico_favs';

// Estado
let lugares = [];
let favoritos = new Set(JSON.parse(localStorage.getItem(CLAVE_FAVS) || '[]'));
let filtro = {
    texto: '',
    categoria: 'todos',
    ordenar: 'nombre',
    soloFavoritos: false
};

// Elementos del DOM esperados
const contenedor = document.querySelector('#placesContainer');
const inputBusqueda = document.querySelector('#searchInput');
const selectCategoria = document.querySelector('#categorySelect');
const selectOrden = document.querySelector('#sortSelect');
const checkboxFavs = document.querySelector('#favoritesOnlyCheckbox');
const modal = document.querySelector('#detailModal');
const modalTitulo = document.querySelector('#modalTitle');
const modalCuerpo = document.querySelector('#modalBody');

// Inicialización
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupEventos();
    cargarLugares().then(() => {
        poblarCategorias();
        renderizar();
    });
}

// Cargar datos (fetch) con fallback a datos de ejemplo
async function cargarLugares() {
    try {
        const resp = await fetch(RUTA_DATOS);
        if (!resp.ok) throw new Error('No se pudo cargar');
        lugares = await resp.json();
    } catch (e) {
        console.warn('Fallo al cargar datos, usando ejemplo local.', e);
        lugares = ejemploLugares();
    }
}

// Renderizado de tarjetas
function renderizar() {
    const filtrados = aplicarFiltros(lugares);
    contenedor.innerHTML = filtrados.map(crearTarjetaHTML).join('') || '<p>No hay resultados.</p>';
    // Añadir listeners dinámicos (favoritos y detalle)
    document.querySelectorAll('.btn-fav').forEach(btn => btn.addEventListener('click', manejarFavorito));
    document.querySelectorAll('.btn-detalle').forEach(btn => btn.addEventListener('click', manejarDetalle));
}

// Generar HTML de tarjeta
function crearTarjetaHTML(lugar) {
    const esFav = favoritos.has(lugar.id);
    return `
        <article class="card">
            <img src="${lugar.imagen || 'assets/placeholder.png'}" alt="${escapeHTML(lugar.nombre)}" class="card-img">
            <div class="card-body">
                <h3>${escapeHTML(lugar.nombre)}</h3>
                <p class="categoria">${escapeHTML(lugar.categoria)}</p>
                <p class="descripcion">${escapeHTML(truncar(lugar.descripcion || '', 120))}</p>
                <div class="card-actions">
                    <button class="btn btn-primary btn-detalle" data-id="${lugar.id}">Ver</button>
                    <button class="btn btn-outline btn-fav" data-id="${lugar.id}" aria-pressed="${esFav}">${esFav ? '★' : '☆'}</button>
                </div>
            </div>
        </article>
    `;
}

// Eventos de UI
function setupEventos() {
    if (inputBusqueda) inputBusqueda.addEventListener('input', e => { filtro.texto = e.target.value.trim().toLowerCase(); renderizar(); });
    if (selectCategoria) selectCategoria.addEventListener('change', e => { filtro.categoria = e.target.value; renderizar(); });
    if (selectOrden) selectOrden.addEventListener('change', e => { filtro.ordenar = e.target.value; renderizar(); });
    if (checkboxFavs) checkboxFavs.addEventListener('change', e => { filtro.soloFavoritos = e.target.checked; renderizar(); });
    // Cierre modal (si existe)
    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target.matches('.modal-close') || e.target === modal) closeModal();
        });
    }
}

// Aplicar filtros y orden
function aplicarFiltros(arr) {
    let res = arr.slice();
    if (filtro.texto) {
        res = res.filter(l => (l.nombre + ' ' + (l.descripcion || '')).toLowerCase().includes(filtro.texto));
    }
    if (filtro.categoria && filtro.categoria !== 'todos') {
        res = res.filter(l => l.categoria === filtro.categoria);
    }
    if (filtro.soloFavoritos) {
        res = res.filter(l => favoritos.has(l.id));
    }
    if (filtro.ordenar === 'nombre') {
        res.sort((a,b) => a.nombre.localeCompare(b.nombre));
    } else if (filtro.ordenar === 'popularidad') {
        res.sort((a,b) => (b.popularidad || 0) - (a.popularidad || 0));
    }
    return res;
}

// Manejo favoritos
function manejarFavorito(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    if (favoritos.has(id)) {
        favoritos.delete(id);
    } else {
        favoritos.add(id);
    }
    persistirFavoritos();
    renderizar();
}

function persistirFavoritos() {
    localStorage.setItem(CLAVE_FAVS, JSON.stringify(Array.from(favoritos)));
}

// Manejo detalle / modal / mapa
function manejarDetalle(e) {
    const id = e.currentTarget.dataset.id;
    const lugar = lugares.find(l => l.id === id);
    if (!lugar) return;
    abrirModal(lugar);
}

function abrirModal(lugar) {
    if (!modal) return;
    modalTitulo.textContent = lugar.nombre;
    modalCuerpo.innerHTML = `
        <p class="categoria">${escapeHTML(lugar.categoria)}</p>
        <p>${escapeHTML(lugar.descripcion || 'Sin descripción')}</p>
        <div id="mapPlaceholder" style="height:300px; margin-top:8px;"></div>
        <p class="meta">Dirección: ${escapeHTML(lugar.direccion || 'No disponible')}</p>
    `;
    modal.classList.add('open');
    // Inicializar mapa si Leaflet está disponible y hay coordenadas
    setTimeout(() => {
        const contMap = document.getElementById('mapPlaceholder');
        if (window.L && lugar.lat && lugar.lng && contMap) {
            contMap.innerHTML = '';
            const mapa = L.map(contMap).setView([lugar.lat, lugar.lng], 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(mapa);
            L.marker([lugar.lat, lugar.lng]).addTo(mapa).bindPopup(lugar.nombre).openPopup();
        } else if (contMap) {
            contMap.innerHTML = '<p>No hay mapa disponible.</p>';
        }
    }, 50);
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modalTitulo.textContent = '';
    modalCuerpo.innerHTML = '';
}

// Utilidades UI
function poblarCategorias() {
    if (!selectCategoria) return;
    const cats = Array.from(new Set(lugares.map(l => l.categoria))).sort();
    selectCategoria.innerHTML = `<option value="todos">Todas</option>` + cats.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('');
}

function truncar(texto, max) {
    return texto.length > max ? texto.slice(0, max - 1) + '…' : texto;
}

function escapeHTML(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Datos de ejemplo por si no existe el JSON
function ejemploLugares() {
    return [
        {
            id: 'p1',
            nombre: 'Plaza Central',
            categoria: 'Histórico',
            descripcion: 'Plaza principal con arquitectura colonial, eventos y artesanías.',
            direccion: 'Av. Principal 123',
            imagen: 'assets/plaza.jpg',
            lat: 40.4168,
            lng: -3.7038,
            popularidad: 95
        },
        {
            id: 'p2',
            nombre: 'Museo de Arte',
            categoria: 'Cultura',
            descripcion: 'Colección moderna y contemporánea con exposiciones temporales.',
            direccion: 'Calle Museo 7',
            imagen: 'assets/museo.jpg',
            lat: 40.4180,
            lng: -3.7060,
            popularidad: 88
        },
        {
            id: 'p3',
            nombre: 'Parque Natural',
            categoria: 'Naturaleza',
            descripcion: 'Senderos, miradores y áreas de picnic ideales para familias.',
            direccion: 'Carretera del Bosque km 4',
            imagen: 'assets/parque.jpg',
            lat: 40.4200,
            lng: -3.7100,
            popularidad: 80
        }
    ];
}