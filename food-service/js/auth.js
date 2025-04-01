document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabs = document.querySelectorAll('.tab');
    const formSections = document.querySelectorAll('.form-section');
    const authLink = document.getElementById('authLink');
    const loginPrompt = document.getElementById('loginPrompt');
    
    // Check if user is already logged in
    function checkAuth() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (isLoggedIn && userData) {
            // Update auth link in navbar
            if (authLink) {
                authLink.innerHTML = `<a href="#"><i class="fas fa-user"></i> ${userData.name} <i class="fas fa-caret-down"></i></a>
                <div class="dropdown-content">
                    <a href="profile.html"><i class="fas fa-user-circle"></i> Profile</a>
                    <a href="order-history.html"><i class="fas fa-history"></i> Order History</a>
                    <a href="favorites.html"><i class="fas fa-heart"></i> Favorites</a>
                    <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>`;
                
                // Add logout functionality
                document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
                    e.preventDefault();
                    logout();
                });
            }
            
            // Hide login prompt if on order history page
            if (loginPrompt && document.getElementById('orderHistoryContainer')) {
                loginPrompt.style.display = 'none';
                document.getElementById('orderHistoryContainer').style.display = 'block';
            }
            
            // Redirect if already logged in and on login page
            if (window.location.pathname.includes('login.html')) {
                const returnUrl = localStorage.getItem('returnUrl') || 'index.html';
                localStorage.removeItem('returnUrl');
                window.location.href = returnUrl;
            }
        } else {
            // Update auth link in navbar
            if (authLink) {
                authLink.innerHTML = '<a href="login.html"><i class="fas fa-user"></i> Login</a>';
            }
            
            // Show login prompt if on order history page
            if (loginPrompt && document.getElementById('orderHistoryContainer')) {
                loginPrompt.style.display = 'flex';
                document.getElementById('orderHistoryContainer').style.display = 'none';
            }
        }
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            // In a real app, this would be a server request
            // For demo, we'll use localStorage to simulate authentication
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email);
            
            if (user && user.password === password) { // In real app, passwords would be hashed
                // Login successful
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email
                }));
                
                showNotification('Login successful! Redirecting...', 'success');
                
                // Redirect to appropriate page
                setTimeout(() => {
                    const returnUrl = localStorage.getItem('returnUrl') || 'index.html';
                    localStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                }, 1500);
            } else {
                // Login failed
                showNotification('Invalid email or password. Please try again.', 'error');
            }
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const phone = document.getElementById('signupPhone').value.trim();
            const address = document.getElementById('signupAddress').value.trim();
            
            // Validate form
            if (!name || !email || !password || !address) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // In a real app, this would be a server request
            // For demo, we'll use localStorage to simulate user registration
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            if (users.some(user => user.email === email)) {
                showNotification('Email already in use. Please try a different one.', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now(),
                name,
                email,
                password, // In real app, this would be hashed
                phone,
                address,
                dateCreated: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto-login the new user
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }));
            
            showNotification('Account created successfully! Redirecting...', 'success');
            
            // Redirect to appropriate page
            setTimeout(() => {
                const returnUrl = localStorage.getItem('returnUrl') || 'index.html';
                localStorage.removeItem('returnUrl');
                window.location.href = returnUrl;
            }, 1500);
        });
    }
    
    // Logout function
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        showNotification('You have been logged out.', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
    
    // Tab switching for login/signup forms
    if (tabs.length > 0 && formSections.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                formSections.forEach(f => f.classList.remove('active'));
                
                this.classList.add('active');
                const tabName = this.getAttribute('data-tab');
                document.getElementById(`${tabName}Form`).classList.add('active');
            });
        });
    }
    
    // Social login buttons
    const socialBtns = document.querySelectorAll('.social-btn');
    if (socialBtns.length > 0) {
        socialBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // In a real app, this would redirect to OAuth provider
                showNotification(`${this.textContent.trim()} login is not available in this demo.`, 'info');
            });
        });
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
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
    
    // Initialize
    checkAuth();
}); 