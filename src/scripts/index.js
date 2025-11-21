// Función para mostrar más contenido
function mostrarMas() {
  const loadmore = document.getElementById("load-more")
  if (loadmore) {
    loadmore.style.display = loadmore.style.display === "none" ? "flex" : "none"
  }
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

// Inicializar carrito al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const loadmorebtn = document.getElementById("load-morebtn")
  if (loadmorebtn) {
    loadmorebtn.addEventListener("click", mostrarMas)
  }

  updateCartCount()

  // Actualizar modal cuando se abre
  const cartModal = document.getElementById("cartModal")
  if (cartModal) {
    cartModal.addEventListener("shown.bs.modal", renderCartModal)
  }
})
