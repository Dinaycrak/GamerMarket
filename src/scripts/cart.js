// Sistema global de gestión del carrito
// Este archivo debe ser incluido en todas las páginas HTML

// Función para obtener el carrito desde localStorage
function obtenerCarrito() {
  const carrito = localStorage.getItem("gamermarketCart")
  return carrito ? JSON.parse(carrito) : []
}

// Función para guardar el carrito en localStorage
function guardarCarrito(carrito) {
  localStorage.setItem("gamermarketCart", JSON.stringify(carrito))
  actualizarContadorCarrito()
}

// Función para actualizar el contador del carrito en el header
function actualizarContadorCarrito() {
  const carrito = obtenerCarrito()
  const totalItems = carrito.reduce((total, item) => total + (item.cantidad || item.quantity || 1), 0)

  // Buscar todos los elementos del carrito en el header
  const cartLinks = document.querySelectorAll('a[href*="Cart"], #cart-count, .cart-count')
  cartLinks.forEach((element) => {
    if (element.tagName === "A") {
      element.textContent = `Cart (${totalItems} items)`
    } else {
      element.textContent = totalItems
    }
  })
}

// Función para añadir producto al carrito
function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito()

  // Verificar si el producto ya existe en el carrito
  const productoExistente = carrito.find((item) => item.id === producto.id)

  if (productoExistente) {
    // Si existe, incrementar la cantidad
    productoExistente.cantidad = (productoExistente.cantidad || productoExistente.quantity || 0) + 1
    productoExistente.quantity = productoExistente.cantidad // Mantener compatibilidad
  } else {
    // Si no existe, añadirlo con cantidad 1
    carrito.push({
      id: producto.id,
      title: producto.title,
      price: producto.price,
      thumbnail: producto.thumbnail,
      cantidad: 1,
      quantity: 1, // Mantener compatibilidad
    })
  }

  guardarCarrito(carrito)
  mostrarNotificacion("Producto añadido al carrito")
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(productoId) {
  let carrito = obtenerCarrito()
  carrito = carrito.filter((item) => item.id !== productoId)
  guardarCarrito(carrito)
  renderizarCarrito()
}

// Función para actualizar cantidad de un producto
function actualizarCantidad(productoId, nuevaCantidad) {
  const carrito = obtenerCarrito()
  const producto = carrito.find((item) => item.id === productoId)

  if (producto) {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId)
    } else {
      producto.cantidad = nuevaCantidad
      producto.quantity = nuevaCantidad // Mantener compatibilidad
      guardarCarrito(carrito)
      renderizarCarrito()
    }
  }
}

// Función para renderizar el contenido del modal del carrito
function renderizarCarrito() {
  const carrito = obtenerCarrito()
  const modalBody = document.querySelector("#cartModal .modal-body")

  if (!modalBody) {
    console.warn("Modal del carrito no encontrado en esta página")
    return
  }

  if (carrito.length === 0) {
    modalBody.innerHTML = '<p class="text-center text-white">Your cart is empty</p>'
    return
  }

  // Calcular total
  const total = carrito.reduce((sum, item) => {
    const cantidad = item.cantidad || item.quantity || 1
    return sum + item.price * cantidad
  }, 0)

  // Generar HTML del carrito
  let html = '<div class="cart-items">'

  carrito.forEach((item) => {
    const cantidad = item.cantidad || item.quantity || 1
    const subtotal = item.price * cantidad

    html += `
            <div class="cart-item mb-3 p-3" style="display: flex; gap: 15px; align-items: center; background-color: #1a1a2e; border-radius: 8px;">
                <img src="${item.thumbnail}" 
                     alt="${item.title}" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; background-color: #2d2d44;"
                     onerror="this.src='https://via.placeholder.com/80x80/2d3748/64ffda?text=Producto'">
                <div style="flex: 1;">
                    <h6 style="margin: 0; color: #64ffda; font-size: 14px;">${item.title}</h6>
                    <p style="margin: 5px 0; color: #4ade80; font-weight: bold;">$${item.price.toFixed(2)}</p>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                        <button class="btn btn-sm btn-outline-light" onclick="actualizarCantidad(${item.id}, ${cantidad - 1})" style="padding: 2px 8px;">-</button>
                        <span style="color: white; font-weight: bold; min-width: 20px; text-align: center;">${cantidad}</span>
                        <button class="btn btn-sm btn-outline-light" onclick="actualizarCantidad(${item.id}, ${cantidad + 1})" style="padding: 2px 8px;">+</button>
                        <button class="btn btn-sm btn-danger ms-2" onclick="eliminarDelCarrito(${item.id})" style="padding: 2px 12px;">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <strong style="color: #64ffda; font-size: 16px;">$${subtotal.toFixed(2)}</strong>
                </div>
            </div>
        `
  })

  html += `
        </div>
        <div class="cart-total mt-4 pt-3" style="border-top: 2px solid #2d2d44; text-align: right;">
            <h5 style="color: white; margin-bottom: 15px;">
                Total: <span style="color: #4ade80; font-size: 24px; font-weight: bold;">$${total.toFixed(2)}</span>
            </h5>
            <button class="btn btn-success btn-lg w-100" onclick="procesarCompra()" style="background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%); border: none; font-weight: bold;">
                <i class="fas fa-credit-card"></i> Proceder al pago
            </button>
        </div>
    `

  modalBody.innerHTML = html
}

// Función para procesar la compra
function procesarCompra() {
  const carrito = obtenerCarrito()
  const total = carrito.reduce((sum, item) => {
    const cantidad = item.cantidad || item.quantity || 1
    return sum + item.price * cantidad
  }, 0)

  alert(`¡Gracias por tu compra!\n\nTotal: $${total.toFixed(2)}\n\nFuncionalidad de checkout en desarrollo.`)

  // Opcional: Limpiar carrito después de la compra
  // localStorage.removeItem('gamermarketCart');
  // actualizarContadorCarrito();
  // renderizarCarrito();
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
  // Crear elemento de notificación
  const notificacion = document.createElement("div")
  notificacion.textContent = mensaje
  notificacion.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #64ffda 0%, #4ade80 100%);
        color: #1a202c;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 9999;
        font-weight: bold;
        box-shadow: 0 8px 16px rgba(100, 255, 218, 0.3);
        animation: slideIn 0.3s ease-out;
    `

  document.body.appendChild(notificacion)

  // Eliminar después de 3 segundos
  setTimeout(() => {
    notificacion.style.animation = "slideOut 0.3s ease-out"
    setTimeout(() => notificacion.remove(), 300)
  }, 3000)
}

// Añadir estilos para las animaciones
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Actualizar contador del carrito
  actualizarContadorCarrito()

  // Si existe el modal del carrito, renderizarlo cuando se abra
  const cartModal = document.getElementById("cartModal")
  if (cartModal) {
    cartModal.addEventListener("show.bs.modal", () => {
      renderizarCarrito()
    })

    // También renderizar al cargar si el modal ya está visible
    if (cartModal.classList.contains("show")) {
      renderizarCarrito()
    }
  }
})

// Exponer funciones globalmente
window.obtenerCarrito = obtenerCarrito
window.agregarAlCarrito = agregarAlCarrito
window.eliminarDelCarrito = eliminarDelCarrito
window.actualizarCantidad = actualizarCantidad
window.actualizarContadorCarrito = actualizarContadorCarrito
window.procesarCompra = procesarCompra
window.renderizarCarrito = renderizarCarrito
