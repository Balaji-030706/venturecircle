/* =========================================================
   VENTURECIRCLE - APP.JS
   Dynamic SPA Logic
   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL STATE
   ========================================================= */

const state = {
    currentUser: JSON.parse(localStorage.getItem("venturecircleCurrentUser")) || null,
    users: JSON.parse(localStorage.getItem("venturecircleUsers")) || [],
    products: JSON.parse(localStorage.getItem("venturecircleProducts")) || [],
    cart: JSON.parse(localStorage.getItem("venturecircleCart")) || [],
    currentCategory: "All",
    searchText: "",
    currentProduct: null
};


/* =========================================================
   DEFAULT PRODUCT DATA
   ========================================================= */

const defaultProducts = [
    {
        id: 1,
        name: "Premium Rice",
        category: "Grocery",
        price: 65,
        unit: "1 kg",
        shopName: "Sri Lakshmi Stores",
        shopkeeper: "Arun Kumar",
        location: "Chennai",
        phone: "9876543210",
        email: "arun@example.com",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
        description: "High-quality premium rice suitable for daily household cooking.",
        stock: 50,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: "Fresh Wheat Flour",
        category: "Grocery",
        price: 55,
        unit: "1 kg",
        shopName: "Balaji Super Market",
        shopkeeper: "Balaji",
        location: "Chennai",
        phone: "9876501234",
        email: "balaji@example.com",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
        description: "Fresh wheat flour suitable for chapati, roti and baking.",
        stock: 35,
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        name: "USB Type-C Cable",
        category: "Electronics",
        price: 199,
        unit: "1 piece",
        shopName: "Tech World",
        shopkeeper: "Rahul",
        location: "Chennai",
        phone: "9123456780",
        email: "techworld@example.com",
        image: "https://images.unsplash.com/photo-1587033411391-5d9e51cce126",
        description: "Durable fast-charging USB Type-C cable.",
        stock: 20,
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        name: "Cotton Shirt",
        category: "Clothing",
        price: 699,
        unit: "1 piece",
        shopName: "Fashion Hub",
        shopkeeper: "Vijay",
        location: "Chennai",
        phone: "9988776655",
        email: "fashion@example.com",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
        description: "Comfortable premium cotton shirt available in multiple sizes.",
        stock: 15,
        createdAt: new Date().toISOString()
    },
    {
        id: 5,
        name: "LED Bulb",
        category: "Electrical",
        price: 120,
        unit: "1 piece",
        shopName: "Bright Electricals",
        shopkeeper: "Suresh",
        location: "Chennai",
        phone: "9000011111",
        email: "bright@example.com",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
        description: "Energy-efficient LED bulb with long operating life.",
        stock: 40,
        createdAt: new Date().toISOString()
    },
    {
        id: 6,
        name: "Fresh Apples",
        category: "Fruits",
        price: 180,
        unit: "1 kg",
        shopName: "Fresh Mart",
        shopkeeper: "Karthik",
        location: "Chennai",
        phone: "9888776655",
        email: "freshmart@example.com",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6",
        description: "Fresh and naturally grown apples.",
        stock: 25,
        createdAt: new Date().toISOString()
    }
];


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeProducts();

    initializeNavigation();

    initializeSearch();

    initializeCategoryButtons();

    initializeCart();

    initializeModals();

    initializeForms();

    updateUserInterface();

    renderProducts();

    updateCartCount();

    showCurrentSection();

});


/* =========================================================
   PRODUCT INITIALIZATION
   ========================================================= */

function initializeProducts() {

    if (!Array.isArray(state.products) || state.products.length === 0) {

        state.products = defaultProducts;

        saveProducts();
    }
}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveUsers() {
    localStorage.setItem(
        "venturecircleUsers",
        JSON.stringify(state.users)
    );
}


function saveProducts() {
    localStorage.setItem(
        "venturecircleProducts",
        JSON.stringify(state.products)
    );
}


function saveCart() {
    localStorage.setItem(
        "venturecircleCart",
        JSON.stringify(state.cart)
    );
}


function saveCurrentUser() {

    if (state.currentUser) {

        localStorage.setItem(
            "venturecircleCurrentUser",
            JSON.stringify(state.currentUser)
        );

    } else {

        localStorage.removeItem(
            "venturecircleCurrentUser"
        );
    }
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function initializeNavigation() {

    const navLinks = document.querySelectorAll(
        "[data-section], .nav-link"
    );

    navLinks.forEach(link => {

        link.addEventListener("click", function(event) {

            const target =
                this.dataset.section ||
                this.getAttribute("href");

            if (!target) return;

            if (target.startsWith("#")) {

                event.preventDefault();

                const sectionId = target.substring(1);

                navigateTo(sectionId);
            }
        });
    });


    const homeButtons =
        document.querySelectorAll("[data-home]");

    homeButtons.forEach(button => {

        button.addEventListener("click", () => {

            navigateTo("home");

        });

    });
}


/* =========================================================
   NAVIGATE TO SECTION
   ========================================================= */

function navigateTo(sectionId) {

    const sections =
        document.querySelectorAll(
            ".page-section, .content-section, section[data-page]"
        );

    if (sections.length > 0) {

        sections.forEach(section => {

            section.classList.remove("active");

            if (
                section.id === sectionId ||
                section.dataset.page === sectionId
            ) {

                section.classList.add("active");
            }
        });
    }


    const navItems =
        document.querySelectorAll(
            ".nav-link, [data-section]"
        );

    navItems.forEach(item => {

        item.classList.remove("active");

        const target =
            item.dataset.section ||
            item.getAttribute("href");

        if (
            target === `#${sectionId}` ||
            target === sectionId
        ) {

            item.classList.add("active");
        }
    });


    if (sectionId === "products") {

        renderProducts();
    }


    if (sectionId === "cart") {

        renderCart();
    }


    if (sectionId === "profile") {

        renderProfile();
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    history.replaceState(
        null,
        "",
        `#${sectionId}`
    );
}


/* =========================================================
   SHOW CURRENT SECTION
   ========================================================= */

function showCurrentSection() {

    let section =
        window.location.hash.replace("#", "");

    if (!section) {

        section = "home";
    }

    navigateTo(section);
}


/* =========================================================
   SEARCH
   ========================================================= */

function initializeSearch() {

    const searchInputs =
        document.querySelectorAll(
            "#searchInput, .search-input, [data-search]"
        );

    searchInputs.forEach(input => {

        input.addEventListener("input", function() {

            state.searchText =
                this.value.trim().toLowerCase();

            renderProducts();
        });
    });
}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function initializeCategoryButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-category]"
        );

    buttons.forEach(button => {

        button.addEventListener("click", function() {

            state.currentCategory =
                this.dataset.category;

            buttons.forEach(btn => {

                btn.classList.remove("active");

            });

            this.classList.add("active");

            renderProducts();
        });
    });
}


/* =========================================================
   GET CATEGORIES
   ========================================================= */

function getCategories() {

    const categories = state.products
        .map(product => product.category)
        .filter(Boolean);

    return ["All", ...new Set(categories)];
}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    const containers =
        document.querySelectorAll(
            "#productContainer, #productsContainer, .products-grid"
        );

    if (containers.length === 0) return;


    let filteredProducts =
        state.products.filter(product => {

            const categoryMatch =
                state.currentCategory === "All" ||
                product.category === state.currentCategory;

            const searchMatch =
                !state.searchText ||
                product.name
                    .toLowerCase()
                    .includes(state.searchText) ||

                product.category
                    .toLowerCase()
                    .includes(state.searchText) ||

                product.shopName
                    .toLowerCase()
                    .includes(state.searchText) ||

                product.location
                    .toLowerCase()
                    .includes(state.searchText);

            return categoryMatch && searchMatch;
        });


    containers.forEach(container => {

        if (filteredProducts.length === 0) {

            container.innerHTML = `
                <div class="empty-products">
                    <div class="empty-icon">🔍</div>
                    <h3>No products found</h3>
                    <p>Try another search or category.</p>
                </div>
            `;

            return;
        }


        container.innerHTML =
            filteredProducts
                .map(createProductCard)
                .join("");


        addProductCardEvents(container);
    });
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

    const image =
        product.image ||
        "https://via.placeholder.com/500x350?text=Product";


    return `
        <article
            class="product-card"
            data-product-id="${product.id}"
        >

            <div class="product-image-wrapper">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(product.name)}"
                    class="product-image"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/500x350?text=Product'"
                >

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

            </div>


            <div class="product-content">

                <h3 class="product-name">
                    ${escapeHTML(product.name)}
                </h3>

                <p class="product-description">
                    ${escapeHTML(
                        truncate(product.description || "", 80)
                    )}
                </p>


                <div class="product-price">

                    ₹${Number(product.price).toLocaleString("en-IN")}

                    <span>
                        / ${escapeHTML(product.unit || "piece")}
                    </span>

                </div>


                <div class="product-shop">

                    <span>🏪</span>

                    <span>
                        ${escapeHTML(product.shopName)}
                    </span>

                </div>


                <div class="product-location">

                    📍 ${escapeHTML(product.location)}

                </div>


                <div class="product-actions">

                    <button
                        class="btn btn-primary view-product"
                        data-id="${product.id}"
                    >
                        View Product
                    </button>

                    <button
                        class="btn btn-cart add-cart"
                        data-id="${product.id}"
                    >
                        🛒 Add
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   PRODUCT EVENTS
   ========================================================= */

function addProductCardEvents(container) {

    container
        .querySelectorAll(".view-product")
        .forEach(button => {

            button.addEventListener("click", () => {

                const product =
                    findProduct(button.dataset.id);

                if (product) {

                    openProductModal(product);
                }
            });
        });


    container
        .querySelectorAll(".add-cart")
        .forEach(button => {

            button.addEventListener("click", () => {

                addToCart(button.dataset.id);
            });
        });
}


/* =========================================================
   FIND PRODUCT
   ========================================================= */

function findProduct(id) {

    return state.products.find(
        product => String(product.id) === String(id)
    );
}


/* =========================================================
   PRODUCT MODAL
   ========================================================= */

function initializeModals() {

    document.addEventListener("click", event => {

        if (
            event.target.matches(
                ".modal-close, [data-close-modal]"
            )
        ) {

            closeAllModals();
        }


        if (
            event.target.classList.contains("modal-overlay")
        ) {

            closeAllModals();
        }
    });
}


/* =========================================================
   OPEN PRODUCT MODAL
   ========================================================= */

function openProductModal(product) {

    state.currentProduct = product;


    let modal =
        document.querySelector("#productModal");


    if (!modal) {

        modal = document.createElement("div");

        modal.id = "productModal";

        modal.className = "modal-overlay";

        document.body.appendChild(modal);
    }


    modal.innerHTML = `

        <div class="modal product-modal">

            <button
                class="modal-close"
                data-close-modal
                aria-label="Close"
            >
                ×
            </button>


            <div class="modal-product-layout">

                <div class="modal-product-image">

                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                        onerror="this.src='https://via.placeholder.com/600x500?text=Product'"
                    >

                </div>


                <div class="modal-product-details">

                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>

                    <h2>
                        ${escapeHTML(product.name)}
                    </h2>

                    <h3>
                        ₹${Number(product.price).toLocaleString("en-IN")}
                    </h3>

                    <p>
                        ${escapeHTML(
                            product.description ||
                            "No description available."
                        )}
                    </p>


                    <div class="shopkeeper-info">

                        <h4>Shopkeeper Information</h4>

                        <p>
                            🏪
                            <strong>
                                ${escapeHTML(product.shopName)}
                            </strong>
                        </p>

                        <p>
                            👤 ${escapeHTML(product.shopkeeper)}
                        </p>

                        <p>
                            📍 ${escapeHTML(product.location)}
                        </p>

                        <p>
                            📞 ${escapeHTML(product.phone)}
                        </p>

                        <p>
                            ✉️ ${escapeHTML(product.email)}
                        </p>

                    </div>


                    <div class="modal-actions">

                        <button
                            class="btn btn-primary modal-add-cart"
                            data-id="${product.id}"
                        >
                            🛒 Add to Cart
                        </button>

                        <a
                            href="tel:${escapeHTML(product.phone)}"
                            class="btn btn-secondary"
                        >
                            📞 Contact
                        </a>

                    </div>

                </div>

            </div>

        </div>
    `;


    modal.classList.add("show");


    const addButton =
        modal.querySelector(".modal-add-cart");


    addButton.addEventListener("click", () => {

        addToCart(product.id);
    });
}


/* =========================================================
   CLOSE MODALS
   ========================================================= */

function closeAllModals() {

    document
        .querySelectorAll(".modal-overlay")
        .forEach(modal => {

            modal.classList.remove("show");
        });
}


/* =========================================================
   CART
   ========================================================= */

function initializeCart() {

    document.addEventListener("click", event => {

        if (
            event.target.matches(
                "[data-cart], .cart-button"
            )
        ) {

            navigateTo("cart");
        }
    });
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(id) {

    const product =
        findProduct(id);

    if (!product) return;


    const existing =
        state.cart.find(
            item =>
                String(item.productId) ===
                String(product.id)
        );


    if (existing) {

        existing.quantity++;

    } else {

        state.cart.push({

            productId: product.id,

            quantity: 1

        });
    }


    saveCart();

    updateCartCount();

    showToast(
        `${product.name} added to cart 🛒`,
        "success"
    );
}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(id) {

    state.cart =
        state.cart.filter(
            item =>
                String(item.productId) !==
                String(id)
        );


    saveCart();

    updateCartCount();

    renderCart();
}


/* =========================================================
   UPDATE CART QUANTITY
   ========================================================= */

function updateCartQuantity(id, change) {

    const item =
        state.cart.find(
            cartItem =>
                String(cartItem.productId) ===
                String(id)
        );


    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;
    }


    saveCart();

    renderCart();

    updateCartCount();
}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

    const count =
        state.cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    document
        .querySelectorAll(
            ".cart-count, #cartCount"
        )
        .forEach(element => {

            element.textContent = count;
        });
}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    const containers =
        document.querySelectorAll(
            "#cartContainer, .cart-container"
        );


    if (containers.length === 0) return;


    let total = 0;


    const cartProducts =
        state.cart
            .map(item => {

                const product =
                    findProduct(item.productId);

                if (!product) return null;


                const subtotal =
                    Number(product.price) *
                    item.quantity;


                total += subtotal;


                return {
                    ...product,
                    quantity: item.quantity,
                    subtotal
                };

            })
            .filter(Boolean);


    containers.forEach(container => {

        if (cartProducts.length === 0) {

            container.innerHTML = `

                <div class="empty-cart">

                    <div class="empty-icon">
                        🛒
                    </div>

                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        Explore products from nearby shopkeepers.
                    </p>

                    <button
                        class="btn btn-primary"
                        onclick="navigateTo('products')"
                    >
                        Explore Products
                    </button>

                </div>

            `;

            return;
        }


        container.innerHTML = `

            <div class="cart-items">

                ${cartProducts.map(item => `

                    <div class="cart-item">

                        <img
                            src="${escapeHTML(item.image)}"
                            alt="${escapeHTML(item.name)}"
                        >

                        <div class="cart-item-details">

                            <h3>
                                ${escapeHTML(item.name)}
                            </h3>

                            <p>
                                ${escapeHTML(item.shopName)}
                            </p>

                            <strong>
                                ₹${item.price}
                            </strong>

                        </div>


                        <div class="quantity-control">

                            <button
                                onclick="updateCartQuantity(${item.id}, -1)"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="updateCartQuantity(${item.id}, 1)"
                            >
                                +
                            </button>

                        </div>


                        <div class="cart-subtotal">

                            ₹${item.subtotal}

                        </div>


                        <button
                            class="remove-cart"
                            onclick="removeFromCart(${item.id})"
                        >
                            🗑️
                        </button>

                    </div>

                `).join("")}

            </div>


            <div class="cart-summary">

                <h3>
                    Cart Summary
                </h3>

                <div class="cart-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        ₹${total.toLocaleString("en-IN")}
                    </strong>

                </div>

                <button
                    class="btn btn-primary checkout-button"
                    onclick="checkout()"
                >
                    Proceed to Checkout
                </button>

            </div>
        `;
    });
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

    if (state.cart.length === 0) {

        showToast(
            "Your cart is empty.",
            "error"
        );

        return;
    }


    showToast(
        "Checkout simulation completed successfully 🎉",
        "success"
    );


    state.cart = [];

    saveCart();

    updateCartCount();

    renderCart();
}


/* =========================================================
   AUTHENTICATION
   ========================================================= */

function initializeForms() {

    const loginForm =
        document.querySelector("#loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );
    }


    const registerForm =
        document.querySelector("#registerForm");


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            handleRegister
        );
    }


    const logoutButtons =
        document.querySelectorAll(
            "#logoutBtn, .logout-button"
        );


    logoutButtons.forEach(button => {

        button.addEventListener(
            "click",
            logout
        );
    });
}


/* =========================================================
   LOGIN
   ========================================================= */

function handleLogin(event) {

    event.preventDefault();


    const email =
        document.querySelector("#loginEmail")?.value
        .trim()
        .toLowerCase();


    const password =
        document.querySelector("#loginPassword")?.value;


    const user =
        state.users.find(
            item =>
                item.email.toLowerCase() === email &&
                item.password === password
        );


    if (!user) {

        showToast(
            "Invalid Credential. Check Email or Password.",
            "error"
        );

        return;
    }


    state.currentUser = user;

    saveCurrentUser();

    showToast(
        "Login successful! Welcome to VentureCircle 👋",
        "success"
    );


    setTimeout(() => {

        window.location.href =
            "dashboard.html";

    }, 700);
}


/* =========================================================
   REGISTER
   ========================================================= */

function handleRegister(event) {

    event.preventDefault();


    const name =
        document.querySelector("#registerName")?.value.trim();


    const email =
        document.querySelector("#registerEmail")?.value
        .trim()
        .toLowerCase();


    const mobile =
        document.querySelector("#registerMobile")?.value.trim();


    const password =
        document.querySelector("#registerPassword")?.value;


    if (
        !name ||
        !email ||
        !mobile ||
        !password
    ) {

        showToast(
            "Please fill all required fields.",
            "error"
        );

        return;
    }


    const emailExists =
        state.users.some(
            user =>
                user.email.toLowerCase() === email
        );


    if (emailExists) {

        showToast(
            "Email already registered.",
            "error"
        );

        return;
    }


    const newUser = {

        id: Date.now(),

        name,

        email,

        mobile,

        password,

        role: "shopkeeper",

        verified: false,

        createdAt:
            new Date().toISOString()

    };


    state.users.push(newUser);

    saveUsers();


    showToast(
        "Registration successful! Please verify your email.",
        "success"
    );


    setTimeout(() => {

        showLoginForm();

    }, 1000);
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    state.currentUser = null;

    saveCurrentUser();

    showToast(
        "Logged out successfully.",
        "success"
    );


    setTimeout(() => {

        window.location.href =
            "index.html";

    }, 500);
}


/* =========================================================
   UPDATE USER INTERFACE
   ========================================================= */

function updateUserInterface() {

    document
        .querySelectorAll(
            ".user-name, #userName"
        )
        .forEach(element => {

            element.textContent =
                state.currentUser?.name ||
                "Guest";
        });


    document
        .querySelectorAll(
            ".user-email, #userEmail"
        )
        .forEach(element => {

            element.textContent =
                state.currentUser?.email ||
                "";
        });
}


/* =========================================================
   PROFILE
   ========================================================= */

function renderProfile() {

    const containers =
        document.querySelectorAll(
            "#profileContainer, .profile-container"
        );


    containers.forEach(container => {

        if (!state.currentUser) {

            container.innerHTML = `

                <div class="empty-profile">

                    <h3>
                        Please login
                    </h3>

                    <button
                        class="btn btn-primary"
                        onclick="window.location.href='index.html'"
                    >
                        Login
                    </button>

                </div>
            `;

            return;
        }


        container.innerHTML = `

            <div class="profile-card">

                <div class="profile-avatar">
                    ${escapeHTML(
                        state.currentUser.name
                            .charAt(0)
                            .toUpperCase()
                    )}
                </div>

                <h2>
                    ${escapeHTML(state.currentUser.name)}
                </h2>

                <p>
                    ${escapeHTML(state.currentUser.email)}
                </p>

                <p>
                    📱 ${escapeHTML(state.currentUser.mobile)}
                </p>

                <span class="profile-role">
                    Shopkeeper
                </span>

            </div>
        `;
    });
}


/* =========================================================
   SHOPKEEPER PRODUCT ADD
   ========================================================= */

function addProduct(productData) {

    if (!state.currentUser) {

        showToast(
            "Please login as a shopkeeper.",
            "error"
        );

        return;
    }


    const product = {

        id: Date.now(),

        name: productData.name,

        category: productData.category,

        price: Number(productData.price),

        unit:
            productData.unit ||
            "piece",

        shopName:
            productData.shopName ||
            state.currentUser.name,

        shopkeeper:
            state.currentUser.name,

        location:
            productData.location ||
            "Not specified",

        phone:
            state.currentUser.mobile,

        email:
            state.currentUser.email,

        image:
            productData.image ||
            "https://via.placeholder.com/500x350?text=Product",

        description:
            productData.description ||
            "",

        stock:
            Number(productData.stock) || 0,

        createdAt:
            new Date().toISOString(),

        ownerId:
            state.currentUser.id
    };


    state.products.unshift(product);

    saveProducts();

    renderProducts();


    showToast(
        "Product added successfully 🎉",
        "success"
    );
}


/* =========================================================
   UPDATE PRODUCT
   ========================================================= */

function updateProduct(id, changes) {

    const index =
        state.products.findIndex(
            product =>
                String(product.id) === String(id)
        );


    if (index === -1) {

        showToast(
            "Product not found.",
            "error"
        );

        return;
    }


    state.products[index] = {

        ...state.products[index],

        ...changes,

        updatedAt:
            new Date().toISOString()
    };


    saveProducts();

    renderProducts();

    showToast(
        "Product updated successfully.",
        "success"
    );
}


/* =========================================================
   DELETE PRODUCT
   ========================================================= */

function deleteProduct(id) {

    const product =
        findProduct(id);


    if (!product) return;


    const confirmation =
        confirm(
            `Delete "${product.name}"?`
        );


    if (!confirmation) return;


    state.products =
        state.products.filter(
            item =>
                String(item.id) !== String(id)
        );


    saveProducts();

    renderProducts();

    showToast(
        "Product deleted successfully.",
        "success"
    );
}


/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */

function showToast(message, type = "success") {

    let container =
        document.querySelector("#toastContainer");


    if (!container) {

        container =
            document.createElement("div");

        container.id =
            "toastContainer";

        container.className =
            "toast-container";

        document.body.appendChild(container);
    }


    const toast =
        document.createElement("div");


    toast.className =
        `toast toast-${type}`;


    toast.innerHTML = `

        <span class="toast-icon">
            ${type === "success" ? "✓" : "⚠"}
        </span>

        <span class="toast-message">
            ${escapeHTML(message)}
        </span>

        <button class="toast-close">
            ×
        </button>

    `;


    container.appendChild(toast);


    toast
        .querySelector(".toast-close")
        .addEventListener(
            "click",
            () => toast.remove()
        );


    setTimeout(() => {

        toast.classList.add("hide");

        setTimeout(
            () => toast.remove(),
            300
        );

    }, 3500);
}


/* =========================================================
   LOGIN / REGISTER UI
   ========================================================= */

function showLoginForm() {

    const login =
        document.querySelector("#loginSection");

    const register =
        document.querySelector("#registerSection");


    if (login) {

        login.style.display = "block";
    }


    if (register) {

        register.style.display = "none";
    }
}


function showRegisterForm() {

    const login =
        document.querySelector("#loginSection");

    const register =
        document.querySelector("#registerSection");


    if (login) {

        login.style.display = "none";
    }


    if (register) {

        register.style.display = "block";
    }
}


/* =========================================================
   IMAGE PREVIEW
   ========================================================= */

function setupImagePreview(inputSelector, previewSelector) {

    const input =
        document.querySelector(inputSelector);


    const preview =
        document.querySelector(previewSelector);


    if (!input || !preview) return;


    input.addEventListener("change", event => {

        const file =
            event.target.files[0];


        if (!file) return;


        if (!file.type.startsWith("image/")) {

            showToast(
                "Please select an image file.",
                "error"
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload = function(e) {

            preview.src =
                e.target.result;

            preview.style.display =
                "block";
        };


        reader.readAsDataURL(file);
    });
}


/* =========================================================
   EMAIL VALIDATION
   ========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


/* =========================================================
   MOBILE VALIDATION
   ========================================================= */

function isValidMobile(mobile) {

    return /^[6-9]\d{9}$/.test(mobile);
}


/* =========================================================
   PASSWORD VALIDATION
   ========================================================= */

function isValidPassword(password) {

    return password.length >= 6;
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";
    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


/* =========================================================
   TRUNCATE TEXT
   ========================================================= */

function truncate(text, length) {

    if (!text) return "";

    if (text.length <= length) {

        return text;
    }


    return (
        text.substring(0, length) +
        "..."
    );
}


/* =========================================================
   SORT PRODUCTS
   ========================================================= */

function sortProducts(type) {

    switch (type) {

        case "price-low":

            state.products.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );

            break;


        case "price-high":

            state.products.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );

            break;


        case "newest":

            state.products.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

            break;


        case "name":

            state.products.sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );

            break;
    }


    saveProducts();

    renderProducts();
}


/* =========================================================
   LOCATION FILTER
   ========================================================= */

function filterByLocation(location) {

    if (!location) {

        renderProducts();

        return;
    }


    const products =
        state.products.filter(
            product =>
                product.location
                    .toLowerCase()
                    .includes(
                        location.toLowerCase()
                    )
        );


    const containers =
        document.querySelectorAll(
            "#productContainer, #productsContainer, .products-grid"
        );


    containers.forEach(container => {

        container.innerHTML =
            products
                .map(createProductCard)
                .join("");


        addProductCardEvents(container);
    });
}


/* =========================================================
   SHOPKEEPER PRODUCTS
   ========================================================= */

function getMyProducts() {

    if (!state.currentUser) {

        return [];
    }


    return state.products.filter(
        product =>
            String(product.ownerId) ===
            String(state.currentUser.id)
    );
}


/* =========================================================
   DASHBOARD STATISTICS
   ========================================================= */

function updateDashboardStats() {

    const myProducts =
        getMyProducts();


    const productCount =
        myProducts.length;


    const totalStock =
        myProducts.reduce(
            (total, product) =>
                total + Number(product.stock || 0),
            0
        );


    const elements = {

        productCount:
            document.querySelector("#productCount"),

        totalStock:
            document.querySelector("#totalStock"),

        userCount:
            document.querySelector("#userCount"),

        categoryCount:
            document.querySelector("#categoryCount")
    };


    if (elements.productCount) {

        elements.productCount.textContent =
            productCount;
    }


    if (elements.totalStock) {

        elements.totalStock.textContent =
            totalStock;
    }


    if (elements.userCount) {

        elements.userCount.textContent =
            state.users.length;
    }


    if (elements.categoryCount) {

        elements.categoryCount.textContent =
            getCategories().length - 1;
    }
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const menuButton =
        document.querySelector(
            ".mobile-menu-button"
        );


    const navigation =
        document.querySelector(
            ".main-navigation"
        );


    if (!menuButton || !navigation) {

        return;
    }


    menuButton.addEventListener(
        "click",
        () => {

            navigation.classList.toggle(
                "mobile-open"
            );

        }
    );
}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();


            const search =
                document.querySelector(
                    "#searchInput, .search-input"
                );


            if (search) {

                search.focus();
            }
        }


        if (event.key === "Escape") {

            closeAllModals();
        }
    }
);


/* =========================================================
   WINDOW EVENTS
   ========================================================= */

window.addEventListener(
    "hashchange",
    showCurrentSection
);


window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            "venturecircleProducts"
        ) {

            state.products =
                JSON.parse(event.newValue) || [];

            renderProducts();
        }


        if (
            event.key ===
            "venturecircleUsers"
        ) {

            state.users =
                JSON.parse(event.newValue) || [];
        }


        if (
            event.key ===
            "venturecircleCart"
        ) {

            state.cart =
                JSON.parse(event.newValue) || [];

            updateCartCount();

            renderCart();
        }
    }
);


/* =========================================================
   EXPORT FUNCTIONS
   ========================================================= */

window.VentureCircle = {

    state,

    navigateTo,

    addProduct,

    updateProduct,

    deleteProduct,

    addToCart,

    removeFromCart,

    updateCartQuantity,

    renderProducts,

    renderCart,

    openProductModal,

    closeAllModals,

    showToast,

    sortProducts,

    filterByLocation,

    getCategories,

    getMyProducts
};


/* =========================================================
   FINAL INITIALIZATION
   ========================================================= */

setTimeout(() => {

    initializeMobileMenu();

    setupImagePreview(
        "#productImage",
        "#imagePreview"
    );

    updateDashboardStats();

}, 100);
