// =====================================
// VENTURECIRCLE APP.JS - FIXED VERSION
// =====================================

// GLOBAL VARIABLES
let selectedProduct = null;
let cartItems = [];

// =====================================
// LOAD APP
// =====================================

window.onload = function () {
    loadDemoData();
    
    if (window.location.pathname.includes("dashboard.html")) {
        loadCurrentUser();
        displayProducts();
        displayMerchants();
        displayActivities();
    }
};

// =====================================
// EMAIL VALIDATION
// =====================================

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// =====================================
// PASSWORD VALIDATION
// =====================================

function validatePassword(password) {
    return password.length >= 6;
}

// =====================================
// REGISTER USER - FIXED
// =====================================

function registerUser() {
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const mobile = document.getElementById("registerMobile").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("confirmPassword").value;
    
    const errorBox = document.getElementById("errorBox");
    errorBox.innerHTML = "";
    
    // Validation checks
    if (!name || !email || !mobile || !password || !confirm) {
        errorBox.innerHTML = "❌ Please fill all fields.";
        return;
    }
    
    if (!validateEmail(email)) {
        errorBox.innerHTML = "❌ Invalid Email Format.";
        return;
    }
    
    if (!validatePassword(password)) {
        errorBox.innerHTML = "❌ Password must be at least 6 characters.";
        return;
    }
    
    if (password !== confirm) {
        errorBox.innerHTML = "❌ Passwords do not match.";
        return;
    }
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    const existing = users.find(u => u.email === email);
    if (existing) {
        errorBox.innerHTML = "❌ Email already registered.";
        return;
    }
    
    // Create new user with consistent field names
    const user = {
        id: Date.now(),
        name: name,
        email: email,
        mobile: mobile,
        password: password,
        createdAt: new Date().toLocaleDateString(),
        role: "merchant"
    };
    
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    
    console.log("User registered:", user);
    
    // Show success message
    const successMessage = document.createElement("div");
    successMessage.style.color = "green";
    successMessage.style.fontWeight = "600";
    successMessage.innerHTML = "✅ Registration Successful! Please log in.";
    errorBox.parentElement.insertBefore(successMessage, errorBox);
    
    // Clear form
    document.getElementById("registerForm").reset();
    
    // Auto-switch to login tab after 2 seconds
    setTimeout(() => {
        showLogin();
        successMessage.remove();
    }, 2000);
}

// =====================================
// LOGIN USER - FIXED
// =====================================

function loginUser() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    
    const errorBox = document.getElementById("errorBox");
    errorBox.innerHTML = "";
    
    if (!email || !password) {
        errorBox.innerHTML = "❌ Please enter email and password.";
        return;
    }
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    console.log("Stored users:", users);
    console.log("Login attempt:", { email, password });
    
    // Find matching user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        errorBox.innerHTML = "❌ Invalid Credentials! Check Email or Password.";
        return;
    }
    
    // Store current user session
    localStorage.setItem("currentUser", JSON.stringify(user));
    
    addActivity(user.email + " logged into VentureCircle");
    
    console.log("Login successful for:", user.name);
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 500);
}

// =====================================
// LOAD CURRENT USER
// =====================================

function loadCurrentUser() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    
    if (!user) {
        window.location.href = "index.html";
        return;
    }
    
    const welcome = document.getElementById("welcomeUser");
    if (welcome) {
        welcome.innerHTML = "Welcome, " + user.name + " 👋";
    }
}

// =====================================
// LOGOUT
// =====================================

function logoutUser() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        addActivity(user.email + " logged out from VentureCircle");
    }
    
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// =====================================
// LOAD DEMO DATA
// =====================================

function loadDemoData() {
    if (localStorage.getItem("products")) return;
    
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("products", JSON.stringify(data.products));
            
            // Load merchants too
            if (data.merchants) {
                localStorage.setItem("merchants", JSON.stringify(data.merchants));
            }
            
            // Initialize activities
            if (!localStorage.getItem("activities")) {
                localStorage.setItem("activities", JSON.stringify(data.analytics?.activities || []));
            }
        })
        .catch(error => console.error("Error loading demo data:", error));
}

// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts() {
    const container = document.getElementById("productList");
    if (!container) return;
    
    const products = JSON.parse(localStorage.getItem("products")) || [];
    
    let output = "";
    products.forEach(product => {
        output += `
            <div class="card" onclick="openProduct(${product.id})">
                <img src="${product.image}" alt="${product.name || product.title}">
                <div class="card-content">
                    <h3>${product.name || product.title}</h3>
                    <p>₹${product.price}</p>
                    <span class="stock-badge">${product.stock || 'In Stock'}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = output || "<p>No products available</p>";
}

// =====================================
// PRODUCT MODAL
// =====================================

function openProduct(id) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => p.id === id);
    
    if (!product) return;
    
    selectedProduct = product;
    
    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalName").innerHTML = product.name || product.title;
    document.getElementById("modalDescription").innerHTML = product.description;
    document.getElementById("modalPrice").innerHTML = "₹" + product.price;
    document.getElementById("modalShop").innerHTML = "Shop : " + (product.shop || "VentureCircle");
    document.getElementById("modalContact").innerHTML = "Contact : " + (product.contact || "Available");
    
    document.getElementById("productModal").style.display = "block";
}

// =====================================
// CLOSE MODAL
// =====================================

function closeModal() {
    document.getElementById("productModal").style.display = "none";
}

// =====================================
// SEARCH PRODUCTS
// =====================================

function searchProducts() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".card");
    
    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(search) ? "block" : "none";
    });
}

// =====================================
// DISPLAY MERCHANTS
// =====================================

function displayMerchants() {
    const container = document.getElementById("merchantContainer");
    if (!container) return;
    
    const merchants = JSON.parse(localStorage.getItem("merchants")) || [];
    
    let output = "";
    merchants.forEach(merchant => {
        output += `
            <div class="merchant-card">
                <h3>${merchant.name}</h3>
                <p>⭐ ${merchant.rating}</p>
                <p>📦 ${merchant.productsCount} products</p>
                <p>📍 ${merchant.location}</p>
            </div>
        `;
    });
    
    container.innerHTML = output || "<p>No merchants available</p>";
}

// =====================================
// DISPLAY ACTIVITIES
// =====================================

function displayActivities() {
    const container = document.getElementById("activityContainer");
    if (!container) return;
    
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    
    let output = "";
    activities.slice(-10).reverse().forEach(activity => {
        output += `<div class="activity-card">📢 ${activity}</div>`;
    });
    
    container.innerHTML = output || "<p>No activities yet</p>";
}

// =====================================
// ACTIVITY MANAGEMENT
// =====================================

function addActivity(message) {
    let activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push(`${new Date().toLocaleString()} - ${message}`);
    localStorage.setItem("activities", JSON.stringify(activities));
}

// =====================================
// ADD TO CART
// =====================================

function addToCart() {
    if (!selectedProduct) return;
    
    cartItems.push({
        id: selectedProduct.id,
        name: selectedProduct.name || selectedProduct.title,
        price: selectedProduct.price,
        quantity: 1
    });
    
    updateCartDisplay();
    addActivity("Product added to cart: " + (selectedProduct.name || selectedProduct.title));
    
    alert("✅ Added to cart!");
    closeModal();
}

// =====================================
// UPDATE CART DISPLAY
// =====================================

function updateCartDisplay() {
    const cartContainer = document.getElementById("cartItems");
    if (!cartContainer) return;
    
    let total = 0;
    let output = "";
    
    cartItems.forEach((item, index) => {
        total += item.price * item.quantity;
        output += `
            <div class="cart-item">
                <p>${item.name}</p>
                <p>₹${item.price} x ${item.quantity}</p>
                <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
            </div>
        `;
    });
    
    cartContainer.innerHTML = output || "<p>Cart is empty</p>";
    
    const totalElement = document.getElementById("cartTotal");
    if (totalElement) {
        totalElement.innerHTML = "Total : ₹" + total;
    }
}

// =====================================
// REMOVE FROM CART
// =====================================

function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartDisplay();
}

// =====================================
// UTILITY: SCROLL TO TOP
// =====================================

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("dashboard.html")) {
        updateCartDisplay();
    }
});
