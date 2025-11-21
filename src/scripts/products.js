// Array de productos gaming personalizados
const productosGaming = [
  // Consolas
  {
    id: 1,
    title: "PlayStation 5 Pro",
    description: "Consola de nueva generación con 8K y Ray Tracing",
    price: 599.99,
    thumbnail: "/playstation-5-console.png",
    category: "consolas",
    stock: 15,
  },
  {
    id: 2,
    title: "Xbox Series X",
    description: "La consola más potente de Xbox",
    price: 499.99,
    thumbnail: "/xbox-series-x.png",
    category: "consolas",
    stock: 20,
  },
  {
    id: 3,
    title: "Nintendo Switch OLED",
    description: "Consola híbrida con pantalla OLED mejorada",
    price: 349.99,
    thumbnail: "/nintendo-switch-oled.jpg",
    category: "consolas",
    stock: 25,
  },
  {
    id: 4,
    title: "Steam Deck",
    description: "PC portátil para jugar en cualquier lugar",
    price: 399.99,
    thumbnail: "/steam-deck-gaming-portable.jpg",
    category: "consolas",
    stock: 12,
  },

  // PCs Gaming
  {
    id: 5,
    title: "PC Gaming RTX 4090",
    description: "PC Gamer de alta gama con RTX 4090 y i9-13900K",
    price: 3499.99,
    thumbnail: "/gaming-pc-rgb-tower.jpg",
    category: "pcs",
    stock: 5,
  },
  {
    id: 6,
    title: "PC Gaming RTX 4070",
    description: "PC Gaming balanceado con RTX 4070 y Ryzen 7",
    price: 1899.99,
    thumbnail: "/gaming-desktop-computer-rgb.jpg",
    category: "pcs",
    stock: 10,
  },
  {
    id: 7,
    title: "PC Gaming Budget",
    description: "PC Gaming económico con GTX 1660 Super",
    price: 899.99,
    thumbnail: "/budget-gaming-pc-tower.jpg",
    category: "pcs",
    stock: 18,
  },

  // Laptops Gaming
  {
    id: 8,
    title: "ROG Strix G18",
    description: "Laptop gaming con RTX 4080 y pantalla 240Hz",
    price: 2499.99,
    thumbnail: "/asus-rog-gaming-laptop.jpg",
    category: "laptops",
    stock: 8,
  },
  {
    id: 9,
    title: "MSI Raider GE78",
    description: "Laptop gaming premium con RGB y RTX 4070",
    price: 2199.99,
    thumbnail: "/msi-gaming-laptop-rgb.jpg",
    category: "laptops",
    stock: 7,
  },
  {
    id: 10,
    title: "Lenovo Legion 5 Pro",
    description: "Laptop gaming con gran relación calidad-precio",
    price: 1499.99,
    thumbnail: "/lenovo-legion-gaming-laptop.jpg",
    category: "laptops",
    stock: 15,
  },
  {
    id: 11,
    title: "Razer Blade 15",
    description: "Laptop gaming compacta y potente",
    price: 2799.99,
    thumbnail: "/razer-blade-gaming-laptop.jpg",
    category: "laptops",
    stock: 6,
  },

  // Repuestos
  {
    id: 12,
    title: "NVIDIA RTX 4090",
    description: "Tarjeta gráfica más potente del mercado",
    price: 1599.99,
    thumbnail: "/nvidia-rtx-4090-graphics-card.jpg",
    category: "repuestos",
    stock: 10,
  },
  {
    id: 13,
    title: "AMD Ryzen 9 7950X",
    description: "Procesador de 16 núcleos para gaming extremo",
    price: 699.99,
    thumbnail: "/amd-ryzen-processor.jpg",
    category: "repuestos",
    stock: 20,
  },
  {
    id: 14,
    title: "Corsair Vengeance RGB 32GB",
    description: "Memoria RAM DDR5 6000MHz con RGB",
    price: 199.99,
    thumbnail: "/corsair-vengeance-rgb-ram.jpg",
    category: "repuestos",
    stock: 30,
  },
  {
    id: 15,
    title: "Samsung 990 PRO 2TB",
    description: "SSD NVMe Gen4 ultra rápido",
    price: 249.99,
    thumbnail: "/samsung-ssd-nvme.jpg",
    category: "repuestos",
    stock: 25,
  },
  {
    id: 16,
    title: "Cooler Master AIO 360mm",
    description: "Sistema de refrigeración líquida con RGB",
    price: 179.99,
    thumbnail: "/rgb-liquid-cooling-system.jpg",
    category: "repuestos",
    stock: 15,
  },
  {
    id: 17,
    title: "EVGA SuperNOVA 1000W",
    description: "Fuente de poder modular 80+ Gold",
    price: 199.99,
    thumbnail: "/gaming-power-supply.jpg",
    category: "repuestos",
    stock: 22,
  },
]

// Variables globales
let allProducts = []
let currentCategory = "todos"
let searchTerm = ""

async function init() {
  await loadProducts()
  setupEventListeners()
  displayProducts()
}

async function loadProducts() {
  try {
    const storedProducts = localStorage.getItem("gamermarketProducts")

    if (storedProducts) {
      allProducts = JSON.parse(storedProducts)
      return
    }

    const [laptopsRes, smartphonesRes, tabletsRes] = await Promise.all([
      fetch("https://dummyjson.com/products/category/laptops"),
      fetch("https://dummyjson.com/products/category/smartphones"),
      fetch("https://dummyjson.com/products/category/tablets"),
    ])

    const [laptopsData, smartphonesData, tabletsData] = await Promise.all([
      laptopsRes.json(),
      smartphonesRes.json(),
      tabletsRes.json(),
    ])

    allProducts = [
      ...laptopsData.products.map((p) => ({ ...p, category: "laptops" })),
      ...smartphonesData.products.slice(0, 5).map((p) => ({
        ...p,
        id: p.id + 100,
        title: p.title.replace("Phone", "Gaming Console"),
        description: "Consola portátil de última generación",
        category: "consolas",
      })),
      ...tabletsData.products.slice(0, 3).map((p) => ({
        ...p,
        id: p.id + 200,
        title: p.title.replace("Tablet", "Gaming PC"),
        description: "PC Gaming de alto rendimiento",
        price: p.price * 2,
        category: "pcs",
      })),
      ...tabletsData.products.slice(3, 7).map((p) => ({
        ...p,
        id: p.id + 300,
        title: p.title.replace("Tablet", "Gaming Component"),
        description: "Componente de alto rendimiento",
        category: "repuestos",
      })),
    ]

    localStorage.setItem("gamermarketProducts", JSON.stringify(allProducts))
  } catch (error) {
    console.error("Error al cargar productos:", error)
    allProducts = []
    alert("Error al cargar productos. Por favor, recarga la página.")
  }
}

function setupEventListeners() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      currentCategory = btn.dataset.category
      displayProducts()
    })
  })

  document.getElementById("search-input").addEventListener("input", (e) => {
    searchTerm = e.target.value.toLowerCase()
    displayProducts()
  })
}

function displayProducts() {
  const container = document.getElementById("products-container")
  let filteredProducts = allProducts

  if (currentCategory !== "todos") {
    filteredProducts = filteredProducts.filter((p) => p.category === currentCategory)
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (p) => p.title.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm),
    )
  }

  if (filteredProducts.length === 0) {
    container.innerHTML = '<div class="col-12 text-center text-white"><p>No se encontraron productos</p></div>'
    return
  }

  container.innerHTML = filteredProducts.map(createProductCard).join("")

  container.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      addToCart(Number.parseInt(e.target.dataset.productId))
    })
  })

  container.querySelectorAll(".product-image").forEach((img) => {
    img.addEventListener("error", function () {
      this.src = getPlaceholderImage(this.dataset.category)
    })
  })
}

function getPlaceholderImage(category) {
  const placeholders = {
    consolas: "https://via.placeholder.com/400x300/1a1a2e/eee?text=Gaming+Console",
    pcs: "https://via.placeholder.com/400x300/1a1a2e/eee?text=Gaming+PC",
    laptops: "https://via.placeholder.com/400x300/1a1a2e/eee?text=Gaming+Laptop",
    repuestos: "https://via.placeholder.com/400x300/1a1a2e/eee?text=Gaming+Component",
  }
  return placeholders[category] || "https://via.placeholder.com/400x300/1a1a2e/eee?text=Gaming+Product"
}

function createProductCard(product) {
  const imageUrl = product.thumbnail || getPlaceholderImage(product.category)

  return `
    <div class="col-6 col-lg-4">
      <div class="card bg-dark text-white h-100">
        <img 
          src="${imageUrl}" 
          class="card-img-top product-image" 
          alt="${product.title}" 
          data-category="${product.category}"
          style="height: 200px; object-fit: cover; background-color: #2a2a3e;"
          loading="lazy"
        >
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text small text-secondary flex-grow-1">${product.description}</p>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <span class="h5 mb-0 text-success">$${product.price.toFixed(2)}</span>
            <button class="btn btn-sm btn-primary add-to-cart-btn" data-product-id="${product.id}">
              Añadir
            </button>
          </div>
          <small class="text-muted mt-1">Stock: ${product.stock}</small>
        </div>
      </div>
    </div>
  `
}

function addToCart(productId) {
  const product = allProducts.find((p) => p.id === productId)
  if (!product) return

  const carrito = JSON.parse(localStorage.getItem("gamermarketCart") || "[]")
  const productoExistente = carrito.find((item) => item.id === product.id)

  if (productoExistente) {
    productoExistente.cantidad = (productoExistente.cantidad || 1) + 1
  } else {
    carrito.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      description: product.description,
      cantidad: 1,
    })
  }

  localStorage.setItem("gamermarketCart", JSON.stringify(carrito))
  updateCartCount()
  renderCartModal()
  alert(`${product.title} añadido al carrito`)
}

function updateCartCount() {
  const carrito = JSON.parse(localStorage.getItem("gamermarketCart") || "[]")
  const totalItems = carrito.reduce((total, item) => total + (item.cantidad || 1), 0)

  const cartCountElement = document.getElementById("cart-count")
  if (cartCountElement) {
    cartCountElement.textContent = totalItems
  }
}

function renderCartModal() {
  const cartItemsContainer = document.getElementById("cart-items")
  if (!cartItemsContainer) return

  const carrito = JSON.parse(localStorage.getItem("gamermarketCart") || "[]")

  if (carrito.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty</p>'
    return
  }

  const total = carrito.reduce((sum, item) => sum + item.price * item.cantidad, 0)

  cartItemsContainer.innerHTML = `
    <div class="cart-items-list">
      ${carrito
        .map(
          (item) => `
        <div class="cart-item d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary">
          <div class="d-flex align-items-center flex-grow-1">
            <img src="${item.thumbnail || getPlaceholderImage("laptops")}" 
                 alt="${item.title}" 
                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;"
                 onerror="this.src='https://via.placeholder.com/60x60/1a1a2e/eee?text=Producto'">
            <div class="ms-3">
              <h6 class="mb-1">${item.title}</h6>
              <small class="text-success">$${item.price.toFixed(2)}</small>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-outline-light me-2" onclick="changeQuantity(${item.id}, -1)">-</button>
            <span class="mx-2">${item.cantidad}</span>
            <button class="btn btn-sm btn-outline-light ms-2" onclick="changeQuantity(${item.id}, 1)">+</button>
            <button class="btn btn-sm btn-danger ms-3" onclick="removeFromCart(${item.id})">✕</button>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
    <div class="cart-total mt-3 pt-3 border-top border-secondary">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Total:</h5>
        <h5 class="mb-0 text-success">$${total.toFixed(2)}</h5>
      </div>
      <button class="btn btn-success w-100 mt-3">Proceder al pago</button>
    </div>
  `
}

function changeQuantity(productId, change) {
  const carrito = JSON.parse(localStorage.getItem("gamermarketCart") || "[]")
  const producto = carrito.find((item) => item.id === productId)

  if (producto) {
    producto.cantidad += change
    if (producto.cantidad <= 0) {
      removeFromCart(productId)
      return
    }
    localStorage.setItem("gamermarketCart", JSON.stringify(carrito))
    updateCartCount()
    renderCartModal()
  }
}

function removeFromCart(productId) {
  let carrito = JSON.parse(localStorage.getItem("gamermarketCart") || "[]")
  carrito = carrito.filter((item) => item.id !== productId)
  localStorage.setItem("gamermarketCart", JSON.stringify(carrito))
  updateCartCount()
  renderCartModal()
}

document.addEventListener("DOMContentLoaded", () => {
  init()
  updateCartCount()
  const modalCarrito = document.getElementById("modalCarrito")
  if (modalCarrito) {
    modalCarrito.addEventListener("show.bs.modal", renderCartModal)
  }
})
