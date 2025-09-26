// Modern Portfolio JavaScript
(function() {
    'use strict';

    // Smooth scrolling polyfill
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Theme management
    const themeManager = {
        init() {
            this.themeToggle = document.getElementById('theme-toggle');
            this.currentTheme = localStorage.getItem('theme') || 'light';
            
            this.setTheme(this.currentTheme);
            this.bindEvents();
        },

        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            this.currentTheme = theme;
            this.updateThemeIcon();
        },

        updateThemeIcon() {
            const icon = this.themeToggle.querySelector('svg');
            if (this.currentTheme === 'dark') {
                icon.innerHTML = `
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                `;
            } else {
                icon.innerHTML = `
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                `;
            }
        },

        toggleTheme() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        },

        bindEvents() {
            this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        }
    };

    // Navigation management
    const navigation = {
        init() {
            this.navbar = document.getElementById('navbar');
            this.mobileMenu = document.getElementById('mobile-menu');
            this.navMenu = document.getElementById('nav-menu');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.scrollArrow = document.getElementById('scroll-arrow');

            this.bindEvents();
            this.handleScroll();
        },

        bindEvents() {
            // Mobile menu toggle
            this.mobileMenu?.addEventListener('click', () => this.toggleMobileMenu());

            // Smooth scrolling for nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = link.getAttribute('href');
                    smoothScroll(target);
                    this.closeMobileMenu();
                });
            });

            // Scroll arrow
            this.scrollArrow?.addEventListener('click', () => {
                smoothScroll('#about');
            });

            // Scroll events
            window.addEventListener('scroll', () => this.handleScroll());
            
            // Close mobile menu on outside click
            document.addEventListener('click', (e) => {
                if (!this.navbar.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        },

        toggleMobileMenu() {
            this.mobileMenu?.classList.toggle('active');
            this.navMenu?.classList.toggle('active');
        },

        closeMobileMenu() {
            this.mobileMenu?.classList.remove('active');
            this.navMenu?.classList.remove('active');
        },

        handleScroll() {
            const scrollTop = window.pageYOffset;
            
            // Navbar background
            if (scrollTop > 50) {
                this.navbar?.classList.add('scrolled');
            } else {
                this.navbar?.classList.remove('scrolled');
            }

            // Update active nav link
            this.updateActiveNavLink();
        },

        updateActiveNavLink() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.pageYOffset + 100;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    };

    // Animations
    const animations = {
        init() {
            this.observeElements();
        },

        observeElements() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe all cards and sections
            const elements = document.querySelectorAll('.card, .project-card, .skill-category');
            elements.forEach(el => observer.observe(el));
        }
    };

    // Contact form
    const contactForm = {
        init() {
            this.form = document.getElementById('contact-form');
            this.bindEvents();
        },

        bindEvents() {
            this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
        },

        async handleSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Show success message
                this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.form.reset();
            } catch (error) {
                this.showMessage('Failed to send message. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        },

        showMessage(message, type) {
            // Create and show message
            const messageEl = document.createElement('div');
            messageEl.className = `form-message form-message--${type}`;
            messageEl.textContent = message;
            
            this.form.prepend(messageEl);
            
            setTimeout(() => {
                messageEl.remove();
            }, 5000);
        }
    };

    // Scroll animations
    const scrollAnimations = {
        init() {
            this.addScrollClasses();
        },

        addScrollClasses() {
            const style = document.createElement('style');
            style.textContent = `
                .animate-in {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .form-message {
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1rem;
                    font-weight: 500;
                }
                
                .form-message--success {
                    background: #dcfce7;
                    color: #166534;
                    border: 1px solid #bbf7d0;
                }
                
                .form-message--error {
                    background: #fee2e2;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                }
                
                [data-theme="dark"] .form-message--success {
                    background: #0f2419;
                    color: #4ade80;
                    border-color: #166534;
                }
                
                [data-theme="dark"] .form-message--error {
                    background: #2d0e0e;
                    color: #f87171;
                    border-color: #7f1d1d;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Performance optimizations
    const performance = {
        init() {
            this.lazyLoadImages();
            this.prefetchCriticalResources();
        },

        lazyLoadImages() {
            const images = document.querySelectorAll('img[loading="lazy"]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src || img.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            }
        },

        prefetchCriticalResources() {
            // Prefetch critical resources
            const criticalResources = [
                'assets/images/profile-placeholder.svg'
            ];

            criticalResources.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = resource;
                document.head.appendChild(link);
            });
        }
    };

    // Initialize everything when DOM is ready
    function init() {
        themeManager.init();
        navigation.init();
        animations.init();
        contactForm.init();
        scrollAnimations.init();
        performance.init();
    }

    // Start the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
