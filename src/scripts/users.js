// Variables globales
const listaUsuarios = document.getElementById("listaUsuarios")
const searchInput = document.getElementById("searchUser")
const btnTodos = document.getElementById("btnTodos")
const btnComprador = document.getElementById("btnComprador")
const btnVendedor = document.getElementById("btnVendedor")

let todosLosUsuarios = []
const API_URL = "https://fakestoreapi.com/users"

// Cargar usuarios desde FakeStoreAPI
async function cargarUsuarios() {
  try {
    listaUsuarios.innerHTML = '<p class="text-white text-center col-12">Cargando usuarios...</p>'

    const response = await fetch(API_URL)
    if (!response.ok) throw new Error("Error al cargar usuarios")

    const usuarios = await response.json()

    // Asignar tipo aleatorio (comprador o vendedor) ya que la API no lo tiene
    todosLosUsuarios = usuarios.map((usuario) => ({
      ...usuario,
      tipo: Math.random() > 0.5 ? "comprador" : "vendedor",
      nombreCompleto: `${usuario.name.firstname} ${usuario.name.lastname}`,
    }))

    // Guardar en localStorage para uso posterior
    localStorage.setItem("usuarios", JSON.stringify(todosLosUsuarios))

    mostrarUsuarios(todosLosUsuarios)
  } catch (error) {
    console.error("Error:", error)
    listaUsuarios.innerHTML =
      '<p class="text-danger text-center col-12">Error al cargar usuarios. Intenta recargar la página.</p>'
  }
}

// Mostrar usuarios en la página
function mostrarUsuarios(usuarios) {
  listaUsuarios.innerHTML = ""

  if (usuarios.length === 0) {
    listaUsuarios.innerHTML = '<p class="text-white text-center col-12">No se encontraron usuarios.</p>'
    return
  }

  usuarios.forEach((usuario) => {
    mostrarUsuario(usuario)
  })
}

// Mostrar un usuario individual
function mostrarUsuario(usuario) {
  const imagenUsuario =
    usuario.tipo === "comprador" ? "../images/users/usuario_comprador.png" : "../images/users/usuario_vendedor.png"

  const col = document.createElement("div")
  col.classList.add("col-6", "col-lg-4")

  col.innerHTML = `
        <div class="card bg-dark text-white h-100">
            <img src="${imagenUsuario}" class="card-img-top" alt="${usuario.nombreCompleto}">
            <div class="card-body">
                <h5 class="card-title">${usuario.nombreCompleto}</h5>
                <p class="card-text text-capitalize">${usuario.tipo}</p>
                <p class="card-text small text-muted">${usuario.email}</p>
            </div>
        </div>
    `

  listaUsuarios.appendChild(col)
}

// Buscar usuarios en tiempo real
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase()

  const resultados = todosLosUsuarios.filter(
    (usuario) =>
      usuario.nombreCompleto.toLowerCase().includes(keyword) ||
      usuario.email.toLowerCase().includes(keyword) ||
      usuario.username.toLowerCase().includes(keyword),
  )

  mostrarUsuarios(resultados)
})

// Filtrar por tipo: Todos
btnTodos.addEventListener("click", () => {
  mostrarUsuarios(todosLosUsuarios)
  actualizarBotonActivo(btnTodos)
})

// Filtrar por tipo: Comprador
btnComprador.addEventListener("click", () => {
  const compradores = todosLosUsuarios.filter((usuario) => usuario.tipo === "comprador")
  mostrarUsuarios(compradores)
  actualizarBotonActivo(btnComprador)
})

// Filtrar por tipo: Vendedor
btnVendedor.addEventListener("click", () => {
  const vendedores = todosLosUsuarios.filter((usuario) => usuario.tipo === "vendedor")
  mostrarUsuarios(vendedores)
  actualizarBotonActivo(btnVendedor)
})

// Actualizar botón activo visualmente
function actualizarBotonActivo(botonActivo) {
  ;[btnTodos, btnComprador, btnVendedor].forEach((btn) => {
    btn.classList.remove("active")
  })
  botonActivo.classList.add("active")
}

// Función para debugging
function verUsuariosCargados() {
  console.table(todosLosUsuarios)
  console.log(`Total usuarios: ${todosLosUsuarios.length}`)
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

window.addEventListener("DOMContentLoaded", () => {
  updateCartCount()

  const cartModal = document.getElementById("cartModal")
  if (cartModal) {
    cartModal.addEventListener("shown.bs.modal", renderCartModal)
  }
})

// Inicializar: cargar usuarios al cargar la página
cargarUsuarios()
