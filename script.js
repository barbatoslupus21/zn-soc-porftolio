/* ============================================
   MINIMALIST PORTFOLIO - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavigation();
    initSmoothScroll();
    initProjectFilters();
    initProjectModal();
    initContactForm();
    initSlotMachineStats();
});

/* ============================================
   THEME TOGGLE
   ============================================ */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Sticky navigation on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ============================================
   SMOOTH SCROLLING
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ============================================
   PROJECT FILTERS
   ============================================ */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-horizontal');
    let previousButton = null;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Determine direction (which side liquid comes from)
            let direction = 'left';
            if (previousButton) {
                const prevIndex = Array.from(filterButtons).indexOf(previousButton);
                const currentIndex = Array.from(filterButtons).indexOf(button);
                // If moving to button on the RIGHT, liquid comes from RIGHT (slideRight)
                // If moving to button on the LEFT, liquid comes from LEFT (slideLeft)
                direction = currentIndex > prevIndex ? 'fromright' : 'fromleft';
            }
            
            // Remove active class and direction from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.removeAttribute('data-direction');
                // Trigger reflow to restart animation
                btn.offsetHeight;
            });
            
            // Add active class and direction to clicked button
            button.classList.add('active');
            button.setAttribute('data-direction', direction);
            previousButton = button;
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ============================================
   PROJECT MODAL WITH CAROUSEL
   ============================================ */
function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    const carouselTrack = document.getElementById('carousel-track');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const carouselDots = document.getElementById('carousel-dots');
    
    if (!modal) return;
    
    let currentImages = [];
    let currentIndex = 0;
    let isAnimating = false;
    
    // Open modal on project preview click or view project button
    document.querySelectorAll('.project-preview, .view-project-btn').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = element.closest('.project-horizontal');
            const imagesAttr = projectCard?.getAttribute('data-images');
            
            if (imagesAttr) {
                currentImages = imagesAttr.split(',').filter(img => img.trim());
                if (currentImages.length > 0) {
                    currentIndex = 0;
                    openModal();
                }
            }
        });
    });
    
    // Close modal
    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft' && currentImages.length > 1) prevImage();
        if (e.key === 'ArrowRight' && currentImages.length > 1) nextImage();
    });
    
    function openModal() {
        const modalContent = modal.querySelector('.modal-content');
        modalContent?.classList.remove('closing');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Check if single image - hide dots
        const isSingle = currentImages.length === 1;
        
        if (carouselDots) {
            carouselDots.classList.toggle('hidden', isSingle);
        }
        
        buildCarousel();
        renderDots();
    }
    
    function closeModal() {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.add('closing');
            setTimeout(() => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                // Clear carousel
                if (carouselTrack) {
                    carouselTrack.innerHTML = '';
                }
            }, 300);
        } else {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    function buildCarousel() {
        if (!carouselTrack) return;
        
        // Clear existing slides
        carouselTrack.innerHTML = '';
        
        // Create slides for all images
        currentImages.forEach((imgSrc, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.setAttribute('data-index', index);
            
            const img = document.createElement('img');
            img.src = imgSrc.trim();
            img.alt = `Project Screenshot ${index + 1}`;
            img.loading = 'lazy';
            
            slide.appendChild(img);
            carouselTrack.appendChild(slide);
            
            // Click on image to navigate - left side goes prev, right side goes next
            slide.addEventListener('click', (e) => {
                if (currentImages.length <= 1) return;
                
                const rect = slide.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const midpoint = rect.width / 2;
                
                if (clickX < midpoint) {
                    prevImage();
                } else {
                    nextImage();
                }
            });
        });
        
        updateCarousel();
    }
    
    function updateCarousel() {
        const slides = carouselTrack?.querySelectorAll('.carousel-slide');
        if (!slides || slides.length === 0) return;
        
        const totalSlides = slides.length;
        const isSingle = totalSlides === 1;
        
        slides.forEach((slide, index) => {
            // Remove all position classes
            slide.classList.remove('active', 'prev', 'next', 'hidden', 'single');
            
            if (isSingle) {
                // Single image - just show it centered
                slide.classList.add('single');
            } else {
                // Calculate position relative to current index
                let position = index - currentIndex;
                
                // Handle wrapping for infinite carousel feel
                if (position < -1) position = position + totalSlides;
                if (position > 1) position = position - totalSlides;
                
                // For 2 images, special handling
                if (totalSlides === 2) {
                    if (index === currentIndex) {
                        slide.classList.add('active');
                    } else {
                        // Show the other image on the right side
                        slide.classList.add('next');
                    }
                } else {
                    // 3+ images
                    if (position === 0) {
                        slide.classList.add('active');
                    } else if (position === -1 || (position === totalSlides - 1 && currentIndex === 0)) {
                        slide.classList.add('prev');
                    } else if (position === 1 || (position === -(totalSlides - 1) && currentIndex === totalSlides - 1)) {
                        slide.classList.add('next');
                    } else {
                        slide.classList.add('hidden');
                    }
                }
            }
        });
        
        updateDots();
    }
    
    function prevImage() {
        if (isAnimating || currentImages.length <= 1) return;
        isAnimating = true;
        
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateCarousel();
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    function nextImage() {
        if (isAnimating || currentImages.length <= 1) return;
        isAnimating = true;
        
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateCarousel();
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    function renderDots() {
        if (!carouselDots || currentImages.length <= 1) return;
        carouselDots.innerHTML = '';
        
        currentImages.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot' + (index === currentIndex ? ' active' : '');
            dot.addEventListener('click', () => {
                if (isAnimating || index === currentIndex) return;
                isAnimating = true;
                currentIndex = index;
                updateCarousel();
                setTimeout(() => {
                    isAnimating = false;
                }, 500);
            });
            carouselDots.appendChild(dot);
        });
    }
    
    function updateDots() {
        const dots = carouselDots?.querySelectorAll('.carousel-dot');
        dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(data.email)) {
            showStatus('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
    });
    
    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;
        
        setTimeout(() => {
            formStatus.className = 'form-status';
            formStatus.textContent = '';
        }, 5000);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/* ============================================
   ODOMETER COUNT-UP STATS ANIMATION
   ============================================ */
function initSlotMachineStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    let hasAnimated = false;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats();
            }
        });
    }, observerOptions);
    
    // Observe the stats section
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    function animateStats() {
        statNumbers.forEach((element) => {
            const targetValue = parseInt(element.getAttribute('data-count'));
            const suffix = element.textContent.replace(/\d+/g, '');
            
            const duration = 2000; // 2 seconds
            const fps = 60;
            const frames = (duration / 1000) * fps;
            const increment = targetValue / frames;
            
            let currentValue = 0;
            let frameCount = 0;
            
            const animate = setInterval(() => {
                frameCount++;
                currentValue += increment;
                
                if (frameCount >= frames) {
                    currentValue = targetValue;
                    clearInterval(animate);
                }
                
                element.textContent = Math.floor(currentValue) + suffix;
            }, 1000 / fps);
        });
    }
}
