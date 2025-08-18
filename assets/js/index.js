
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBRN5PnCCkUZwcIQcH7v6HiE3S2p474wN8",
            authDomain: "trst-7237c.firebaseapp.com",
            projectId: "trst-7237c",
            storageBucket: "trst-7237c.appspot.com",
            messagingSenderId: "170480411329",
            appId: "170480411329"
        };
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        
        // Get elements
        const loadingOverlay = document.getElementById('loading-overlay');
        const progressBar = document.getElementById('progress-bar');
        const loadingText = document.querySelector('.loading-text');
        const loginModal = document.getElementById('login-modal');
        const loginForm = document.getElementById('login-form');
        const loginError = document.getElementById('login-error');
        const container = document.querySelector('.container');
        
        const loadingMessages = [
            "Loading inventory modules...",
            "Connecting to database...",
            "Verifying stock data...",
            "Preparing dashboard...",
            "Almost ready..."
        ];
        
        let progress = 0;
        let messageIndex = 0;
        let isAuthenticated = false;
        
        // Update progress bar
        const progressInterval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
            }
            progressBar.style.width = progress + '%';
        }, 155);
        
        // Update loading messages
        const messageInterval = setInterval(() => {
            if (messageIndex < loadingMessages.length) {
                loadingText.textContent = loadingMessages[messageIndex];
                messageIndex++;
            } else {
                clearInterval(messageInterval);
            }
        }, 1500);
        
        // Hide loading screen after delay and show dashboard
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.visibility = 'hidden';
            
            // Always show dashboard after loading
            container.style.display = 'flex';
            
            // Check authentication status
            auth.onAuthStateChanged(user => {
                if (user) {
                    isAuthenticated = true;
                } else {
                    // Show login modal after short delay
                    setTimeout(() => {
                        loginModal.classList.add('active');
                    }, 300);
                }
            });
        }, 7000);
        
        // Login form submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Clear previous errors
            loginError.textContent = '';
            
            // Show loading state
            const loginBtn = loginForm.querySelector('.login-btn');
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
            loginBtn.disabled = true;
            
            // Sign in with Firebase
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    isAuthenticated = true;
                    loginModal.classList.remove('active');
                })
                .catch((error) => {
                    // Reset button
                    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
                    loginBtn.disabled = false;
                    
                    // Handle errors
                    let errorMessage = "Authentication failed. Please try again.";
                    
                    switch(error.code) {
                        case "auth/user-not-found":
                            errorMessage = "User not found.";
                            break;
                        case "auth/wrong-password":
                            errorMessage = "Invalid password.";
                            break;
                        case "auth/invalid-email":
                            errorMessage = "Invalid email format.";
                            break;
                        case "auth/too-many-requests":
                            errorMessage = "Too many attempts. Try again later.";
                            break;
                    }
                    
                    loginError.textContent = errorMessage;
                    loginError.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        loginError.style.animation = '';
                    }, 500);
                });
        });
        
        // Function to open applications
        function openApplication(url) {
            if (isAuthenticated) {
                window.location.href = url;
            }
        }
        
        // Event listeners for enabled modules
        document.getElementById('herbStock').addEventListener('click', () => openApplication('herb.html'));
        document.getElementById('vegStock').addEventListener('click', () => openApplication('veg.html'));
        document.getElementById('fruitStock').addEventListener('click', () => openApplication('fruit.html'));
        document.getElementById('polStock').addEventListener('click', () => openApplication('polish.html'));
        document.getElementById('dairyStock').addEventListener('click', () => openApplication('diary.html'));
        document.getElementById('PrepStock').addEventListener('click', () => openApplication('prepveg.html'));
        document.getElementById('eggStock').addEventListener('click', () => openApplication('egg.html'));
        document.getElementById('BreadStock').addEventListener('click', () => openApplication('bread.html'));
        document.getElementById('nutStock').addEventListener('click', () => openApplication('nutdfruit.html'));

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (!isAuthenticated) return;
            
            switch(e.key) {
                case '1': openApplication('herb.html'); break;
                case '2': openApplication('veg.html'); break;
                case '3': openApplication('fruit.html'); break;
                case '4': openApplication('polish.html'); break;
                case '5': openApplication('diary.html'); break;
                case '6': openApplication('prepveg.html'); break;
                case '7': openApplication('egg.html'); break;
                case '8': openApplication('bread.html'); break;
                case '9': openApplication('nutdfruit.html'); break;
            }
        });
        
        // Disable click on other cards
        const disabledCards = document.querySelectorAll('.app-card.disabled');
        disabledCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Show temporary warning
                const warning = document.createElement('div');
                warning.innerHTML = '<i class="fas fa-exclamation-circle"></i> This module is currently unavailable';
                warning.style.position = 'fixed';
                warning.style.bottom = '20px';
                warning.style.left = '50%';
                warning.style.transform = 'translateX(-50%)';
                warning.style.backgroundColor = '#e74c3c';
                warning.style.color = 'white';
                warning.style.padding = '10px 20px';
                warning.style.borderRadius = '8px';
                warning.style.zIndex = '1000';
                warning.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                warning.style.fontWeight = 'bold';
                warning.style.opacity = '0';
                warning.style.transition = 'opacity 0.3s';
                
                document.body.appendChild(warning);
                
                // Fade in
                setTimeout(() => {
                    warning.style.opacity = '1';
                }, 10);
                
                // Remove after 2 seconds
                setTimeout(() => {
                    warning.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(warning);
                    }, 300);
                }, 2000);
            });
        });
        
        // PWA Installation Prompt
        let deferredPrompt;
        
        // Function to check if app is installed
        function isAppInstalled() {
            return window.matchMedia('(display-mode: standalone)').matches || 
                   window.navigator.standalone ||
                   document.referrer.includes('android-app://');
        }
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Check if app is already installed
            if (isAppInstalled()) {
                console.log('App already installed - skipping prompt');
                return;
            }
            
            // Show custom install prompt after 5 seconds
            setTimeout(() => {
                // Check again to avoid showing prompt if installed during timeout
                if (isAppInstalled()) {
                    console.log('App was installed during wait - skipping prompt');
                    return;
                }
                
                const installPrompt = document.createElement('div');
                installPrompt.innerHTML = `
                    <div style="
                        position: fixed;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #2c3e50;
                        color: white;
                        padding: 15px 25px;
                        border-radius: 50px;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                        z-index: 1000;
                        animation: slideUp 0.5s ease;
                    ">
                        <i class="fas fa-download" style="font-size: 1.2rem;"></i>
                        <span>Install Troops Stocktake App</span>
                        <button id="install-btn" style="
                            background: #3498db;
                            border: none;
                            color: white;
                            padding: 8px 20px;
                            border-radius: 30px;
                            font-weight: bold;
                            cursor: pointer;
                        ">Install</button>
                        <button id="dismiss-btn" style="
                            background: transparent;
                            border: none;
                            color: #bdc3c7;
                            font-size: 1.5rem;
                            cursor: pointer;
                            margin-left: 10px;
                        ">&times;</button>
                    </div>
                `;
                
                document.body.appendChild(installPrompt);
                
                document.getElementById('install-btn').addEventListener('click', async () => {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        console.log('User accepted install');
                    }
                    installPrompt.remove();
                });
                
                document.getElementById('dismiss-btn').addEventListener('click', () => {
                    installPrompt.remove();
                });
            }, 5000);
        });

        // Service Worker Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registered: ', registration);
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed: ', error);
                    });
            });
        }
    