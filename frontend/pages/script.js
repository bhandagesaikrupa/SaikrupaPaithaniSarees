


// document.addEventListener("DOMContentLoaded", async function () {
//   const productList = document.getElementById("productList");
//   const typeFilter = document.getElementById("typeFilter");
//   const priceRange = document.getElementById("priceRange");
//   const priceValue = document.getElementById("priceValue");
//   const sortFilter = document.getElementById("sortFilter");
//   const applyBtn = document.querySelector(".apply-btn");
//   const resetBtn = document.querySelector(".reset-btn");
//   const cartCount = document.querySelector(".cart-count");

//   let currentCartCount = 0;
//   let products = [];
//   let filteredProducts = [];

//   // ✅ Get URL parameters
//   function getUrlParams() {
//     const urlParams = new URLSearchParams(window.location.search);
//     return {
//       category: urlParams.get('category'),
//       search: urlParams.get('search')
//     };
//   }

//   // ✅ Fetch products from backend
//   async function fetchProducts() {
//     try {
//       const res = await fetch("http://localhost:5000/api/products");
//       if (!res.ok) throw new Error("Failed to fetch products");
//       const data = await res.json();
//       products = data;
      
//       // Check URL parameters
//       const urlParams = getUrlParams();
      
//       if (urlParams.category) {
//         // Auto-filter by category
//         typeFilter.value = urlParams.category;
//         applyFilters(); // Apply filter automatically
//       } else if (urlParams.search) {
//         // Auto-search
//         performSearch(urlParams.search);
//       } else {
//         filteredProducts = [...products];
//         renderProducts(products);
//       }
      
//       updateProductCount();
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       productList.innerHTML = `<p class='text-red-600'>Failed to load products. Please try again later.</p>`;
//     }
//   }

//   // ✅ Search function
//   function performSearch(searchTerm) {
//     const searchLower = searchTerm.toLowerCase();
    
//     filteredProducts = products.filter(product => 
//       product.name.toLowerCase().includes(searchLower) ||
//       (product.description && product.description.toLowerCase().includes(searchLower)) ||
//       (product.category && product.category.toLowerCase().includes(searchLower))
//     );
    
//     renderProducts(filteredProducts);
//     updateProductCount();
    
//     // Update page title or show search term
//     const productCount = document.getElementById("productCount");
//     if (productCount) {
//       productCount.textContent = `(${filteredProducts.length} results for "${searchTerm}")`;
//     }
//   }

//   // ✅ Apply filters function
//   function applyFilters() {
//     const type = typeFilter.value;
//     const maxPrice = parseInt(priceRange.value);
//     const sortOption = sortFilter.value;

//     filteredProducts = products.filter((p) => {
//       const matchesType = type === "" || p.category === type;
//       const matchesPrice = p.price <= maxPrice;
//       return matchesType && matchesPrice;
//     });

//     // Apply sorting - FIXED: Use the exact values from your HTML
//     if (sortOption === "lowToHigh") {
//       filteredProducts.sort((a, b) => a.price - b.price);
//     } else if (sortOption === "highToLow") {
//       filteredProducts.sort((a, b) => b.price - a.price);
//     } else if (sortOption === "popularity") {
//       filteredProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
//     } else if (sortOption === "newest") {
//       // Assuming you have a createdAt field - you might need to adjust this
//       filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
//     }

//     renderProducts(filteredProducts);
//     updateProductCount();
//   }

//   function renderProducts(items) {
//     productList.innerHTML = "";
//     productList.classList.add("products-grid");

//     if (!items.length) {
//       const urlParams = getUrlParams();
//       let message = 'No products found for the selected filters.';
      
//       if (urlParams.search) {
//         message = `No products found for "${urlParams.search}". Try different keywords.`;
//       } else if (urlParams.category) {
//         message = `No products found in "${urlParams.category}" category.`;
//       }
      
//       productList.innerHTML = `
//         <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
//           <p class='text-gray-600'>${message}</p>
//           <button class="filter-btn reset-btn" style="margin-top: 10px;" onclick="resetFilters()">Show All Products</button>
//         </div>
//       `;
//       return;
//     }

//     items.forEach((product) => {
//       const imageSrc = product.images?.[0]
//         ? `http://localhost:5000/${product.images[0].replace(/\\/g, "/")}`
//         : "https://via.placeholder.com/300x300?text=No+Image";

//       const card = document.createElement("div");
//       card.className = "product-card";

//       card.innerHTML = `
//         <img src="${imageSrc}" alt="${product.name}">
//         <div class="product-info">
//           <h3>${product.name}</h3>
//           <p>Type: ${product.category || "Uncategorized"}</p>
//           <div class="price">₹${product.price ? product.price.toLocaleString() : '0'}</div>
//           <div class="rating">${"★".repeat(product.popularity || 0)}${"☆".repeat(5 - (product.popularity || 0))}</div>
//           <div class="card-actions">
//             <button class="addToCart">Add to Cart</button>
//             <a href="description.html?id=${product._id}"><button class="shop-now">View More</button></a>
//           </div>
//         </div>
//       `;

//       const btn = card.querySelector(".addToCart");
//       btn.addEventListener("click", () => {
//         currentCartCount++;
//         if (cartCount) {
//           cartCount.textContent = currentCartCount;
//         }
//         alert(`${product.name} added to cart!`);
//       });

//       productList.appendChild(card);
//     });
//   }

//   // ✅ Update product count
//   function updateProductCount() {
//     const productCount = document.getElementById("productCount");
//     if (productCount) {
//       const count = filteredProducts.length;
//       const urlParams = getUrlParams();
      
//       if (urlParams.category) {
//         productCount.textContent = `(${count} ${urlParams.category} products)`;
//       } else if (urlParams.search) {
//         productCount.textContent = `(${count} results for "${urlParams.search}")`;
//       } else {
//         productCount.textContent = `(${count} products)`;
//       }
//     }
//   }

//   // ✅ Reset filters function
//   function resetFilters() {
//     typeFilter.value = "";
//     priceRange.value = 50000;
//     priceValue.textContent = "₹50,000";
//     sortFilter.value = "default";
    
//     // Clear URL parameters
//     window.history.replaceState({}, '', 'product.html');
    
//     filteredProducts = [...products];
//     renderProducts(filteredProducts);
//     updateProductCount();
//   }

//   // ✅ Event Listeners
//   applyBtn.addEventListener("click", applyFilters);
  
//   if (resetBtn) {
//     resetBtn.addEventListener("click", resetFilters);
//   }

//   if (priceRange && priceValue) {
//     priceRange.addEventListener("input", function () {
//       priceValue.textContent = `₹${parseInt(priceRange.value).toLocaleString()}`;
//     });
//   }

//   // Make resetFilters available globally for the reset button in no products message
//   window.resetFilters = resetFilters;

//   async function updateCartCount() {
//     try {
//       const token = localStorage.getItem('authToken');
//       const headers = {
//         'Content-Type': 'application/json'
//       };
      
//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }
      
//       const res = await fetch("http://localhost:5000/api/cart", {
//         headers: headers
//       });
      
//       if (res.ok) {
//         const data = await res.json();
//         if (data.success && data.cart && data.cart.items) {
//           const totalItems = data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
//           document.querySelectorAll(".cart-count").forEach(el => {
//             el.textContent = totalItems;
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Error updating cart count:", err);
//     }
//   }

//   // ✅ Initialize
//   fetchProducts();
//   updateCartCount();

  
// });




document.addEventListener("DOMContentLoaded", async function () {
  const productList = document.getElementById("productList");
  const typeFilter = document.getElementById("typeFilter");
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const sortFilter = document.getElementById("sortFilter");
  const applyBtn = document.querySelector(".apply-btn");
  const resetBtn = document.querySelector(".reset-btn");
  const cartCount = document.querySelector(".cart-count");

  let currentCartCount = 0;
  let products = [];
  let filteredProducts = [];

  // ✅ Get URL parameters
  function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      category: urlParams.get('category'),
      search: urlParams.get('search')
    };
  }

  // ✅ Fetch products from backend
  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      products = data;
      
      // Check URL parameters
      const urlParams = getUrlParams();
      
      if (urlParams.category) {
        // Auto-filter by category
        typeFilter.value = urlParams.category;
        applyFilters(); // Apply filter automatically
      } else if (urlParams.search) {
        // Auto-search - FIXED: Call performSearch function
        performSearch(urlParams.search);
      } else {
        filteredProducts = [...products];
        renderProducts(products);
      }
      
      updateProductCount();
    } catch (err) {
      console.error("Error fetching products:", err);
      productList.innerHTML = `<p style="color: red; text-align: center; padding: 40px;">Failed to load products. Please try again later.</p>`;
    }
  }

  // ✅ Search function - FIXED: Properly handle search
  function performSearch(searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    
    filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower)) ||
      (product.category && product.category.toLowerCase().includes(searchLower))
    );
    
    renderProducts(filteredProducts);
    updateProductCount();
    
    // Update page title or show search term
    const productCount = document.getElementById("productCount");
    if (productCount) {
      productCount.textContent = `(${filteredProducts.length} results for "${searchTerm}")`;
    }
  }

  // ✅ Apply filters function - FIXED: Use correct sort values
  function applyFilters() {
    const type = typeFilter.value;
    const maxPrice = parseInt(priceRange.value);
    const sortOption = sortFilter.value;

    filteredProducts = products.filter((p) => {
      const matchesType = type === "" || p.category === type;
      const matchesPrice = p.price <= maxPrice;
      return matchesType && matchesPrice;
    });

    // Apply sorting - FIXED: Use exact values from HTML
    if (sortOption === "lowToHigh") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "popularity") {
      filteredProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (sortOption === "newest") {
      // If you have createdAt field, use it. Otherwise use _id as fallback
      filteredProducts.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        // Fallback: sort by _id (newer products typically have higher ObjectIds)
        return b._id.localeCompare(a._id);
      });
    }

    renderProducts(filteredProducts);
    updateProductCount();
  }

  function renderProducts(items) {
    productList.innerHTML = "";
    productList.classList.add("products-grid");

    if (!items.length) {
      const urlParams = getUrlParams();
      let message = 'No products found for the selected filters.';
      
      if (urlParams.search) {
        message = `No products found for "${urlParams.search}". Try different keywords.`;
      } else if (urlParams.category) {
        message = `No products found in "${urlParams.category}" category.`;
      }
      
      productList.innerHTML = `
        <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
          <p style="color: #777;">${message}</p>
          <button class="filter-btn reset-btn" style="margin-top: 10px;" onclick="resetFilters()">Show All Products</button>
        </div>
      `;
      return;
    }

    items.forEach((product) => {
      const imageSrc = product.images?.[0]
        ? `http://localhost:5000/${product.images[0].replace(/\\/g, "/")}`
        : "https://via.placeholder.com/300x300?text=No+Image";

      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${imageSrc}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>Type: ${product.category || "Uncategorized"}</p>
          <div class="price">₹${product.price ? product.price.toLocaleString() : '0'}</div>
          <div class="rating">${"★".repeat(product.popularity || 0)}${"☆".repeat(5 - (product.popularity || 0))}</div>
          <div class="card-actions">
            <button class="addToCart">Add to Cart</button>
            <a href="description.html?id=${product._id}"><button class="shop-now">View More</button></a>
          </div>
        </div>
      `;

      const btn = card.querySelector(".addToCart");
      btn.addEventListener("click", () => {
        addToCart(product);
      });

      productList.appendChild(card);
    });
  }

  // ✅ Add to Cart function - IMPROVED
  async function addToCart(product) {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Logged-in user - add to backend cart
        const res = await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            productId: product._id, 
            quantity: 1 
          })
        });
        
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            currentCartCount++;
            if (cartCount) {
              cartCount.textContent = currentCartCount;
            }
            alert(`${product.name} added to cart!`);
            updateCartCount(); // Refresh cart count from server
          }
        }
      } else {
        // Guest user - add to localStorage
        let guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        
        const existingItem = guestCart.find(item => item.productId === product._id);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          guestCart.push({
            productId: product._id,
            name: product.name,
            image: product.images?.[0] || '',
            price: product.price,
            quantity: 1
          });
        }
        
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        currentCartCount = guestCart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
          cartCount.textContent = currentCartCount;
        }
        alert(`${product.name} added to cart!`);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart. Please try again.');
    }
  }

  // ✅ Update product count
  function updateProductCount() {
    const productCount = document.getElementById("productCount");
    if (productCount) {
      const count = filteredProducts.length;
      const urlParams = getUrlParams();
      
      if (urlParams.category) {
        productCount.textContent = `(${count} ${urlParams.category} products)`;
      } else if (urlParams.search) {
        productCount.textContent = `(${count} results for "${urlParams.search}")`;
      } else {
        productCount.textContent = `(${count} products)`;
      }
    }
  }

  // ✅ Reset filters function - IMPROVED
  function resetFilters() {
    typeFilter.value = "";
    priceRange.value = 50000;
    priceValue.textContent = "₹50,000";
    sortFilter.value = "default";
    
    // Clear URL parameters
    window.history.replaceState({}, '', 'product.html');
    
    filteredProducts = [...products];
    renderProducts(filteredProducts);
    updateProductCount();
  }

  // ✅ Event Listeners
  applyBtn.addEventListener("click", applyFilters);
  
  if (resetBtn) {
    resetBtn.addEventListener("click", resetFilters);
  }

  if (priceRange && priceValue) {
    priceRange.addEventListener("input", function () {
      priceValue.textContent = `₹${parseInt(priceRange.value).toLocaleString()}`;
    });
  }

  // Make resetFilters available globally for the reset button in no products message
  window.resetFilters = resetFilters;

  // ✅ Update cart count - IMPROVED
  async function updateCartCount() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Logged-in user - fetch from backend
        const res = await fetch("http://localhost:5000/api/cart", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.cart && data.cart.items) {
            const totalItems = data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
            document.querySelectorAll(".cart-count").forEach(el => {
              el.textContent = totalItems;
            });
            currentCartCount = totalItems;
          }
        }
      } else {
        // Guest user - get from localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const totalItems = guestCart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll(".cart-count").forEach(el => {
          el.textContent = totalItems;
        });
        currentCartCount = totalItems;
      }
    } catch (err) {
      console.error("Error updating cart count:", err);
    }
  }

  // ✅ Initialize
  fetchProducts();
  updateCartCount();
});