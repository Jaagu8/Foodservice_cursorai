document.addEventListener('DOMContentLoaded', function() {
    // Toggle mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Food items data - In a real app, this would come from an API/backend
    const foodItems = [
        {
            id: 1,
            name: 'Margherita Pizza',
            category: 'pizza',
            description: 'Classic pizza with tomato, mozzarella and basil',
            price: 12.99,
            image: 'images/pizza.jpg',
            rating: 4.8,
            featured: true
        },
        {
            id: 2,
            name: 'Pepperoni Pizza',
            category: 'pizza',
            description: 'Pizza topped with pepperoni, mozzarella and tomato sauce',
            price: 14.99,
            image: 'images/pizza.jpg',
            rating: 4.6
        },
        {
            id: 3,
            name: 'Classic Burger',
            category: 'burger',
            description: 'Beef patty with lettuce, tomato, and cheese',
            price: 9.99,
            image: 'images/burger.jpg',
            rating: 4.7,
            featured: true
        },
        {
            id: 4,
            name: 'Double Cheese Burger',
            category: 'burger',
            description: 'Two beef patties with double cheese and special sauce',
            price: 12.99,
            image: 'images/burger.jpg',
            rating: 4.9
        },
        {
            id: 5,
            name: 'Carbonara Pasta',
            category: 'pasta',
            description: 'Spaghetti with creamy sauce, eggs, and bacon',
            price: 13.99,
            image: 'images/pasta.jpg',
            rating: 4.5,
            featured: true
        },
        {
            id: 6,
            name: 'Penne Arrabbiata',
            category: 'pasta',
            description: 'Penne pasta with spicy tomato sauce and herbs',
            price: 11.99,
            image: 'images/pasta.jpg',
            rating: 4.3
        },
        {
            id: 7,
            name: 'Chocolate Cake',
            category: 'dessert',
            description: 'Rich chocolate cake with fudge frosting',
            price: 7.99,
            image: 'images/dessert.jpg',
            rating: 4.8,
            featured: true
        },
        {
            id: 8,
            name: 'Ice Cream Sundae',
            category: 'dessert',
            description: 'Vanilla ice cream with chocolate sauce and nuts',
            price: 6.99,
            image: 'images/dessert.jpg',
            rating: 4.4
        },
        {
            id: 9,
            name: 'Strawberry Smoothie',
            category: 'drink',
            description: 'Fresh strawberry blended with yogurt and honey',
            price: 5.99,
            image: 'images/drink.jpg',
            rating: 4.7,
            featured: true
        },
        {
            id: 10,
            name: 'Iced Coffee',
            category: 'drink',
            description: 'Cold brewed coffee with milk and ice',
            price: 4.99,
            image: 'images/drink.jpg',
            rating: 4.5
        }
    ];
    
    // Load and display food items
    const foodItemsContainer = document.querySelector('.food-items');
    if (foodItemsContainer) {
        displayFoodItems('all');
        
        // Add filter functionality
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const category = this.getAttribute('data-filter');
                displayFoodItems(category);
            });
        });
        
        // Add category item click functionality
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                // Scroll to menu section
                document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
                // Set the corresponding filter button as active
                filterBtns.forEach(btn => {
                    if (btn.getAttribute('data-filter') === category) {
                        btn.click();
                    }
                });
            });
        });
        
        // Add category dropdown clicks
        const categoryLinks = document.querySelectorAll('.dropdown-content a');
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                // Scroll to menu section
                document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
                // Set the corresponding filter button as active
                filterBtns.forEach(btn => {
                    if (btn.getAttribute('data-filter') === category) {
                        btn.click();
                    }
                });
            });
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 2) {
                const filteredItems = foodItems.filter(item => 
                    item.name.toLowerCase().includes(searchTerm) || 
                    item.description.toLowerCase().includes(searchTerm) ||
                    item.category.toLowerCase().includes(searchTerm)
                );
                
                if (foodItemsContainer) {
                    displaySearchResults(filteredItems);
                    // Scroll to menu section
                    document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
                    // Reset filter buttons
                    const filterBtns = document.querySelectorAll('.filter-btn');
                    filterBtns.forEach(btn => btn.classList.remove('active'));
                    document.querySelector('[data-filter="all"]').classList.add('active');
                }
            } else if (searchTerm.length === 0) {
                displayFoodItems('all');
            }
        });
    }
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const itemId = parseInt(button.getAttribute('data-id'));
            addToCart(itemId);
        }
    });
    
    // Toggle favorites
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fav-btn') || e.target.closest('.fav-btn')) {
            const button = e.target.classList.contains('fav-btn') ? e.target : e.target.closest('.fav-btn');
            button.classList.toggle('active');
            const itemId = parseInt(button.getAttribute('data-id'));
            toggleFavorite(itemId);
        }
    });
    
    // Functions
    function displayFoodItems(category) {
        if (!foodItemsContainer) return;
        
        let items = foodItems;
        if (category !== 'all') {
            items = foodItems.filter(item => item.category === category);
        }
        
        displayItems(items);
    }
    
    function displaySearchResults(items) {
        if (!foodItemsContainer) return;
        displayItems(items);
    }
    
    function displayItems(items) {
        let html = '';
        if (items.length === 0) {
            html = '<div class="no-results">No items found. Try a different search.</div>';
        } else {
            items.forEach(item => {
                // Check if item is in favorites
                const isFavorite = isItemInFavorites(item.id) ? 'active' : '';
                
                html += `
                <div class="food-item" data-id="${item.id}" data-category="${item.category}">
                    <div class="food-image">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="food-tag">${item.category}</div>
                        <div class="food-actions">
                            <button class="action-btn fav-btn ${isFavorite}" data-id="${item.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="food-info">
                        <h3>${item.name}</h3>
                        <p class="food-desc">${item.description}</p>
                        <div class="food-meta">
                            <span class="food-price">$${item.price.toFixed(2)}</span>
                            <span class="food-rating"><i class="fas fa-star"></i> ${item.rating}</span>
                        </div>
                        <button class="btn food-cart-btn add-to-cart" data-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
                `;
            });
        }
        
        foodItemsContainer.innerHTML = html;
    }
    
    // Cart Functions
    function addToCart(itemId) {
        let cart = JSON.parse(localStorage.getItem('foodCart')) || [];
        const item = foodItems.find(item => item.id === itemId);
        
        if (item) {
            const existingItem = cart.find(cartItem => cartItem.id === itemId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: 1
                });
            }
            
            localStorage.setItem('foodCart', JSON.stringify(cart));
            updateCartCount();
            
            // Show notification
            showNotification(`${item.name} added to cart!`);
        }
    }
    
    function updateCartCount() {
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) {
            let cart = JSON.parse(localStorage.getItem('foodCart')) || [];
            let count = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountEl.textContent = count;
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
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
    
    // Favorites Functions
    function toggleFavorite(itemId) {
        let favorites = JSON.parse(localStorage.getItem('foodFavorites')) || [];
        
        const index = favorites.indexOf(itemId);
        
        if (index !== -1) {
            favorites.splice(index, 1);
            showNotification('Removed from favorites!');
        } else {
            favorites.push(itemId);
            showNotification('Added to favorites!');
        }
        
        localStorage.setItem('foodFavorites', JSON.stringify(favorites));
    }
    
    function isItemInFavorites(itemId) {
        let favorites = JSON.parse(localStorage.getItem('foodFavorites')) || [];
        return favorites.includes(itemId);
    }
    
    // Initialize cart count
    updateCartCount();
}); 