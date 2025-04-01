document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const promoCodeInput = document.getElementById('promoCode');
    const applyPromoBtn = document.getElementById('applyPromo');
    
    // Promo codes data - In a real app, this would be verified on the server
    const promoCodes = {
        'WELCOME20': 0.2, // 20% off
        'SUMMER10': 0.1,  // 10% off
        'FREESHIP': 0     // Free shipping (delivery fee = 0)
    };
    
    // Load cart from localStorage
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('foodCart')) || [];
        updateCartDisplay(cart);
    }
    
    // Update cart display
    function updateCartDisplay(cart) {
        if (cart.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'flex';
            if (cartItems) cartItems.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            if (cartEmpty) cartEmpty.style.display = 'none';
            if (cartItems) cartItems.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'block';
            
            // Generate cart items HTML
            let cartHTML = '';
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="item-total">
                        <p>$${itemTotal.toFixed(2)}</p>
                    </div>
                    <div class="item-actions">
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                `;
            });
            
            if (cartItems) cartItems.innerHTML = cartHTML;
            
            // Update summary
            updateCartSummary(cart);
        }
    }
    
    // Update cart summary
    function updateCartSummary(cart) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const deliveryFee = parseFloat(document.getElementById('deliveryFee').textContent.replace('$', ''));
        const taxRate = 0.1; // 10% tax rate
        const tax = subtotal * taxRate;
        
        // Apply promo code if it exists
        let discount = 0;
        const activePromo = localStorage.getItem('activePromo');
        const discountRow = document.getElementById('discountRow');
        const discountEl = document.getElementById('discount');
        
        if (activePromo && promoCodes[activePromo]) {
            discount = subtotal * promoCodes[activePromo];
            if (discountRow) discountRow.style.display = 'flex';
            if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
        } else if (activePromo === 'FREESHIP') {
            // Handle free shipping
            document.getElementById('deliveryFee').textContent = '$0.00';
            if (discountRow) discountRow.style.display = 'none';
        } else {
            if (discountRow) discountRow.style.display = 'none';
        }
        
        const total = subtotal + tax + deliveryFee - discount;
        
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }
    
    // Update cart count in header
    function updateCartCount() {
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) {
            let cart = JSON.parse(localStorage.getItem('foodCart')) || [];
            let count = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountEl.textContent = count;
        }
    }
    
    // Increase item quantity
    function increaseQuantity(itemId) {
        let cart = JSON.parse(localStorage.getItem('foodCart')) || [];
        const item = cart.find(item => item.id === parseInt(itemId));
        
        if (item) {
            item.quantity += 1;
            localStorage.setItem('foodCart', JSON.stringify(cart));
            loadCart();
            updateCartCount();
        }
    }
    
    // Decrease item quantity
    function decreaseQuantity(itemId) {
        let cart = JSON.parse(localStorage.getItem('foodCart')) || [];
        const itemIndex = cart.findIndex(item => item.id === parseInt(itemId));
        
        if (itemIndex !== -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
            
            localStorage.setItem('foodCart', JSON.stringify(cart));
            loadCart();
            updateCartCount();
        }
    }
    
    // Remove item from cart
    function removeItem(itemId) {
        let cart = JSON.parse(localStorage.getItem('foodCart')) || [];
        const itemIndex = cart.findIndex(item => item.id === parseInt(itemId));
        
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
            localStorage.setItem('foodCart', JSON.stringify(cart));
            loadCart();
            updateCartCount();
        }
    }
    
    // Apply promo code
    function applyPromoCode(code) {
        if (promoCodes[code]) {
            localStorage.setItem('activePromo', code);
            showNotification(`Promo code ${code} applied. You got ${promoCodes[code] * 100}% off!`);
            loadCart();
        } else if (code === 'FREESHIP') {
            localStorage.setItem('activePromo', code);
            showNotification('Free shipping promo applied!');
            loadCart();
        } else {
            showNotification('Invalid promo code. Please try again.', 'error');
        }
    }
    
    // Proceed to checkout
    function proceedToCheckout() {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (isLoggedIn) {
            // Save cart to session for checkout page
            window.location.href = 'checkout.html';
        } else {
            // Redirect to login with return URL
            localStorage.setItem('returnUrl', 'checkout.html');
            window.location.href = 'login.html';
        }
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Event Listeners
    if (cartItems) {
        // Quantity increase/decrease and remove item
        cartItems.addEventListener('click', function(e) {
            if (e.target.classList.contains('increase') || e.target.closest('.increase')) {
                const button = e.target.classList.contains('increase') ? e.target : e.target.closest('.increase');
                const itemId = button.getAttribute('data-id');
                increaseQuantity(itemId);
            } 
            else if (e.target.classList.contains('decrease') || e.target.closest('.decrease')) {
                const button = e.target.classList.contains('decrease') ? e.target : e.target.closest('.decrease');
                const itemId = button.getAttribute('data-id');
                decreaseQuantity(itemId);
            } 
            else if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
                const itemId = button.getAttribute('data-id');
                removeItem(itemId);
            }
        });
    }
    
    // Apply promo code
    if (applyPromoBtn && promoCodeInput) {
        applyPromoBtn.addEventListener('click', function() {
            const code = promoCodeInput.value.trim().toUpperCase();
            if (code) {
                applyPromoCode(code);
            } else {
                showNotification('Please enter a promo code.', 'error');
            }
        });
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    // Initialize cart
    loadCart();
    updateCartCount();
}); 