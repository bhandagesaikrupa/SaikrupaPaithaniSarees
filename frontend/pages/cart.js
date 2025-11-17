// async function updateCartCount() {
//   try {
//     const res = await fetch("http://localhost:5000/api/cart");
//     const data = await res.json();

//     let count = 0;
//     if (data.success && data.cart && data.cart.items) {
//       count = data.cart.items.reduce((total, item) => total + item.quantity, 0);
//     }

//     // Update ALL cart count elements on any page
//     const cartCountElements = document.querySelectorAll(".cart-count");
//     cartCountElements.forEach(el => el.textContent = count);

//   } catch (err) {
//     console.error("Error updating cart count:", err);
//   }
// }

// // Call it once page loads
// document.addEventListener("DOMContentLoaded", updateCartCount);



// Update cart count across all pages
async function updateCartCount() {
  try {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      // If not logged in, set count to 0
      document.querySelectorAll(".cart-count").forEach(el => el.textContent = 0);
      return;
    }

    const res = await fetch("http://localhost:5000/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch cart count, status:", res.status);
      return;
    }

    const data = await res.json();

    let count = 0;
    if (data.success && data.cart && data.cart.items) {
      count = data.cart.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Update ALL cart count elements on the page
    document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);

  } catch (err) {
    console.error("Error updating cart count:", err);
  }
}

// Call it once the page loads
document.addEventListener("DOMContentLoaded", updateCartCount);
