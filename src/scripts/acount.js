// Funciones para manejar la cuenta del usuario
const STORAGE_KEYS = {
  USER_SESSION: "usuarioActivo",
  USER_ADDRESSES: "gamermarket_addresses",
  PAYMENT_METHODS: "gamermarket_payments",
}

// Importar Bootstrap
const bootstrap = window.bootstrap

// Verificar si hay sesión activa al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  checkUserSession()
  loadUserData()
  loadAddresses()
  loadPaymentMethods()
})

// Verificar sesión del usuario
function checkUserSession() {
  const userSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SESSION) || "null")

  if (!userSession) {
    // Si no hay sesión, redirigir al login
    alert("Debes iniciar sesión para acceder a tu cuenta")
    window.location.href = "./login.html"
    return
  }
}

// Cargar datos del usuario desde la sesión
function loadUserData() {
  const userSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SESSION) || "null")

  if (userSession) {
    document.getElementById("firstName").value = userSession.nombre || ""
    document.getElementById("lastName").value = userSession.apellido || ""
    document.getElementById("login-email").textContent = userSession.email || ""
  }
}

// Cambiar entre pestañas
function switchTab(tabName) {
  // Ocultar todos los contenidos
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.style.display = "none"
  })

  // Desactivar todos los tabs
  document.querySelectorAll(".nav-link").forEach((tab) => {
    tab.classList.remove("active", "text-info")
    tab.classList.add("text-white")
  })

  // Mostrar el contenido seleccionado
  document.getElementById(`content-${tabName}`).style.display = "block"

  // Activar el tab seleccionado
  const activeTab = document.getElementById(`tab-${tabName === "mi-cuenta" ? "mi-cuenta" : tabName}`)
  activeTab.classList.add("active", "text-info")
  activeTab.classList.remove("text-white")
}

// Actualizar información personal
function updatePersonalInfo(event) {
  event.preventDefault()

  const firstName = document.getElementById("firstName").value
  const lastName = document.getElementById("lastName").value

  // Obtener sesión actual
  const userSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SESSION) || "{}")

  // Actualizar datos
  userSession.nombre = firstName
  userSession.apellido = lastName

  // Guardar en localStorage
  localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(userSession))

  // También actualizar en la lista de usuarios registrados
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados") || "[]")
  const userIndex = usuarios.findIndex((u) => u.email === userSession.email)

  if (userIndex !== -1) {
    usuarios[userIndex].nombre = firstName
    usuarios[userIndex].apellido = lastName
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios))
  }

  showConfirmation("Información actualizada", "Tu información personal se ha actualizado correctamente")
}

// Resetear información personal
function resetPersonalInfo() {
  loadUserData()
}

// Cargar direcciones
function loadAddresses() {
  const addresses = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_ADDRESSES) || "[]")
  const addressesList = document.getElementById("addresses-list")

  if (addresses.length === 0) {
    addressesList.innerHTML = `
      <div class="alert bg-dark text-white text-center border border-secondary">
        No tienes direcciones guardadas
      </div>
    `
  } else {
    addressesList.innerHTML = addresses
      .map(
        (addr, index) => `
      <div class="border border-secondary p-3 mb-3 rounded bg-dark">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong class="text-info">${addr.label}</strong>
            <div class="text-white mt-2">${addr.street}</div>
            <div class="text-white">${addr.city}, ${addr.zip}</div>
          </div>
          <button class="btn btn-outline-danger btn-sm" onclick="removeAddress(${index})">
            Eliminar
          </button>
        </div>
      </div>
    `,
      )
      .join("")
  }
}

// Agregar dirección
function addAddress(event) {
  event.preventDefault()

  const newAddress = {
    label: document.getElementById("address-label").value,
    street: document.getElementById("address-street").value,
    city: document.getElementById("address-city").value,
    zip: document.getElementById("address-zip").value,
  }

  const addresses = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_ADDRESSES) || "[]")
  addresses.push(newAddress)
  localStorage.setItem(STORAGE_KEYS.USER_ADDRESSES, JSON.stringify(addresses))

  // Cerrar modal y limpiar formulario
  bootstrap.Modal.getInstance(document.getElementById("modalAddAddress")).hide()
  document.getElementById("form-add-address").reset()

  // Recargar lista
  loadAddresses()
  showConfirmation("Dirección agregada", "La dirección se ha guardado correctamente")
}

// Eliminar dirección
function removeAddress(index) {
  const addresses = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_ADDRESSES) || "[]")
  addresses.splice(index, 1)
  localStorage.setItem(STORAGE_KEYS.USER_ADDRESSES, JSON.stringify(addresses))
  loadAddresses()
  showConfirmation("Dirección eliminada", "La dirección se ha eliminado correctamente")
}

// Cargar métodos de pago
function loadPaymentMethods() {
  const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS) || "[]")
  const paymentsList = document.getElementById("payment-methods-list")

  if (payments.length === 0) {
    paymentsList.innerHTML = `
      <div class="alert bg-dark text-white text-center border border-secondary">
        No tienes métodos de pago guardados
      </div>
    `
  } else {
    paymentsList.innerHTML = payments
      .map((payment, index) => {
        const lastDigits = payment.cardNumber.slice(-4)
        const cardIcon = payment.cardType === "Visa" ? "💳" : payment.cardType === "Mastercard" ? "💳" : "💳"

        return `
        <div class="border border-secondary p-3 mb-3 rounded bg-dark">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              ${cardIcon} <strong class="text-white">${payment.cardType} (${lastDigits})</strong>
              ${index === 0 ? '<span class="badge bg-info text-dark ms-2">Default</span>' : ""}
              <div class="text-white mt-2">Expiration date: ${payment.expiry}</div>
              <div class="text-white">Cardholder: ${payment.holder}</div>
            </div>
            <button class="btn btn-outline-danger btn-sm" onclick="removePaymentMethod(${index})">
              Eliminar
            </button>
          </div>
        </div>
      `
      })
      .join("")
  }
}

// Agregar método de pago
function addPaymentMethod(event) {
  event.preventDefault()

  const cardNumber = document.getElementById("card-number").value
  const expiry = document.getElementById("card-expiry").value

  // Convertir fecha YYYY-MM a MM/YYYY
  const [year, month] = expiry.split("-")
  const formattedExpiry = `${month}/${year}`

  const newPayment = {
    cardType: document.getElementById("card-type").value,
    cardNumber: cardNumber,
    holder: document.getElementById("card-holder").value,
    expiry: formattedExpiry,
  }

  const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS) || "[]")
  payments.push(newPayment)
  localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(payments))

  // Cerrar modal y limpiar formulario
  bootstrap.Modal.getInstance(document.getElementById("modalAddPayment")).hide()
  document.getElementById("form-add-payment").reset()

  // Recargar lista
  loadPaymentMethods()
  showConfirmation("Tarjeta agregada", "El método de pago se ha guardado correctamente")
}

// Eliminar método de pago
function removePaymentMethod(index) {
  const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS) || "[]")
  payments.splice(index, 1)
  localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(payments))
  loadPaymentMethods()
  showConfirmation("Tarjeta eliminada", "El método de pago se ha eliminado correctamente")
}

// Mostrar mensaje de confirmación
function showConfirmation(title, message) {
  document.getElementById("confirmacion-title").textContent = title
  document.getElementById("confirmacion-message").textContent = message
  new bootstrap.Modal(document.getElementById("modalConfirmacion")).show()
}
