// Product Data
const products = [
    { id: 1, name: "Smartphone", price: 15000, category: "electronics", icon: "📱" },
    { id: 2, name: "Laptop", price: 45000, category: "electronics", icon: "💻" },
    { id: 3, name: "Headphones", price: 2000, category: "electronics", icon: "🎧" },
    { id: 4, name: "T-Shirt", price: 799, category: "fashion", icon: "👕" },
    { id: 5, name: "Shoes", price: 2499, category: "fashion", icon: "👟" },
    { id: 6, name: "Watch", price: 1999, category: "accessories", icon: "⌚" }
];

let cart = JSON.parse(localStorage.getItem("shopEaseCart")) || [];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

// Client-Side Routing
function handleRoute() {
    const route = window.location.hash.substring(1) || "home";

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const activePage = document.getElementById(route);

    if (activePage) {
        activePage.classList.add("active");
    } else {
        document.getElementById("home").classList.add("active");
    }

    if (route === "cart") {
        renderCart();
    }
}

window.addEventListener("hashchange", handleRoute);

// Display Products
function renderProducts(productList = products) {
    productGrid.innerHTML = "";

    productList.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">${product.icon}</div>
            <h3>${product.name}</h3>
            <p>₹${product.price.toLocaleString("en-IN")}</p>
            <button data-id="${product.id}" class="add-cart-btn">
                Add to Cart
            </button>
        `;

        productGrid.appendChild(card);
    });
}

// Add Product to Cart
productGrid.addEventListener("click", event => {
    if (!event.target.classList.contains("add-cart-btn")) {
        return;
    }

    const productId = Number(event.target.dataset.id);
    const product = products.find(item => item.id === productId);

    cart.push(product);
    saveCart();
    updateCartCount();

    alert(`${product.name} added to cart!`);
});

// Save Cart
function saveCart() {
    localStorage.setItem("shopEaseCart", JSON.stringify(cart));
}

// Update Cart Count
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Display Cart
function renderCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "0";
        return;
    }

    cart.forEach((product, index) => {
        const item = document.createElement("div");
        item.className = "cart-item";

        item.innerHTML = `
            <div>
                <h3>${product.name}</h3>
                <p>₹${product.price.toLocaleString("en-IN")}</p>
            </div>

            <button class="remove-btn" data-index="${index}">
                Remove
            </button>
        `;

        cartItems.appendChild(item);
    });

    const total = cart.reduce((sum, product) => {
        return sum + product.price;
    }, 0);

    cartTotal.textContent = total.toLocaleString("en-IN");
}

// Remove Product from Cart
cartItems.addEventListener("click", event => {
    if (!event.target.classList.contains("remove-btn")) {
        return;
    }

    const index = Number(event.target.dataset.index);

    cart.splice(index, 1);

    saveCart();
    updateCartCount();
    renderCart();
});

// Search and Category Filter
function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderProducts(filteredProducts);
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// Initial Setup
renderProducts();
updateCartCount();
handleRoute();