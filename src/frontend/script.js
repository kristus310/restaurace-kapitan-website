const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isExpanded = navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        body.classList.toggle('menu-open');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });
}

document.addEventListener('click', (e) => {
    if (hamburger && navLinks && !hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            if (navLinks) navLinks.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            body.classList.remove('menu-open');

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            if (history.pushState) {
                history.pushState(null, null, this.getAttribute('href'));
            }
        }
    });
});

const header = document.querySelector('header');
let lastScroll = 0;

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

class MenuCarousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = container.querySelectorAll('.carousel-slide');
        this.prevBtn = container.querySelector('.carousel-prev');
        this.nextBtn = container.querySelector('.carousel-next');
        this.dotsContainer = container.querySelector('.carousel-dots');
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        
        if (this.totalSlides <= 1) {
            if (this.prevBtn) this.prevBtn.style.display = 'none';
            if (this.nextBtn) this.nextBtn.style.display = 'none';
            return;
        }
        this.init();
    }
    
    init() {
        this.slides[0].classList.add('active');
        this.createDots();
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        this.setupTouchEvents();
        this.updateButtons();
    }
    
    createDots() {
        if (!this.dotsContainer || this.totalSlides <= 1) return;
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Přejít na snímek ${i + 1}`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.totalSlides - 1;
        }
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;
        
        this.slides[this.currentIndex].classList.remove('active');
        this.slides[index].classList.add('active');
        
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        if (dots[this.currentIndex]) {
            dots[this.currentIndex].classList.remove('active');
            dots[this.currentIndex].setAttribute('aria-selected', 'false');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
            dots[index].setAttribute('aria-selected', 'true');
        }
        
        this.currentIndex = index;
        this.updateButtons();
    }
    
    next() {
        if (this.currentIndex < this.totalSlides - 1) {
            this.goToSlide(this.currentIndex + 1);
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        }
    }
    
    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            const diff = startX - currentX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            isDragging = false;
        }, { passive: true });
    }
}

function initializeCarousel(carouselContainer) {
    if (carouselContainer && !carouselContainer.dataset.initialized) {
        new MenuCarousel(carouselContainer);
        carouselContainer.dataset.initialized = 'true';
    }
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function initializeCarousels() {
    const activeCarousel = document.querySelector('.menu-category.active .menu-carousel');
    if (activeCarousel) {
        initializeCarousel(activeCarousel);
    }
}

function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;

    if (urlParams.get('success') === '1') {
        if (hash.includes('contact')) {
            showNotification('Zpráva byla úspěšně odeslána! Děkujeme za kontakt.', 'success');
        } else if (hash.includes('reservation')) {
            showNotification('Rezervace byla úspěšně odeslána! Brzy vás budeme kontaktovat.', 'success');
        }
    } else if (urlParams.get('error')) {
        const errorType = urlParams.get('error');
        let errorMessage = 'Došlo k chybě. Zkuste to prosím znovu.';

        switch (errorType) {
            case 'send':
                errorMessage = 'Chyba při odesílání zprávy. Zkontrolujte internetové připojení a zkuste znovu.';
                break;
            case 'email':
                errorMessage = 'Neplatný email. Zkontrolujte prosím email adresu.';
                break;
            case 'missing':
                errorMessage = 'Vyplňte prosím všechna povinná pole.';
                break;
        }

        showNotification(errorMessage, 'error');
    }

    if (urlParams.has('success') || urlParams.has('error')) {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

window.addEventListener('DOMContentLoaded', function () {
    initializeCarousels();
    handleUrlParams();
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.menu-item, .feature, .info-item').forEach(element => {
    observer.observe(element);
});

const categoryButtons = document.querySelectorAll('.category-btn');
const menuCategories = document.querySelectorAll('.menu-category');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        menuCategories.forEach(category => category.classList.remove('active'));

        button.classList.add('active');

        const categoryId = button.getAttribute('data-category');
        const targetCategory = document.getElementById(categoryId);

        if (targetCategory) {
            targetCategory.classList.add('active');

            const carousel = targetCategory.querySelector('.menu-carousel');
            if (carousel) {
                initializeCarousel(carousel);
            }
        }
    });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
    const name = this.querySelector('#name').value.trim();
    const email = this.querySelector('#email').value.trim();
    const message = this.querySelector('#message').value.trim();

    if (!name || !email || !message) {
        e.preventDefault();
        showNotification('Vyplňte prosím všechna pole.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        e.preventDefault();
        showNotification('Zadejte prosím platný email.', 'error');
        return;
    }
    });
}

const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
    reservationForm.addEventListener('submit', function (e) {
    const name = this.querySelector('#resName').value.trim();
    const email = this.querySelector('#resEmail').value.trim();
    const date = this.querySelector('#resDate').value;
    const time = this.querySelector('#resTime').value;
    const guests = this.querySelector('#resGuests').value;

    if (!name || !email || !date || !time || !guests) {
        e.preventDefault();
        showNotification('Vyplňte prosím všechna povinná pole.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        e.preventDefault();
        showNotification('Zadejte prosím platný email.', 'error');
        return;
    }

    if (parseInt(guests) < 1) {
        e.preventDefault();
        showNotification('Počet osob musí být alespoň 1.', 'error');
        return;
    }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}