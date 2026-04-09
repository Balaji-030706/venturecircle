function addProduct() {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  const name = document.getElementById("productName").value;
  const price = document.getElementById("price").value;

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

function displayProducts() {
  const user = JSON.parse(localStorage.getItem("user"));
  const products = JSON.parse(localStorage.getItem("products")) || [];

  let output = "";

  products.forEach(p => {
    if (p.type === user.shopType) {
      output += `
        <div>
          <b>${p.name}</b> - ₹${p.price} <br>
          Shop: ${p.shop} <br>
          Location: ${p.location}
        </div><hr>
      `;
    }
  });

  document.getElementById("productList").innerHTML = output;
}

window.onload = displayProducts;