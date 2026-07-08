// =====================================
// VENTURECIRCLE APP.JS - DEBUGGED FIX
// =====================================

// GLOBAL VARIABLES
let selectedProduct = null;

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
    
    // Validation
    if (!name || !email || !mobile || !password || !confirm) {
        errorBox.innerHTML = "❌ Please fill all fields.";
        return;
    }
    
    if (!validateEmail(email)) {
        errorBox.innerHTML = "❌ Invalid Email Format.";
        return;
    }
    
    if (password !== confirm) {
        errorBox.innerHTML = "❌ Passwords do not match.";
        return;
    }
    
    if (password.length < 6) {
        errorBox.innerHTML = "❌ Password must be at least 6 characters.";
        return;
    }
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    const existing = users.find(u => u.email === email);
    if (existing) {
        errorBox.innerHTML = "❌ Email already registered.";
        return;
    }
    
    // Create user object with consistent structure
    const user = {
        id: Date.now(),
        name: name,           // ✅ CONSISTENT
        email: email,         // ✅ CONSISTENT
        mobile: mobile,
        password: password,
        role: "merchant",
        createdAt: new Date().toLocaleDateString()
    };
    
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    
    // Log for debugging
    console.log("✅ User Registered:", user);
    console.log("📊 All Users:", users);
    
    // Show success
    errorBox.style.color = "green";
    errorBox.innerHTML = "✅ Registration Successful! Switching to login...";
    
    // Clear form
    document.getElementById("registerForm").reset();
    
    // Auto-switch to login tab after 2 seconds
    setTimeout(() => {
        showLogin();
        errorBox.innerHTML = "";
    }, 2000);
}

// =====================================
// LOGIN USER - FIXED WITH DEBUGGING
// =====================================

function loginUser() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    
    const errorBox = document.getElementById("errorBox");
    errorBox.style.color = "red";
    errorBox.innerHTML = "";
    
    // Validation
    if (!email || !password) {
        errorBox.innerHTML = "❌ Please enter email and password.";
        return;
    }
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    console.log("📋 Attempting Login:");
    console.log("   Email entered:", email);
    console.log("   Password entered:", password);
    console.log("   All registered users:", users);
    
    // Find matching user
    const user = users.find(u => {
        console.log(`   Checking user: ${u.email} (password match: ${u.password === password})`);
        return u.email === email && u.password === password;
    });
    
    if (!user) {
        console.log("❌ No user found with these credentials");
        errorBox.innerHTML = "❌ Invalid Credentials! Check Email or Password.";
        return;
    }
    
    // Store current user
    localStorage.setItem("currentUser", JSON.stringify(user));
    
    addActivity(user.email + " logged into VentureCircle");
    
    console.log("✅ Login successful for:", user.name);
    
    // Redirect to dashboard
    window.location.href = "dashboard.html";
}

// =====================================
// LOAD CURRENT USER
// =====================================

function loadCurrentUser() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    
    if (!user) {
        console.log("No user logged in, redirecting to login page");
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
            
            if (data.merchant) {
                localStorage.setItem("merchants", JSON.stringify(data.merchant));
            }
            
            if (data.analytics?.activities) {
                localStorage.setItem("activities", JSON.stringify(data.analytics.activities));
            }
            
            console.log("✅ Demo data loaded");
        })
        .catch(error => console.error("Error loading demo data:", error));
}

// =====================================
// DISPLAY PRODUCTS - FIXED
// =====================================

function displayProducts() {
    const container = document.getElementById("productList");
    if (!container) return;
    
    const products = JSON.parse(localStorage.getItem("products")) || [];
    
    let output = "";
    
    products.forEach(product => {
        // Handle both 'name' and 'title' fields
        const productName = product.name || product.title || "Unknown Product";
        const productPrice = product.price || 0;
        const productImage = product.image || "https://via.placeholder.com/300";
        
        output += `
            <div class="card" onclick="openProduct(${product.id})">
                <img src="${productImage}" alt="${productName}">
                <div class="card-content">
                    <h3>${productName}</h3>
                    <p>₹${productPrice}</p>
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
    
    // Handle field names flexibly
    const productName = product.name || product.title || "Unknown";
    const productDescription = product.description || "No description available";
    const productPrice = product.price || 0;
    const productImage = product.image || "https://via.placeholder.com/500";
    
    document.getElementById("modalImage").src = productImage;
    document.getElementById("modalName").innerHTML = productName;
    document.getElementById("modalDescription").innerHTML = productDescription;
    document.getElementById("modalPrice").innerHTML = "₹" + productPrice;
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
// ADD ACTIVITY
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
    
    const productName = selectedProduct.name || selectedProduct.title || "Unknown";
    addActivity("Product added to cart: " + productName);
    
    alert("✅ Added to cart!");
    closeModal();
}
