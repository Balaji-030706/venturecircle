
/******************************
 * APP.JS v2 - IMPROVED ARCHITECTURE
 * Ecommerce Dashboard (Production Upgrade)
 ******************************/

/* =========================
   GLOBAL STATE (SAFE INITIALIZATION)
========================= */

let appState = {
    users: [],
    products: [],
    cart: [],
    merchant: [],
    analytics: { activities: [] },
    currentUser: null
};

let authState = {
    isLoggedIn: false,
    token: null,
    role: null,
    user: null
};

/* =========================
   INIT APP (SAFE BOOTSTRAP)
========================= */

async function initializeApp() {
    try {
        await loadLocalData();
        await loadJSONData();
        bindGlobalEvents();
        renderDashboard();
        console.log("🚀 App v2 initialized successfully");
    } catch (error) {
        handleError(error);
    }
}

/* =========================
   LOAD LOCAL STORAGE (SAFE PARSE)
========================= */

function loadLocalData() {
    return new Promise((resolve) => {
        try {
            const saved = localStorage.getItem("appState");
            if (saved) {
                appState = { ...appState, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn("Local storage corrupted, resetting state");
        }
        resolve();
    });
}

/* =========================
   LOAD JSON DATA (SAFE MERGE)
========================= */

async function loadJSONData() {
    try {
        const res = await fetch("data.json");
        const data = await res.json();

        appState.users = data.users || [];
        appState.products = data.products || [];
        appState.cart = data.cart || [];
        appState.merchant = data.merchant || [];
        appState.analytics.activities = data.analytics?.activities || [];

    } catch (error) {
        console.warn("⚠️ data.json not loaded, using fallback state");
    }
}

/* =========================
   SAVE STATE
========================= */

function saveState() {
    try {
        localStorage.setItem("appState", JSON.stringify(appState));
    } catch (e) {
        console.warn("Failed to save state");
    }
}

/* =========================
   DASHBOARD RENDER
========================= */

function renderDashboard() {
    renderStats();
    renderProducts();
    renderUsers();
    renderMerchants();
    renderActivityFeed();
}

/* =========================
   STATS (SAFE CALCULATIONS)
========================= */

function renderStats() {
    const totalUsers = appState.users.length;
    const totalProducts = appState.products.length;
    const activeProducts = appState.products.filter(p => p.status === "active").length;
    const inStock = appState.products.filter(p => (p.stock || 0) > 0).length;

    updateElement("totalUsers", totalUsers);
    updateElement("totalProducts", totalProducts);
    updateElement("activeProducts", activeProducts);
    updateElement("inStockProducts", inStock);
}

/* =========================
   PRODUCT RENDER (FILTER SAFE)
========================= */

function renderProducts() {
    const container = document.getElementById("productList");
    if (!container) return;

    container.innerHTML = "";

    appState.products
        .filter(p => p.status !== "inactive")
        .forEach(product => {

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <div class="card-content">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <p><b>$${product.price}</b></p>
                    <p>Stock: ${product.stock ?? 0}</p>
                    <button onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            `;

            container.appendChild(card);
        });
}

/* =========================
   USERS RENDER (SAFE UI)
========================= */

function renderUsers() {
    const container = document.getElementById("userList");
    if (!container) return;

    container.innerHTML = "";

    appState.users.forEach(user => {
        const div = document.createElement("div");
        div.className = "user-card";

        div.innerHTML = `
            <h3>${user.name}</h3>
            <p>${user.email}</p>
            <span>${user.role}</span>
            <button onclick="deleteUser(${user.id})">Delete</button>
        `;

        container.appendChild(div);
    });
}

/* =========================
   MERCHANT RENDER
========================= */

function renderMerchants() {
    const container = document.getElementById("merchantContainer");
    if (!container) return;

    container.innerHTML = "";

    appState.merchant.forEach(m => {
        const div = document.createElement("div");
        div.className = "merchant-card";

        div.innerHTML = `
            <h3>${m.name}</h3>
            <p>⭐ ${m.rating}</p>
            <p>Products: ${m.productsCount}</p>
            <p>${m.location}</p>
        `;

        container.appendChild(div);
    });
}

/* =========================
   ACTIVITY FEED (SAFE SLICE)
========================= */

function renderActivityFeed() {
    const container = document.getElementById("activityContainer");
    if (!container) return;

    container.innerHTML = "";

    const activities = appState.analytics?.activities || [];

    activities.slice(-10).reverse().forEach(text => {
        const div = document.createElement("div");
        div.className = "activity-card";
        div.textContent = text;
        container.appendChild(div);
    });
}

/* =========================
   CART SYSTEM (FIXED LOGIC)
========================= */

function addToCart(productId) {
    if (!appState.cart) appState.cart = [];

    const userId = appState.currentUser?.id || 1;

    let cart = appState.cart.find(c => c.userId === userId);

    if (!cart) {
        cart = { userId, items: [] };
        appState.cart.push(cart);
    }

    let item = cart.items.find(i => i.productId === productId);

    if (item) {
        item.quantity += 1;
    } else {
        cart.items.push({ productId, quantity: 1 });
    }

    saveState();
    logActivity(`Product ${productId} added to cart`);
}

/* =========================
   USER DELETE
========================= */

function deleteUser(id) {
    appState.users = appState.users.filter(u => u.id !== id);
    saveState();
    renderUsers();
    renderStats();
}

/* =========================
   PRODUCT ADD (SAFE)
========================= */

function addProduct(title, description, price, category, image, stock) {
    const product = {
        id: Date.now(),
        title,
        description,
        price: Number(price),
        category,
        image,
        stock: Number(stock),
        status: "active",
        rating: 0
    };

    appState.products.push(product);
    saveState();
    renderProducts();
    renderStats();
}

/* =========================
   EVENT BINDING (SAFE FORMS)
========================= */

function bindGlobalEvents() {

    const userForm = document.getElementById("userForm");
    if (userForm) {
        userForm.addEventListener("submit", (e) => {
            e.preventDefault();

            appState.users.push({
                id: Date.now(),
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                role: "user"
            });

            saveState();
            renderUsers();
            userForm.reset();
        });
    }

    const productForm = document.getElementById("productForm");
    if (productForm) {
        productForm.addEventListener("submit", (e) => {
            e.preventDefault();

            addProduct(
                document.getElementById("title").value,
                document.getElementById("description").value,
                document.getElementById("price").value,
                document.getElementById("category").value,
                document.getElementById("image").value,
                document.getElementById("stock").value
            );

            productForm.reset();
        });
    }
}

/* =========================
   UTILITIES
========================= */

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function logActivity(message) {
    if (!appState.analytics) appState.analytics = { activities: [] };
    if (!appState.analytics.activities) appState.analytics.activities = [];

    appState.analytics.activities.push(
        `${new Date().toLocaleString()} - ${message}`
    );

    saveState();
}

function handleError(error) {
    console.error("❌ App Error:", error);
}

/* =========================
   BOOTSTRAP
========================= */

window.addEventListener("DOMContentLoaded", initializeApp);