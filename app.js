// =====================================
// VENTURECIRCLE APP.JS
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

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}

// =====================================
// REGISTER USER
// =====================================

function registerUser() {

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const mobile =
        document.getElementById("registerMobile").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirm =
        document.getElementById("confirmPassword").value;

    const errorBox =
        document.getElementById("errorBox");

    errorBox.innerHTML = "";

    if (
        !name ||
        !email ||
        !mobile ||
        !password ||
        !confirm
    ) {

        errorBox.innerHTML =
            "Please fill all fields.";

        return;
    }

    if (!validateEmail(email)) {

        errorBox.innerHTML =
            "Invalid Email Format.";

        return;
    }

    if (password !== confirm) {

        errorBox.innerHTML =
            "Passwords do not match.";

        return;
    }

    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    const existing =
        users.find(
            u => u.email === email
        );

    if (existing) {

        errorBox.innerHTML =
            "Email already registered.";

        return;
    }

    const user = {

        id: Date.now(),

        name,

        email,

        mobile,

        password
    };

    users.push(user);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert(
        "Registration Successful!"
    );

    document.getElementById(
        "registerForm"
    ).reset();
}

// =====================================
// LOGIN USER
// =====================================

function loginUser() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const errorBox =
        document.getElementById("errorBox");

    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    const user =
        users.find(
            u =>
                u.email === email &&
                u.password === password
        );

    if (!user) {

        errorBox.innerHTML =
            "Invalid Credentials! Check Email or Password.";

        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    addActivity(
        user.email +
        " logged into VentureCircle"
    );

    window.location.href =
        "dashboard.html";
}

// =====================================
// LOAD CURRENT USER
// =====================================

function loadCurrentUser() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    if (!user) {

        window.location.href =
            "index.html";

        return;
    }

    const welcome =
        document.getElementById(
            "welcomeUser"
        );

    if (welcome) {

        welcome.innerHTML =
            "Welcome, " + user.name;
    }
}

// =====================================
// LOGOUT
// =====================================

function logoutUser() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "index.html";
}

// =====================================
// LOAD DEMO PRODUCTS
// =====================================

function loadDemoData() {

    if (
        localStorage.getItem("products")
    ) return;

    fetch("data.json")

        .then(response =>
            response.json()
        )

        .then(data => {

            localStorage.setItem(
                "products",
                JSON.stringify(
                    data.products
                )
            );

        })

        .catch(error => {

            console.log(error);

        });
}

// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts() {

    const container =
        document.getElementById(
            "productList"
        );

    if (!container) return;

    const products =
        JSON.parse(
            localStorage.getItem(
                "products"
            )
        ) || [];

    let output = "";

    products.forEach(product => {

        output += `

        <div class="card"
             onclick="openProduct(${product.id})">

            <img
             src="${product.image}">

            <div class="card-content">

                <h3>
                ${product.name}
                </h3>

                <p>
                ₹${product.price}
                </p>

            </div>

        </div>
        `;
    });

    container.innerHTML = output;
}

// =====================================
// PRODUCT MODAL
// =====================================

function openProduct(id) {

    const products =
        JSON.parse(
            localStorage.getItem(
                "products"
            )
        ) || [];

    const product =
        products.find(
            p => p.id === id
        );

    if (!product) return;

    selectedProduct = product;

    document.getElementById(
        "modalImage"
    ).src =
        product.image;

    document.getElementById(
        "modalName"
    ).innerHTML =
        product.name;

    document.getElementById(
        "modalDescription"
    ).innerHTML =
        product.description;

    document.getElementById(
        "modalPrice"
    ).innerHTML =
        "₹" + product.price;

    document.getElementById(
        "modalShop"
    ).innerHTML =
        "Shop : " + product.shop;

    document.getElementById(
        "modalContact"
    ).innerHTML =
        "Contact : " + product.contact;

    document.getElementById(
        "productModal"
    ).style.display =
        "block";
}

// =====================================
// CLOSE MODAL
// =====================================

function closeModal() {

    document.getElementById(
        "productModal"
    ).style.display =
        "none";
}

// =====================================
// SEARCH PRODUCTS
// =====================================

function searchProducts() {

    const search =
        document.getElementById(
            "searchInput"
        )
        .value
        .toLowerCase();

    const cards =
        document.querySelectorAll(
            ".card"
        );

    cards.forEach(card => {

        const text =
            card.innerText
            .toLowerCase();

        card.style.display =
            text.includes(search)
                ? "block"
                : "none";
    });
}
/******************************
 * PART 2 - DATA & DASHBOARD ENGINE
 ******************************/

/* =========================
   GLOBAL STATE MANAGEMENT
========================= */

let appState = {
    users: [],
    projects: [],
    sessions: [],
    analytics: {},
    currentUser: null
};

/* =========================
   INITIAL DATA LOADER
========================= */

async function initializeApp() {
    try {
        await loadLocalData();
        await loadJSONData();
        bindGlobalEvents();
        renderDashboard();
        console.log("App initialized successfully 🚀");
    } catch (error) {
        console.error("Initialization failed:", error);
    }
}

/* =========================
   LOAD FROM LOCAL STORAGE
========================= */

function loadLocalData() {
    return new Promise((resolve) => {
        const savedState = localStorage.getItem("appState");

        if (savedState) {
            appState = JSON.parse(savedState);
        }

        resolve();
    });
}

/* =========================
   LOAD FROM data.json
========================= */

async function loadJSONData() {
    try {
        const response = await fetch("data.json");
        const data = await response.json();

        appState.users = data.users || [];
        appState.projects = data.projects || [];
        appState.analytics = data.analytics || {};

    } catch (error) {
        console.warn("Using fallback data (data.json not loaded)", error);
    }
}

/* =========================
   SAVE STATE
========================= */

function saveState() {
    localStorage.setItem("appState", JSON.stringify(appState));
}

/* =========================
   DASHBOARD RENDER ENGINE
========================= */

function renderDashboard() {
    renderStats();
    renderUsers();
    renderProjects();
    renderActivityFeed();
}

/* =========================
   STATS RENDERING
========================= */

function renderStats() {
    const totalUsers = appState.users.length;
    const totalProjects = appState.projects.length;
    const activeProjects = appState.projects.filter(p => p.status === "active").length;

    updateElement("totalUsers", totalUsers);
    updateElement("totalProjects", totalProjects);
    updateElement("activeProjects", activeProjects);
}

/* =========================
   USER RENDERING
========================= */

function renderUsers() {
    const container = document.getElementById("userList");
    if (!container) return;

    container.innerHTML = "";

    appState.users.forEach(user => {
        const userCard = document.createElement("div");
        userCard.className = "user-card";

        userCard.innerHTML = `
            <h3>${user.name}</h3>
            <p>${user.email}</p>
            <span class="role">${user.role}</span>
            <button onclick="deleteUser(${user.id})">Delete</button>
        `;

        container.appendChild(userCard);
    });
}

/* =========================
   PROJECT RENDERING
========================= */

function renderProjects() {
    const container = document.getElementById("projectList");
    if (!container) return;

    container.innerHTML = "";

    appState.projects.forEach(project => {
        const projectCard = document.createElement("div");
        projectCard.className = "project-card";

        projectCard.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <span class="status ${project.status}">${project.status}</span>
            <button onclick="toggleProjectStatus(${project.id})">Toggle</button>
        `;

        container.appendChild(projectCard);
    });
}

/* =========================
   ACTIVITY FEED
========================= */

function renderActivityFeed() {
    const feed = document.getElementById("activityFeed");
    if (!feed) return;

    feed.innerHTML = "";

    const activities = appState.analytics.activities || [];

    activities.slice(-10).reverse().forEach(activity => {
        const item = document.createElement("div");
        item.className = "activity-item";
        item.textContent = activity;
        feed.appendChild(item);
    });
}

/* =========================
   CRUD OPERATIONS
========================= */

function addUser(name, email, role = "user") {
    const newUser = {
        id: Date.now(),
        name,
        email,
        role
    };

    appState.users.push(newUser);
    saveState();
    renderUsers();
}

function deleteUser(id) {
    appState.users = appState.users.filter(user => user.id !== id);
    saveState();
    renderDashboard();
}

function addProject(title, description) {
    const newProject = {
        id: Date.now(),
        title,
        description,
        status: "active"
    };

    appState.projects.push(newProject);
    saveState();
    renderProjects();
}

function toggleProjectStatus(id) {
    const project = appState.projects.find(p => p.id === id);
    if (project) {
        project.status = project.status === "active" ? "inactive" : "active";
        saveState();
        renderProjects();
        renderStats();
    }
}

/* =========================
   EVENT BINDINGS
========================= */

function bindGlobalEvents() {
    const userForm = document.getElementById("userForm");
    if (userForm) {
        userForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;

            addUser(name, email);

            userForm.reset();
        });
    }

    const projectForm = document.getElementById("projectForm");
    if (projectForm) {
        projectForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const title = document.getElementById("title").value;
            const description = document.getElementById("description").value;

            addProject(title, description);

            projectForm.reset();
        });
    }
}

/* =========================
   UTILITY FUNCTIONS
========================= */

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function logActivity(message) {
    if (!appState.analytics.activities) {
        appState.analytics.activities = [];
    }

    appState.analytics.activities.push(
        `${new Date().toLocaleString()} - ${message}`
    );

    saveState();
}
/******************************
 * PART 3 - AUTH + SECURITY LAYER
 ******************************/

/* =========================
   AUTH STATE
========================= */

let authState = {
    isLoggedIn: false,
    token: null,
    role: null,
    user: null
};

/* =========================
   LOGIN SYSTEM
========================= */

function login(email, password) {
    try {
        const user = appState.users.find(u => u.email === email);

        if (!user) {
            throw new Error("User not found");
        }

        // Mock password validation (replace with backend later)
        if (password !== "admin123") {
            throw new Error("Invalid credentials");
        }

        authState = {
            isLoggedIn: true,
            token: generateToken(),
            role: user.role,
            user: user
        };

        appState.currentUser = user;

        logActivity(`User logged in: ${user.email}`);
        saveState();

        console.log("Login successful ✅");
        return true;

    } catch (error) {
        handleError(error);
        return false;
    }
}

/* =========================
   LOGOUT SYSTEM
========================= */

function logout() {
    try {
        logActivity(`User logged out: ${authState.user?.email || "unknown"}`);

        authState = {
            isLoggedIn: false,
            token: null,
            role: null,
            user: null
        };

        appState.currentUser = null;

        saveState();
        renderDashboard();

        console.log("Logged out successfully 🚪");

    } catch (error) {
        handleError(error);
    }
}

/* =========================
   TOKEN GENERATOR
========================= */

function generateToken() {
    return "token_" + Math.random().toString(36).substring(2) + Date.now();
}