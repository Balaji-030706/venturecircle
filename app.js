// LOGIN FUNCTION
function login() {
  const username = document.getElementById("username").value;
  const shopName = document.getElementById("shopName").value;
  const shopType = document.getElementById("shopType").value;
  const location = document.getElementById("location").value;

  if (!username || !shopName || !shopType || !location) {
    alert("Please fill all fields!");
    return;
  }

  const user = { username, shopName, shopType, location };

  localStorage.setItem("user", JSON.stringify(user));

  window.location.href = "dashboard.html";
}

// ADD PRODUCT
function addProduct() {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  const name = document.getElementById("productName").value;
  const price = document.getElementById("price").value;

  if (!name || !price) {
    alert("Enter product details");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  const product = {
    shop: user.shopName,
    type: user.shopType,
    location: user.location,
    name,
    price
  };

  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));

  displayProducts();
}

// DISPLAY PRODUCTS (FILTER BY SHOP TYPE)
function displayProducts() {
  const user = JSON.parse(localStorage.getItem("user"));
  const products = JSON.parse(localStorage.getItem("products")) || [];

  let output = "";

  products.forEach(p => {
    if (p.type === user.shopType) {
      output += `
        <div class="card">
          <h3>${p.name}</h3>
          <p>Price: ₹${p.price}</p>
          <p>Shop: ${p.shop}</p>
          <p>Location: ${p.location}</p>
        </div>
      `;
    }
  });

  document.getElementById("productList").innerHTML = output;
}

// AUTO LOAD
window.onload = function () {
  if (window.location.pathname.includes("dashboard.html")) {
    displayProducts();
  }
};