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
        }
    });
});

const contactForm = document.getElementById('contactForm');
const reservationForm = document.getElementById('reservationForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Děkujeme za vaši zprávu. Budeme vás kontaktovat co nejdříve.');
        contactForm.reset();
    });
}

if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Děkujeme za vaši rezervaci. Budeme vás kontaktovat pro potvrzení.');
        reservationForm.reset();
    });
}

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