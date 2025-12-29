        // let cart = {};
        // let totalAmount = 0;

        function addToCart(name, price) {
            if (cart[name]) { cart[name].qty += 1; }
            else { cart[name] = { price: price, qty: 1 }; }
            updateGlobalStats();
        }

        function updateGlobalStats() {
            let count = 0;
            totalAmount = 0;
            Object.keys(cart).forEach(name => {
                count += cart[name].qty;
                totalAmount += cart[name].price * cart[name].qty;
            });
            document.getElementById('cartCount').innerText = count;
            document.getElementById('cartTotalDisplay').innerText = `₹${totalAmount}`;

           
            if (count > 0) {
                document.getElementById('cartFloat').style.background = 'var(--primary)';
                document.getElementById('cartFloat').onclick = openCheckout;
            }
        }

        function openCheckout() {
            document.getElementById('checkoutModal').style.display = 'flex';
        }

        function closeModal(id) { document.getElementById(id).style.display = 'none'; }

        function placeOrder() {
            if (!document.getElementById('custName').value) { alert("Please fill details"); return; }
            document.getElementById('checkoutModal').style.display = 'none';
            document.getElementById('successModal').style.display = 'flex';
        }

        document.getElementById('searchInput').addEventListener('input', function (e) {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.card').forEach(card => {
                const title = card.querySelector('h4').innerText.toLowerCase();
                card.style.display = title.includes(term) ? "block" : "none";
            });
        });
        function toggleMobileMenu() {
            const navLinks = document.querySelector('.nav-links');
            const toggle = document.querySelector('.menu-toggle');

      
            navLinks.classList.toggle('active');

          
            toggle.classList.toggle('open');
        }

        
        document.addEventListener('click', (e) => {
            const navLinks = document.querySelector('.nav-links');
            const toggle = document.querySelector('.menu-toggle');
            if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
      
        function initCounter(id, price, name) {
            const container = document.getElementById(`controls-${id}`);
            container.innerHTML = `
        <div class="quantity-btns">
            <button onclick="updateQty('${id}', -1, ${price}, '${name}')">-</button>
            <span id="qty-${id}">1</span>
            <button onclick="updateQty('${id}', 1, ${price}, '${name}')">+</button>
        </div>
    `;
            addToCart(name, price);
        }

        function updateQty(id, change, price, name) {
            const qtySpan = document.getElementById(`qty-${id}`);
            let currentQty = parseInt(qtySpan.innerText);
            currentQty += change;

            if (currentQty < 1) {

                document.getElementById(`controls-${id}`).innerHTML =
                    `<button class="add-btn-main" onclick="initCounter('${id}', ${price}, '${name}')">Add</button>`;
                removeFromCartByName(name);
            } else {
                qtySpan.innerText = currentQty;
                change > 0 ? addToCart(name, price) : removeFromCartByName(name);
            }
        }


        function processCheckout() {
            if (cart.length === 0) return alert("Basket is empty!");
            document.getElementById('orderModal').style.display = 'flex';
            document.getElementById('cartSidebar').classList.remove('open');
            cart = [];
            updateCartUI();
        }

        function closeModal() {
            document.getElementById('orderModal').style.display = 'none';
        }


        function removeFromCartByName(name) {
            const index = cart.findIndex(item => item.name === name);
            if (index > -1) {
                cart.splice(index, 1);
                updateCartUI();
            }
        }

        setInterval(() => {
            const stats = document.querySelectorAll('.buying-stats');
            stats.forEach(stat => {
                let randomNum = Math.floor(Math.random() * 20) + 5;
                stat.innerHTML = `<span class="pulse-dot"></span> ${randomNum} people ordered recently`;
            });
        }, 5000); 

           window.onload = function () {

            let savedProducts = JSON.parse(localStorage.getItem('myProducts')) || [];
            let displayArea = document.getElementById('display-products');

            if (savedProducts.length > 0) {
                savedProducts.forEach(product => {
                    displayArea.innerHTML += `
                    <div class="stat-box" style="background: white; padding: 20px; border-radius: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                        <img src="${product.img}" style="width: 100%; border-radius: 15px; height: 150px; object-fit: cover;">
                        <h3 style="margin-top: 10px; color: #0f172a;">${product.name}</h3>
                        <p style="color: #16a34a; font-weight: 700;">${product.price}</p>
                        <button style="background: #16a34a; color: white; border: none; padding: 8px 15px; border-radius: 20px; margin-top: 10px; cursor: pointer;">Add to Cart</button>
                    </div>
                `;
                });
            }
        }
   
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

function displayProducts() {
    const productContainer = document.getElementById('product-container');
    let products = JSON.parse(localStorage.getItem('myProducts')) || [];

    if (products.length === 0) {
        productContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-basket"></i>
                <p>Oops! No fresh items added yet.</p>
            </div>`;
        return;
    }

    productContainer.innerHTML = products.map((p, index) => `
    <div class="product-card" style="--delay: ${index * 0.1}s">
        <div class="img-box">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=500&auto=format&fit=crop'">
            <span class="badge">Nature's Best</span>
        </div>
        <div class="details">
            <div class="cat">Organic & Fresh</div>
            <h3>${p.name}</h3>
            <div class="price-row">
                <span class="price-tag">₹${p.price}</span>
                <button class="add-btn" id="btn-${index}" onclick="addToCart('${p.name}', ${p.price}, 'btn-${index}')">
                    Add +
                </button>
            </div>
        </div>
    </div>
    `).join('');
    
    updateCartCount();
}

function addToCart(name, price, btnId) {
    
    const product = { name, price, quantity: 1 };
    

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cartItems', JSON.stringify(cart));
    updateCartCount();

 
    const btn = document.getElementById(btnId);
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Added';
    btn.style.background = "#064e3b"; 
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = "var(--primary)";
    }, 1500);

    
    showToast(`${name} added to basket!`);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.querySelector('.cart-count'); 
    if (cartBadge) cartBadge.innerText = count;
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `<i class="fas fa-shopping-cart"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

window.onload = displayProducts;
function updateNavCount() {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    let total = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    
    const countBadge = document.getElementById('nav-cart-count');
    if(countBadge) {
        countBadge.innerText = total;
    }
}

window.addEventListener('load', updateNavCount);



const searchFocus = document.getElementById('searchInput');
searchFocus.onkeyup = function() {
    let filter = searchFocus.value.toUpperCase();
    let cards = document.getElementsByClassName('product-card');

    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].getElementsByTagName('h3')[0];
        if (title) {
            let textValue = title.textContent || title.innerText;
            if (textValue.toUpperCase().indexOf(filter) > -1) {
                cards[i].style.display = "";
            } else {
                cards[i].style.display = "none";
            }
        }
    }
}

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const products = document.querySelectorAll(".card");

let activeCategory = "all";


filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    // active class handle
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    activeCategory = btn.getAttribute("data-filter");
    filterProducts();
  });
});


searchInput.addEventListener("input", () => {
  filterProducts();
});


function filterProducts() {
  const searchValue = searchInput.value.toLowerCase();

  products.forEach(product => {
    const productName = product.querySelector("h4").innerText.toLowerCase();
    const productCategory = product.getAttribute("data-category");

    const matchCategory =
      activeCategory === "all" || productCategory === activeCategory;

    const matchSearch = productName.includes(searchValue);

    if (matchCategory && matchSearch) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const micBtn = document.querySelector('.mic-btn');
    const searchInput = document.getElementById('searchInput');

    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US'; 
        recognition.interimResults = false;

       
        micBtn.addEventListener('click', () => {
            recognition.start();
            micBtn.style.backgroundColor = "#f0fdf4"; 
            micBtn.innerHTML = "📡"; 
        });

        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            searchInput.dispatchEvent(new Event('input')); 
            
            stopRecognition();
        };

        recognition.onspeechend = () => {
            stopRecognition();
        };

        recognition.onerror = () => {
            stopRecognition();
            alert("Voice search failed. Please try again.");
        };

        function stopRecognition() {
            recognition.stop();
            micBtn.style.backgroundColor = "transparent";
            micBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00b894" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
        }

    } else {
        micBtn.style.display = "none"; 
        console.log("Speech Recognition not supported in this browser.");
    }
});

