    let editingProductId = null;

    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function updateSubCategory() {
        const category = document.getElementById('category').value;
        const subCat = document.getElementById('sub_category');
        subCat.innerHTML = '<option value="">Select Sub-category</option>';

        const categories = {
            "Electronics": ["Mobile", "Laptop", "Camera"],
            "Fashion": ["Men", "Women", "Kids"],
            "Home": ["Furniture", "Decor", "Kitchen"],
            "Books": ["Fiction", "Non-fiction", "Educational"],
            "Beauty": ["Skincare", "Makeup", "Fragrance"]
        };

        if(categories[category]){
            categories[category].forEach(sub => {
                const opt = document.createElement('option');
                opt.value = sub;
                opt.textContent = sub;
                subCat.appendChild(opt);
            });
        }
    }


    function saveProduct(event) {
        event.preventDefault();
        const form = document.getElementById('productForm');
        const messageElement = document.getElementById('formMessage');

        const productData = {
            id: editingProductId || generateId(),
            name: form.product_name.value,
            sku: form.sku.value,
            category: form.category.value,
            sub_category: form.sub_category.value,
            price: parseFloat(form.price.value).toFixed(2),
            MRP: parseFloat(form.mrp.value).toFixed(2) || 0,
            quantity: parseInt(form.quantity.value),
            rating: form.rating.value,
            color: form.color.value,
            description: form.description.value,
            image: 'https://via.placeholder.com/150?text=' + form.product_name.value.replace(/\s/g, '+')
        };

        
        const imageInput = document.getElementById('productImages');
        if (imageInput && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                productData.image = e.target.result;
                saveToLocalStorage(productData, messageElement, form);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            saveToLocalStorage(productData, messageElement, form);
        }
    }

    
    function saveToLocalStorage(product, messageElement, form){
        let products = JSON.parse(localStorage.getItem('vendorProducts')) || [];

        if(editingProductId){
            products = products.map(p => p.id === editingProductId ? product : p);
            messageElement.textContent = `✅ Product "${product.name}" updated!`;
            editingProductId = null;
        } else {
            products.push(product);
            messageElement.textContent = `✅ Product "${product.name}" added!`;
        }

        messageElement.style.color = '#007600';
        localStorage.setItem('vendorProducts', JSON.stringify(products));
        form.reset();
        loadInventory();
    }

 
    function loadInventory(){
        const container = document.getElementById('inventoryContainer');
        container.innerHTML = '';
        const products = JSON.parse(localStorage.getItem('vendorProducts')) || [];

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'inventory-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>Category: ${product.category} > ${product.sub_category}</p>
                <p>Price: ₹${product.price} | MRP: ₹${product.MRP}</p>
                <p>Qty: ${product.quantity} | Rating: ${product.rating} ⭐</p>
                <button class="edit-btn" onclick="editProduct('${product.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteProduct('${product.id}')">Delete</button>
            `;
            container.appendChild(card);
        });
    }

 
    function editProduct(id){
        const products = JSON.parse(localStorage.getItem('vendorProducts')) || [];
        const product = products.find(p => p.id === id);
        if(!product) return;

        editingProductId = id;

        const form = document.getElementById('productForm');
        form.product_name.value = product.name;
        form.sku.value = product.sku;
        form.category.value = product.category;
        updateSubCategory();
        form.sub_category.value = product.sub_category;
        form.price.value = product.price;
        form.mrp.value = product.MRP;
        form.quantity.value = product.quantity;
        form.rating.value = product.rating;
        form.color.value = product.color;
        form.description.value = product.description;
    }

    function deleteProduct(id){
        let products = JSON.parse(localStorage.getItem('vendorProducts')) || [];
        products = products.filter(p => p.id !== id);
        localStorage.setItem('vendorProducts', JSON.stringify(products));
        loadInventory();
    }

    window.onload = loadInventory;
    document.getElementById('logoutButton').addEventListener('click', () => {
  
        localStorage.clear();

       
        window.location.href = 'login.html';
    });
