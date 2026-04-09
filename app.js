function register() {
  const shopName = document.getElementById("shopName").value;
  const shopType = document.getElementById("shopType").value;
  const location = document.getElementById("location").value;

  const user = { shopName, shopType, location };

  localStorage.setItem("user", JSON.stringify(user));

  window.location.href = "dashboard.html";
}