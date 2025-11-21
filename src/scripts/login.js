const LS_KEY = "usuariosRegistrados"
const bootstrap = window.bootstrap // Declare the bootstrap variable

function getUsuariosLocal() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || []
  } catch {
    return []
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm")
  if (form) {
    form.addEventListener("submit", loginUsuario)
  }

  updateCartCount()

  const cartModal = document.getElementById("cartModal")
  if (cartModal) {
    cartModal.addEventListener("shown.bs.modal", renderCartModal)
  }
})

function loginUsuario(event) {
  event.preventDefault()

  const email = document.getElementById("email").value.trim().toLowerCase()
  const password = document.getElementById("password").value

  // Validar campos vacíos
  if (!email || !password) {
    mostrarModal("Error", "Por favor completa todos los campos.")
    return
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    mostrarModal("Error", "Por favor ingresa un email válido.")
    return
  }

  const usuarios = getUsuariosLocal()

  // Buscar usuario con email y password coincidentes
  const usuarioValido = usuarios.find((u) => u.email?.toLowerCase() === email && u.password === password)

  if (usuarioValido) {
    // Guardar sesión del usuario
    localStorage.setItem(
      "usuarioActivo",
      JSON.stringify({
        id: usuarioValido.id,
        email: usuarioValido.email,
        nombre: usuarioValido.nombre,
        apellido: usuarioValido.apellido,
      }),
    )

    mostrarModal("Bienvenido", `Hola ${usuarioValido.nombre}, has iniciado sesión correctamente.`)

    // Redirigir después de 2 segundos
    setTimeout(() => {
      window.location.href = "./products.html"
    }, 2000)
  } else {
    mostrarModal("Error", "Email o contraseña incorrectos. Por favor verifica tus datos.")
  }
}

function mostrarModal(titulo, mensaje) {
  const tituloEl = document.getElementById("modalTitulo")
  const mensajeEl = document.getElementById("modalMensaje")
  const modalEl = document.getElementById("loginModal")

  if (!tituloEl || !mensajeEl || !modalEl) {
    alert(`${titulo}: ${mensaje}`)
    return
  }

  tituloEl.textContent = titulo
  mensajeEl.textContent = mensaje
  const modal = new bootstrap.Modal(modalEl)
  modal.show()
}

function verUsuariosRegistrados() {
  const usuarios = getUsuariosLocal()
  console.log("Usuarios registrados:", usuarios)
  return usuarios
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("gamermarketCart")) || []
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartLink = document.querySelector('a[href*="Cart"]')
  if (cartLink) {
    cartLink.textContent = `Cart (${totalItems} items)`
  }
}

function renderCartModal() {
  const cart = JSON.parse(localStorage.getItem("gamermarketCart")) || []
  const modalBody = document.getElementById("cart-modal-body")

  if (!modalBody) return

  if (cart.length === 0) {
    modalBody.innerHTML = "<p>Your cart is empty</p>"
    return
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  modalBody.innerHTML = `
        <div class="cart-items">
            ${cart
              .map(
                (item) => `
                <div class="cart-item d-flex align-items-center mb-3 p-2 border-bottom">
                    <img src="${item.thumbnail}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 5px;">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${item.title}</h6>
                        <p class="mb-0 text-success">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${item.id}, 1)">+</button>
                        <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart(${item.id})">×</button>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
        <div class="mt-3 pt-3 border-top">
            <h5>Total: $${total.toFixed(2)}</h5>
        </div>
    `
}

function changeQuantity(productId, delta) {
  const cart = JSON.parse(localStorage.getItem("gamermarketCart")) || []
  const item = cart.find((p) => p.id === productId)

  if (item) {
    item.quantity += delta
    if (item.quantity <= 0) {
      removeFromCart(productId)
    } else {
      localStorage.setItem("gamermarketCart", JSON.stringify(cart))
      updateCartCount()
      renderCartModal()
    }
  }
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("gamermarketCart")) || []
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("gamermarketCart", JSON.stringify(cart))
  updateCartCount()
  renderCartModal()
}
