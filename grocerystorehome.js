    function toggleCart() {
        document.getElementById('cartSidebar').classList.toggle('active');
        document.getElementById('overlay').classList.toggle('active');
    }

   
    document.querySelector('.cta-cart').addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
    });

    
    const cartItemsList = document.getElementById('cartItemsList');
    const totalElement = document.getElementById('cartTotal');
    let totalPrice = 0;

    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card');
            const name = card.querySelector('h4').innerText;
            const priceText = card.querySelector('.price').innerText;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));

       
            const emptyMsg = cartItemsList.querySelector('.empty-msg');
            if(emptyMsg) emptyMsg.remove();

            const itemDiv = document.createElement('div');
            itemDiv.style.display = 'flex';
            itemDiv.style.justifyContent = 'space-between';
            itemDiv.style.marginBottom = '15px';
            itemDiv.innerHTML = `<span>${name}</span> <b>${priceText}</b>`;
            cartItemsList.appendChild(itemDiv);

       
            totalPrice += price;
            totalElement.innerText = `₹${totalPrice}`;
        });
    });

  
    function reveal() {
        var reveals = document.querySelectorAll(".section, .hero, .stats");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }
    window.addEventListener("scroll", reveal);
     
    document.querySelectorAll('.section, .stats').forEach(el => el.classList.add('reveal'));

   
function openModal(img, title, price, desc) {
    document.getElementById('modalImg').src = img;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalPrice').innerText = price;
    document.getElementById('modalDesc').innerText = desc;
    document.getElementById('productModal').classList.add('active');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

document.querySelectorAll('.card img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
        const card = img.closest('.card');
        const title = card.querySelector('h4').innerText;
        const price = card.querySelector('.price').innerText;
        const desc = card.querySelector('p').innerText;
        openModal(img.src, title, price, desc);
    });
});


let cart = {};

function updateCartUI() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartCountElement = document.getElementById('cartCount');
    const totalElement = document.getElementById('cartTotal');
    
    cartItemsList.innerHTML = '';
    let total = 0;
    let count = 0;

    Object.keys(cart).forEach(id => {
        const item = cart[id];
        total += item.price * item.qty;
        count += item.qty;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div>
                <div style="font-weight:600; font-size:14px;">${item.name}</div>
                <div style="font-size:12px;">₹${item.price} x ${item.qty}</div>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty('${id}', -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${id}', 1)">+</button>
            </div>
        `;
        cartItemsList.appendChild(row);
    });

    cartCountElement.innerText = count;
    totalElement.innerText = `₹${total}`;
    if(count === 0) cartItemsList.innerHTML = '<p class="empty-msg">Your basket is hungry! 🥦</p>';
}

function changeQty(id, delta) {
    if (cart[id]) {
        cart[id].qty += delta;
        if (cart[id].qty <= 0) delete cart[id];
        updateCartUI();
    }
}


document.querySelectorAll('.add-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        const name = card.querySelector('h4').innerText;
        const priceText = card.querySelector('.price').innerText;
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        const id = 'prod-' + index;

        if (cart[id]) {
            cart[id].qty++;
        } else {
            cart[id] = { name, price, qty: 1 };
        }
        updateCartUI();
        showToast("Added to basket!");
    });
});

document.querySelector('.checkout-btn').addEventListener('click', () => {
    if(totalPrice > 0 || Object.keys(cart).length > 0) {
        document.getElementById('checkoutModal').style.display = 'flex';
        toggleCart(); 
    } else {
        alert("Your basket is empty!");
    }
});

function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function placeOrder() {
    document.getElementById('checkoutModal').style.display = 'none';
    document.getElementById('successModal').style.display = 'flex';
    
    
    cart = {};
    updateCartUI();
    
        console.log("Order confirmed!");
}

function applyCoupon() {
    const code = document.getElementById('couponCode').value;
    if(code === 'FRESH20') {
        let discount = totalPrice * 0.2;
        totalPrice -= discount;
        document.getElementById('cartTotal').innerText = `₹${totalPrice.toFixed(0)} (20% Off Applied)`;
        showToast("Coupon Applied! You saved ₹" + discount.toFixed(0));
    } else {
        showToast("Invalid Coupon Code");
    }
}
const statsSection = document.querySelector('.stats');
const stats = document.querySelectorAll('.stat h3');
let started = false; 

window.onscroll = function () {
   
    if (window.scrollY >= statsSection.offsetTop - 500) {
        if (!started) {
            stats.forEach((num) => startCount(num));
        }
        started = true;
    }
};

function startCount(el) {
    let goal = el.innerText;
    
    let target = parseFloat(goal.replace(/[^0-9.]/g, ''));
    let suffix = goal.replace(/[0-9.]/g, ''); 
    
    let current = 0;
    let increment = target / 100;
    
    let count = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = target + suffix;
            clearInterval(count);
        } else {
           
            el.innerText = Math.ceil(current) + suffix;
        }
    }, 20); 
}

function shakeCart() {
    const cartIcon = document.querySelector('.cta-cart');
    cartIcon.classList.add('shake');
    setTimeout(() => cartIcon.classList.remove('shake'), 500);
}


document.querySelector('.news-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
    btn.style.background = '#0f172a';
    this.querySelector('input').value = '';
});


document.querySelectorAll('.cat').forEach(cat => {
    cat.addEventListener('click', () => {
        const categoryName = cat.innerText.toLowerCase().trim();
        showToast("Filtering for: " + categoryName);
       
    });
});
function startTimer(duration, display) {
    let timer = duration, hours, minutes, seconds;
    setInterval(function () {
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = hours + ":" + minutes + ":" + seconds;

        if (--timer < 0) timer = duration;
    }, 1000);
}


function updateMobileBar(count) {
    const bar = document.getElementById('mobileCartBar');
    const countLabel = document.getElementById('mobileCount');
    if(count > 0) {
        bar.classList.add('active');
        countLabel.innerText = count + " Items Added";
    }
}



window.onload = function () {
    let fiveHours = 60 * 60 * 5;
    let display = document.querySelector('#timer');
    startTimer(fiveHours, display);
};


const originalUpdateUI = updateCartUI;
updateCartUI = function() {
    originalUpdateUI(); 
    const count = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
    updateMobileBar(count); 
    shakeCart(); 
};
function subscribeNewsletter() {
  
    const emailInput = document.querySelector('input[type="email"]');
    const emailValue = emailInput.value.trim();
    

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        showToast("Oops! Please enter your email.");
        emailInput.focus();
        return;
    }

    if (!emailPattern.test(emailValue)) {
        showToast("Please enter a valid email address!");
        emailInput.style.border = "1px solid #ff7675"; 
        return;
    }

    
    console.log("New Subscriber: ", emailValue);
    

    showToast("Welcome to the family! 🌿 Check your mail.");

    emailInput.value = "";
    emailInput.style.border = "none";
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; 
        bottom: 30px; 
        right: 30px; 
        background: #00b894; 
        color: white; 
        padding: 15px 25px; 
        border-radius: 15px; 
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: 600;
        animation: slideIn 0.4s ease-out;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);

 
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = '0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
function addRecipe(dishName) {

    const ingredients = [
        { name: "Fresh Red Apple", price: 199, qty: 1 },
        { name: "Juicy Oranges", price: 149, qty: 1 }
    ];

    ingredients.forEach(item => {
        const id = item.name.replace(/\s/g, '');
        if (cart[id]) {
            cart[id].qty++;
        } else {
            cart[id] = { name: item.name, price: item.price, qty: 1 };
        }
    });

    updateCartUI();
    showToast(`All ingredients for ${dishName} added! 🍲`);
    
   
    document.querySelector('.cta-cart').scrollIntoView({ behavior: 'smooth' });
}
function toggleChat() {
    const chatWin = document.getElementById('chat-window');
    const badge = document.querySelector('.chat-badge');
    if (chatWin.style.display === 'none' || chatWin.style.display === '') {
        chatWin.style.display = 'flex';
        if(badge) badge.style.display = 'none';
    } else {
        chatWin.style.display = 'none';
    }
}

function toggleEmoji(){
    const box = document.getElementById("emojiBox");
    box.style.display = box.style.display === "none" ? "block" : "none";
}

document.getElementById("emojiBox").addEventListener("click", function(e){
    if(e.target.innerText.trim() !== ""){
        document.getElementById("chatInput").value += e.target.innerText;
    }
});



function handleChatKey(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const msgArea = document.getElementById('chat-messages');
    const val = input.value.trim();

    if (val === "") return;

   
    const userDiv = document.createElement('div');
    userDiv.className = 'msg user';
    userDiv.innerText = val;
    msgArea.appendChild(userDiv);
    input.value = "";

   
    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'msg bot';
        botDiv.innerText = getBotReply(val);
        msgArea.appendChild(botDiv);
        msgArea.scrollTop = msgArea.scrollHeight;
    }, 800);
}

function getBotReply(msg) {
    msg = msg.toLowerCase();

   
    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
        return "Hello! Welcome to GreenBasket 🌿. How can I help you get fresh groceries today?";
    }

    
    if (msg.includes("order") || msg.includes("track") || msg.includes("kahan hai")) {
        return "You can track your live order using the 'Track Order' button in your profile. Typically, we deliver within 30-45 minutes! 🛵";
    }

  
    if (msg.includes("offer") || msg.includes("discount") || msg.includes("coupon") || msg.includes("sasta")) {
        return "Current Offers: \n1. Use **FRESH20** for 20% off.\n2. Get ₹100 cashback on orders above ₹999! 🎁";
    }


    if (msg.includes("delivery charge") || msg.includes("free delivery")) {
        return "Delivery is **FREE** on all orders above ₹499! Below that, we charge a nominal fee of ₹29. 🚚";
    }
    if (msg.includes("time") || msg.includes("kab ayega")) {
        return "Our delivery partners are super fast! ⚡ You will get your items in 30 minutes.";
    }

  
    if (msg.includes("refund") || msg.includes("return") || msg.includes("waapas") || msg.includes("kharaab")) {
        return "Don't worry! If any item is not fresh, we have a **'No Questions Asked'** return policy. You can initiate a refund from the 'My Orders' section. 🍎";
    }


    if (msg.includes("payment") || msg.includes("pay") || msg.includes("cod") || msg.includes("online")) {
        return "We accept: \n✅ Cash on Delivery (COD)\n✅ UPI (GPay, PhonePe)\n✅ Credit/Debit Cards 💳";
    }

   
    if (msg.includes("organic") || msg.includes("fresh") || msg.includes("quality")) {
        return "Quality is our priority! 🌟 All our vegetables and fruits are sourced directly from local farms every morning.";
    }

    if (msg.includes("call") || msg.includes("number") || msg.includes("human") || msg.includes("expert")) {
        return "You can call our support team at **+91 7988454150** or email us at support@greenbasket.com. 📞";
    }


    if (msg.includes("location") || msg.includes("address") || msg.includes("kahan ho")) {
        return "Our main hub is in New Delhi, but we deliver across 15+ major cities in India! 📍";
    }


    if (msg.includes("cancel")) {
        return "You can cancel your order within 5 minutes of placing it. After that, our partner leaves for delivery! ⏱️";
    }

 
    return "I'm still learning! 😅 But you can ask me about 'Offers', 'Delivery', 'Refunds', or type 'Human' to talk to our agent.";
}
function getBotReply(msg) {
    msg = msg.toLowerCase();

   
    if (msg.includes("what is") || msg.includes("kya hai") || msg.includes("about") || msg.includes("who are you")) {
        return "GreenBasket 🌿 ek premium online grocery store hai jo aapko direct khet (farms) se taazi sabziyan aur phal deliver karta hai. \n\n" +
               "Hamaari khasiyat: \n" +
               "✅ 100% Organic & Hand-picked\n" +
               "✅ 30-Minute Fast Delivery\n" +
               "✅ No Minimum Order\n" +
               "✅ Direct from Farmers 👨‍🌾";
    }

    if (msg.includes("why") || msg.includes("kyun") || msg.includes("benefits")) {
        return "Market se sasta aur fresh! 🍎 Hum middlemen ko hata kar seedha kisanon se saaman lete hain, isliye aapko milti hai best quality aur sabse kam daam.";
    }

   
    if (msg.includes("source") || msg.includes("kahan se") || msg.includes("khet")) {
        return "Hamaara saaman local organic farms se har subah (5:00 AM) pick kiya jata hai taaki aapki plate tak sirf taazgi pahuche! 🚜";
    }

   
    if (msg.includes("safe") || msg.includes("pure") || msg.includes("chemical")) {
        return "Bilkul safe! 🛡️ Hamare products certified organic hain aur hum zero-chemical farming ko support karte hain.";
    }

    if (msg.includes("order")) return "Track your order in the 'Track Order' section! 🛵";
    
    return "I'm your Green Assistant! Ask me about 'Freshness', 'Offers', or 'Delivery'. 😊";
}

function getBotReply(msg) {
    msg = msg.toLowerCase();

   
    if (
        msg.includes("what is") ||
        msg.includes("kya hai") ||
        msg.includes("about") ||
        msg.includes("who are you") ||
        msg.includes("greenbasket")
    ) {
        return `GreenBasket 🌿 ek premium online grocery store hai.

✅ 100% Organic & Fresh
✅ Direct from Farmers 👨‍🌾
✅ 30-Minute Fast Delivery
✅ No Minimum Order

Aap taazi sabziyan aur phal ghar baithe order kar sakte hain.`;
    }

    if (
        msg.includes("why") ||
        msg.includes("kyun") ||
        msg.includes("benefits") ||
        msg.includes("advantage")
    ) {
        return "GreenBasket kyunki hum middlemen hata kar seedha kisano se saaman laate hain 🌾. Isse aapko milti hai fresh quality aur kam price!";
    }


    if (
        msg.includes("source") ||
        msg.includes("kahan se") ||
        msg.includes("farm") ||
        msg.includes("khet")
    ) {
        return "Hamaare products local organic farms se aate hain 🚜. Roz subah 5 baje fresh harvest hota hai.";
    }

    if (
        msg.includes("safe") ||
        msg.includes("pure") ||
        msg.includes("chemical") ||
        msg.includes("organic")
    ) {
        return "Bilkul safe! 🛡️ Sabhi products certified organic hain aur chemical-free farming follow karte hain.";
    }

    if (
        msg.includes("delivery") ||
        msg.includes("kitni der") ||
        msg.includes("time") ||
        msg.includes("late")
    ) {
        return "Hum 30-minute fast delivery provide karte hain ⏱️. Kabhi delay ho to aap app me track kar sakte hain.";
    }

    if (
        msg.includes("order") ||
        msg.includes("track") ||
        msg.includes("my order")
    ) {
        return "Aap apna order 'Track Order' section me easily track kar sakte hain 🛵.";
    }

    if (
        msg.includes("payment") ||
        msg.includes("pay") ||
        msg.includes("cash") ||
        msg.includes("upi")
    ) {
        return "Hum Cash on Delivery, UPI, Debit/Credit Card sab accept karte hain 💳.";
    }

    if (
        msg.includes("price") ||
        msg.includes("mehenga") ||
        msg.includes("cheap") ||
        msg.includes("sasta")
    ) {
        return "Market ke comparison me GreenBasket zyada fresh aur affordable hai 💰.";
    }


    if (
        msg.includes("offer") ||
        msg.includes("discount") ||
        msg.includes("coupon")
    ) {
        return "Roz naye offers aur seasonal discounts milte rehte hain 🎉. App ke 'Offers' section ko check karein.";
    }

    
    if (
        msg.includes("refund") ||
        msg.includes("return") ||
        msg.includes("replace")
    ) {
        return "Agar product fresh na ho, to hum easy replacement ya refund provide karte hain 🔄.";
    }

   
    if (
        msg.includes("help") ||
        msg.includes("support") ||
        msg.includes("contact")
    ) {
        return "Hamari support team hamesha madad ke liye ready hai 📞. App ke 'Help' section me jaayein.";
    }

    if (
        msg.includes("hi") ||
        msg.includes("hello") ||
        msg.includes("namaste")
    ) {
        return "Namaste 🙏 Main aapka Green Assistant hoon. Aaj aap kya jaanna chahenge?";
    }


    return "Main aapka Green Assistant 🤖 hoon. Aap 'Delivery', 'Offers', 'Organic', ya 'Order' ke baare me pooch sakte hain 😊.";
}


const voiceBtn = document.getElementById('voiceSearchBtn');
const searchBox = document.getElementById('searchInput');

voiceBtn.addEventListener('click', () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
        voiceBtn.classList.add('pulse-ring');
        showToast("Listening... Speak now 🎙️");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchBox.value = transcript;
        searchBox.dispatchEvent(new Event('input'));
        voiceBtn.classList.remove('pulse-ring');
    };

    recognition.onerror = () => {
        voiceBtn.classList.remove('pulse-ring');
        alert("Voice search failed. Try again.");
    };

    recognition.start();
});


function updateGreeting() {
    const hour = new Date().getHours();
    const heroTitle = document.querySelector('.hero-card h1');
    if(hour < 12) heroTitle.innerHTML = "Good Morning! <br>Eat Fresh, Live Healthy.";
    else if(hour < 18) heroTitle.innerHTML = "Good Afternoon! <br>Freshness Awaits.";
    else heroTitle.innerHTML = "Good Evening! <br>Dinner starts with Freshness.";
}
updateGreeting();

const toggle = document.getElementById("darkToggle");


if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggle.innerText = "☀️";
}

toggle.onclick = () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    toggle.innerText = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    toggle.innerText = "🌙";
  }
};

const cards = document.querySelectorAll('.faq-item');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Isse ek time par ek hi khulega (Accordian effect)
            cards.forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            
            card.classList.toggle('active');
        });
    });

  function copyCoupon(btn) {
    const code = btn.previousElementSibling.getAttribute("data-code");

    navigator.clipboard.writeText(code).then(() => {
      btn.textContent = "COPIED ✔";
      btn.style.background = "#00ffcc";
      btn.style.color = "#000";

      setTimeout(() => {
        btn.textContent = "COPY";
        btn.style.background = "#fff";
        btn.style.color = "#dd2476";
      }, 1500);
    });
  }

