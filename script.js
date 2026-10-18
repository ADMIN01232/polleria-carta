// 1. Detectar el número de Mesa desde la URL (?mesa=1)
const urlParams = new URLSearchParams(window.location.search);
const numeroMesa = urlParams.get('mesa') || 'General / Llevar';

document.getElementById('info-mesa').innerText = `Mesa: ${numeroMesa}`;

// 2. Menú de la Pollería
const menu = [
  { id: 1, nombre: '1/4 de Pollo a la Brasa', precio: 11.00, img: 'Imagenes/1 cuarto de pollo.jpg', desc: 'Incluye papas fritas y ensalada.' },
  { id: 2, nombre: '1/2 Pollo a la Brasa', precio: 20.00, img: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400', desc: 'Incluye papas fritas familiares y ensalada.' },
  { id: 3, nombre: '1 Pollo Entero a la Brasa', precio: 44.00, img: 'Imagenes/pollo entero.jpg', desc: 'Incluye papas familiares, ensalada y cremas.' },
  { id: 4, nombre: 'Porción de Papas Nativas', precio: 15.00, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', desc: 'Papas crujientes doradas al hilo.' },
  { id: 5, nombre: 'Inca Kola 1.5L', precio: 10.00, img: 'Imagenes/incacola.jpg', desc: 'Gaseosa helada.' },
  { id: 6, nombre: 'Jugos Frescos 1.5L', precio: 20.00, img: 'Imagenes/jugos de 20.jpg', desc: 'Jugo natural de fruta.' },
  { id: 7, nombre: 'Mostrito', precio: 10.00, img: 'Imagenes/mostrito.jpg', desc: '1/8 de pollo con chaufa y papas.' },
  { id: 8, nombre: 'Mostro', precio: 14.00, img: 'Imagenes/mostro.jpg', desc: '1/4 pollo con chaufa y papas.' },
];

let carrito = [];
let platoSeleccionado = null;
let cantidadActual = 1;

// Renderizar Menú
function cargarMenu() {
  const contenedor = document.getElementById('grid-platillos');
  contenedor.innerHTML = '';
  
  menu.forEach(plato => {
    const card = document.createElement('div');
    card.className = 'card-plato';
    card.onclick = () => abrirModal(plato);
    card.innerHTML = `
      <img src="${plato.img}" alt="${plato.nombre}">
      <div class="card-info">
        <h4>${plato.nombre}</h4>
        <p class="precio">S/ ${plato.precio.toFixed(2)}</p>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// Abrir Modal de Selección
function abrirModal(plato) {
  platoSeleccionado = plato;
  cantidadActual = 1;
  document.getElementById('modal-titulo').innerText = plato.nombre;
  document.getElementById('modal-descripcion').innerText = plato.desc || '';
  document.getElementById('modal-precio').innerText = `S/ ${plato.precio.toFixed(2)}`;
  document.getElementById('modal-img').src = plato.img;
  document.getElementById('modal-cantidad').innerText = cantidadActual;
  document.getElementById('modal-notas').value = '';
  document.getElementById('modal-detalle').classList.remove('hidden');
}

function cerrarModal() {
  document.getElementById('modal-detalle').classList.add('hidden');
}

function cambiarCantidad(delta) {
  if (cantidadActual + delta >= 1) {
    cantidadActual += delta;
    document.getElementById('modal-cantidad').innerText = cantidadActual;
  }
}

// Agregar al Carrito
function confirmarAgregar() {
  const notas = document.getElementById('modal-notas').value;
  carrito.push({
    ...platoSeleccionado,
    cantidad: cantidadActual,
    notas: notas,
    subtotal: platoSeleccionado.precio * cantidadActual
  });
  cerrarModal();
  actualizarCarrito();
}

// Función para eliminar un ítem específico del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Actualizar Vista del Carrito (Con botón de Cancelar/Eliminar)
function actualizarCarrito() {
  const contenedor = document.getElementById('lista-carrito');
  const btnEnviar = document.getElementById('btn-enviar');
  
  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="vacio">No has seleccionado ningún plato aún.</p>';
    document.getElementById('precio-total').innerText = 'S/ 0.00';
    btnEnviar.disabled = true;
    return;
  }

  contenedor.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    total += item.subtotal;
    const div = document.createElement('div');
    div.className = 'item-carrito';
    div.innerHTML = `
      <div class="item-info">
        <strong>${item.cantidad}x ${item.nombre}</strong> - S/ ${item.subtotal.toFixed(2)}
        ${item.notas ? `<br><small><em>Nota: ${item.notas}</em></small>` : ''}
      </div>
      <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})" title="Eliminar plato">❌</button>
    `;
    contenedor.appendChild(div);
  });

  document.getElementById('precio-total').innerText = `S/ ${total.toFixed(2)}`;
  btnEnviar.disabled = false;
}

// Enviar Pedido a WhatsApp
function enviarPedido() {
  let mensaje = `*NUEVO PEDIDO - MESA ${numeroMesa}*\n\n`;
  let total = 0;

  carrito.forEach(item => {
    mensaje += `• *${item.cantidad}x* ${item.nombre} (S/ ${item.subtotal.toFixed(2)})\n`;
    if (item.notas) mensaje += `   _Nota: ${item.notas}_\n`;
    total += item.subtotal;
  });

  mensaje += `\n*TOTAL: S/ ${total.toFixed(2)}*`;

  const telefonoPolleria = '90000000'; 
  const urlWhatsApp = `https://wa.me/${telefonoPolleria}?text=${encodeURIComponent(mensaje)}`;

  window.open(urlWhatsApp, '_blank');
}

// Inicializar
cargarMenu();