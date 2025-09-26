// Portfolio JavaScript - Optimized for Performance
(function() {
    'use strict';

    // Utility functions
    const utils = {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        isElementInViewport: function(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        isElementPartiallyInViewport: function(el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            return (
                rect.bottom >= 0 &&
                rect.right >= 0 &&
                rect.top <= windowHeight &&
                rect.left <= windowWidth
            );
        }
    };

    // DOM elements
    const elements = {
        navbar: document.getElementById('navbar'),
        mobileMenu: document.getElementById('mobile-menu'),
        navMenu: document.getElementById('nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        contactForm: document.getElementById('contact-form'),
        skillBars: document.querySelectorAll('.skill-progress'),
        sections: document.querySelectorAll('section[id]'),
        themeToggle: document.getElementById('theme-toggle'),
        scrollArrow: document.querySelector('.scroll-arrow')
    };

    // Navigation functionality
    const navigation = {
        init: function() {
            this.handleScroll();
            this.setupMobileMenu();
            this.setupSmoothScrolling();
            this.setupActiveSection();
            this.setupScrollArrow();
            
            // Event listeners
            window.addEventListener('scroll', utils.throttle(this.handleScroll.bind(this), 10));
            window.addEventListener('scroll', utils.throttle(this.updateActiveSection.bind(this), 100));
        },

        handleScroll: function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                elements.navbar.classList.add('scrolled');
            } else {
                elements.navbar.classList.remove('scrolled');
            }
        },

        setupMobileMenu: function() {
            if (!elements.mobileMenu || !elements.navMenu) return;

            elements.mobileMenu.addEventListener('click', () => {
                elements.mobileMenu.classList.toggle('active');
                elements.navMenu.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (elements.navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Close mobile menu when clicking on nav links
            elements.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    elements.mobileMenu.classList.remove('active');
                    elements.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!elements.navbar.contains(e.target) && elements.navMenu.classList.contains('active')) {
                    elements.mobileMenu.classList.remove('active');
                    elements.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        },

        setupSmoothScrolling: function() {
            elements.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        setupActiveSection: function() {
            this.updateActiveSection();
        },

        updateActiveSection: function() {
            const scrollPos = window.pageYOffset + 100;
            
            elements.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    elements.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },

        setupScrollArrow: function() {
            if (!elements.scrollArrow) return;
            
            elements.scrollArrow.addEventListener('click', () => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    };

    // Animations and effects
    const animations = {
        init: function() {
            this.setupScrollAnimations();
            this.setupSkillBars();
        },

        setupScrollAnimations: function() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                        entry.target.classList.add('animate-in');
                    }
                });
            }, observerOptions);

            // Observe elements for animation
            const animateElements = document.querySelectorAll('.project-card, .skill-category, .timeline-item, .about-card');
            animateElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.observe(el);
            });

            // Add CSS for animate-in class
            const style = document.createElement('style');
            style.textContent = `
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `;
            document.head.appendChild(style);
        },

        setupSkillBars: function() {
            const skillObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const skillBar = entry.target;
                        const width = skillBar.getAttribute('data-width');
                        setTimeout(() => {
                            skillBar.style.width = width + '%';
                        }, 200);
                        skillObserver.unobserve(skillBar);
                    }
                });
            }, { threshold: 0.5 });

            elements.skillBars.forEach(bar => {
                skillObserver.observe(bar);
            });
        }
    };

    // Contact form functionality
    const contactForm = {
        init: function() {
            if (!elements.contactForm) return;
            
            elements.contactForm.addEventListener('submit', this.handleSubmit.bind(this));
            this.setupFormValidation();
        },

        handleSubmit: function(e) {
            e.preventDefault();
            
            const formData = new FormData(elements.contactForm);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!this.validateForm(data)) {
                return;
            }

            // Show loading state
            const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                this.showSuccess();
                elements.contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        },

        validateForm: function(data) {
            const errors = [];
            
            if (!data.name.trim()) errors.push('Name is required');
            if (!data.email.trim()) errors.push('Email is required');
            if (!this.isValidEmail(data.email)) errors.push('Please enter a valid email');
            if (!data.message.trim()) errors.push('Message is required');
            
            if (errors.length > 0) {
                this.showErrors(errors);
                return false;
            }
            
            return true;
        },

        isValidEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        setupFormValidation: function() {
            const inputs = elements.contactForm.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        },

        validateField: function(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            
            if (field.hasAttribute('required') && !value) {
                this.showFieldError(field, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
                return false;
            }
            
            if (fieldName === 'email' && value && !this.isValidEmail(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            
            this.clearFieldError(field);
            return true;
        },

        showFieldError: function(field, message) {
            this.clearFieldError(field);
            
            field.style.borderColor = '#ef4444';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = '#ef4444';
            errorDiv.style.fontSize = '0.875rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = message;
            
            field.parentNode.appendChild(errorDiv);
        },

        clearFieldError: function(field) {
            field.style.borderColor = '';
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        },

        showErrors: function(errors) {
            const errorMsg = errors.join('\n');
            alert(errorMsg); // Replace with better UI notification
        },

        showSuccess: function() {
            // Create success notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                animation: slideInRight 0.3s ease-out;
            `;
            notification.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            
            // Add animation keyframes
            if (!document.querySelector('#success-animation')) {
                const style = document.createElement('style');
                style.id = 'success-animation';
                style.textContent = `
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            // Remove notification after 5 seconds
            setTimeout(() => {
                notification.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 5000);
        }
    };

    // Performance optimizations
    const performance = {
        init: function() {
            this.lazyLoadImages();
            this.preloadCriticalResources();
        },

        lazyLoadImages: function() {
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

            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                imageObserver.observe(img);
            });
        },

        preloadCriticalResources: function() {
            // Preload hero image
            const heroImg = document.querySelector('.profile-image img');
            if (heroImg && heroImg.src) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = heroImg.src;
                document.head.appendChild(link);
            }
        }
    };

        // Theme functionality
    const theme = {
        init: function() {
            this.loadTheme();
            this.setupThemeToggle();
        },

        loadTheme: function() {
            const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
            this.setTheme(savedTheme);
        },

        setTheme: function(themeName) {
            document.documentElement.setAttribute('data-theme', themeName);
            localStorage.setItem('portfolio-theme', themeName);
            
            // Update meta theme-color for mobile browsers
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', themeName === 'dark' ? '#111827' : '#ffffff');
            } else {
                const meta = document.createElement('meta');
                meta.name = 'theme-color';
                meta.content = themeName === 'dark' ? '#111827' : '#ffffff';
                document.head.appendChild(meta);
            }
        },

        toggleTheme: function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        },

        setupThemeToggle: function() {
            if (!elements.themeToggle) return;
            
            elements.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });

            // Keyboard support
            elements.themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });

            // Make it focusable
            elements.themeToggle.setAttribute('tabindex', '0');
        }
    };

    // Theme and accessibility
    const accessibility = {
        init: function() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.setupReducedMotion();
        },

        setupKeyboardNavigation: function() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && elements.navMenu.classList.contains('active')) {
                    elements.mobileMenu.classList.remove('active');
                    elements.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        },

        setupFocusManagement: function() {
            // Ensure focus is visible for keyboard users
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-nav');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-nav');
            });

            // Add CSS for keyboard navigation
            const style = document.createElement('style');
            style.textContent = `
                body:not(.keyboard-nav) *:focus {
                    outline: none;
                }
                .keyboard-nav *:focus {
                    outline: 2px solid var(--primary-color);
                    outline-offset: 2px;
                }
            `;
            document.head.appendChild(style);
        },

        setupReducedMotion: function() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.style.setProperty('--transition-fast', '0.01ms');
                document.documentElement.style.setProperty('--transition-base', '0.01ms');
                document.documentElement.style.setProperty('--transition-slow', '0.01ms');
            }
        }
    };

    // Initialize everything when DOM is ready
    function init() {
        theme.init();
        navigation.init();
        animations.init();
        contactForm.init();
        performance.init();
        accessibility.init();
        initCounters();
    }

    // Animated Counters
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target >= 1000 ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (target >= 1000 ? '+' : '');
            }
        }, 16);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose utilities for debugging (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.portfolioDebug = {
            elements,
            navigation,
            animations,
            contactForm,
            theme,
            utils
        };
    }

})();
