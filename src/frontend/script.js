const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    body.classList.toggle('menu-open');
});

document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        body.classList.remove('menu-open');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            body.classList.remove('menu-open');

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const header = document.querySelector('header');
let lastScroll = 0;

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

function initializeCarousel(carousel) {
    if (carousel && !$(carousel).hasClass('slick-initialized')) {
        $(carousel).slick({
            dots: false,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: false,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>',
            fade: true,
            cssEase: 'linear',
            adaptiveHeight: true
        });
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

window.addEventListener('load', function () {
    const activeCarousel = document.querySelector('.menu-category.active .menu-carousel');
    if (activeCarousel) {
        initializeCarousel(activeCarousel);
    }

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

            setTimeout(() => {
                const carousel = targetCategory.querySelector('.menu-carousel');
                initializeCarousel(carousel);
            }, 50);
        }
    });
});

document.getElementById('contactForm').addEventListener('submit', function (e) {
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

document.getElementById('reservationForm').addEventListener('submit', function (e) {
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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}