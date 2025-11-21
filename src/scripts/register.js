// Clave para localStorage
const LS_KEY = "usuariosRegistrados"
const API_URL = "https://fakestoreapi.com/users"

/**
 * Obtiene la lista de usuarios del localStorage
 * @returns {Array} Lista de usuarios registrados
 */
function getUsuariosLocal() {
  try {
    const data = localStorage.getItem(LS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error al obtener usuarios del localStorage:", error)
    return []
  }
}

/**
 * Guarda la lista de usuarios en localStorage
 * @param {Array} lista - Lista de usuarios a guardar
 */
function setUsuariosLocal(lista) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(lista))
  } catch (error) {
    console.error("Error al guardar usuarios en localStorage:", error)
  }
}

/**
 * Carga los usuarios desde FakeStoreAPI y los guarda en localStorage
 * Solo lo hace si localStorage está vacío
 */
async function cargarUsuariosDesdeAPI() {
  const usuariosExistentes = getUsuariosLocal()

  // Si ya hay usuarios en localStorage, no cargar de nuevo
  if (usuariosExistentes.length > 0) {
    console.log(`Ya hay ${usuariosExistentes.length} usuarios en localStorage`)
    return
  }

  try {
    console.log("Cargando usuarios desde FakeStoreAPI...")
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const usuariosAPI = await response.json()

    // Transformar los usuarios de la API al formato de nuestra aplicación
    const usuariosFormateados = usuariosAPI.map((user) => ({
      id: user.id,
      nombre: user.name.firstname,
      apellido: user.name.lastname,
      email: user.email,
      telefono: user.phone,
      password: user.password, // La API provee una contraseña
      fechaRegistro: new Date().toISOString(),
      fuenteAPI: true, // Marcador para identificar usuarios de la API
    }))

    // Guardar en localStorage
    setUsuariosLocal(usuariosFormateados)
    console.log(`${usuariosFormateados.length} usuarios cargados desde la API y guardados en localStorage`)
  } catch (error) {
    console.error("Error al cargar usuarios desde la API:", error)
    // Si falla, continuar con localStorage vacío
  }
}

/**
 * Inicializa el formulario cuando el DOM está listo
 */
window.addEventListener("DOMContentLoaded", async () => {
  await cargarUsuariosDesdeAPI()

  const form = document.getElementById("registerForm")

  if (!form) {
    console.error("No se encontró el formulario de registro")
    return
  }

  form.addEventListener("submit", registrarUsuario)

  console.log("Formulario de registro inicializado correctamente")

  updateCartCount()

  const cartModal = document.getElementById("cartModal")
  if (cartModal) {
    cartModal.addEventListener("shown.bs.modal", renderCartModal)
  }
})

/**
 * Maneja el evento de envío del formulario de registro
 * @param {Event} event - Evento del formulario
 */
function registrarUsuario(event) {
  event.preventDefault()

  // Obtener valores de los campos
  const nombre = document.getElementById("nombre")?.value.trim()
  const apellido = document.getElementById("apellido")?.value.trim()
  const email = document.getElementById("email")?.value.trim().toLowerCase()
  const telefono = document.getElementById("telefono")?.value.trim()
  const password = document.getElementById("password")?.value
  const confirmar = document.getElementById("confirmar")?.value

  // Validar que todos los campos estén completos
  if (!nombre || !apellido || !email || !telefono || !password || !confirmar) {
    return mostrarModal("Error", "Por favor completa todos los campos.")
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return mostrarModal("Error", "Por favor ingresa un email válido.")
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    return mostrarModal("Error", "La contraseña debe tener al menos 6 caracteres.")
  }

  // Validar que las contraseñas coincidan
  if (password !== confirmar) {
    return mostrarModal("Error", "Las contraseñas no coinciden.")
  }

  // Verificar si el usuario ya existe
  const usuarios = getUsuariosLocal()
  const yaExiste = usuarios.some((u) => u.email === email)

  if (yaExiste) {
    return mostrarModal(
      "Usuario ya registrado",
      "Este correo electrónico ya está en uso. Por favor usa otro o inicia sesión.",
    )
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    id: Date.now(), // ID único basado en timestamp
    nombre,
    apellido,
    email,
    telefono,
    password,
    fechaRegistro: new Date().toISOString(),
    fuenteAPI: false, // Marcador para identificar usuarios nuevos
  }

  // Guardar usuario
  usuarios.push(nuevoUsuario)
  setUsuariosLocal(usuarios)

  // Mostrar mensaje de éxito
  mostrarModal("Registro exitoso", "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.")

  // Limpiar formulario
  limpiarFormulario()

  // Opcional: Redirigir al login después de 2 segundos
  setTimeout(() => {
    // Descomenta la siguiente línea si quieres redirigir automáticamente
    // window.location.href = "./login.html";
  }, 2000)
}

/**
 * Muestra un modal de Bootstrap con un mensaje
 * @param {string} titulo - Título del modal
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarModal(titulo, mensaje) {
  const tituloEl = document.getElementById("modalTitulo")
  const mensajeEl = document.getElementById("modalMensaje")
  const modalEl = document.getElementById("registroModal")

  // Validar que los elementos existan
  if (!tituloEl || !mensajeEl || !modalEl) {
    console.error("No se encontraron los elementos del modal")
    alert(`${titulo}: ${mensaje}`)
    return
  }

  // Configurar contenido del modal
  tituloEl.textContent = titulo
  mensajeEl.textContent = mensaje

  // Mostrar modal usando Bootstrap 5
  try {
    const bootstrap = window.bootstrap // Declare the bootstrap variable
    const modal = new bootstrap.Modal(modalEl)
    modal.show()
  } catch (error) {
    console.error("Error al mostrar el modal:", error)
    alert(`${titulo}: ${mensaje}`)
  }
}

/**
 * Limpia todos los campos del formulario
 */
function limpiarFormulario() {
  const campos = ["nombre", "apellido", "email", "telefono", "password", "confirmar"]

  campos.forEach((id) => {
    const elemento = document.getElementById(id)
    if (elemento) {
      elemento.value = ""
    }
  })
}

// Función adicional para ver usuarios registrados (útil para debugging)
function verUsuariosRegistrados() {
  const usuarios = getUsuariosLocal()
  console.table(
    usuarios.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
      telefono: u.telefono,
      fechaRegistro: u.fechaRegistro,
      fuente: u.fuenteAPI ? "FakeStoreAPI" : "Registro Local",
    })),
  )
  return usuarios
}

// Exportar función para uso en consola durante desarrollo
window.verUsuariosRegistrados = verUsuariosRegistrados

// Funciones para el carrito
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
