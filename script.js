// Announcement Banner
const announcementBanner = document.getElementById('announcementBanner');
const bannerClose = document.getElementById('bannerClose');

function updateBannerHeight() {
    if (announcementBanner && !announcementBanner.classList.contains('hidden')) {
        const bannerHeight = announcementBanner.offsetHeight;
        document.documentElement.style.setProperty('--banner-height', `${bannerHeight}px`);
    } else {
        document.documentElement.style.setProperty('--banner-height', '0px');
    }
}

if (bannerClose) {
    bannerClose.addEventListener('click', () => {
        announcementBanner.classList.add('hidden');
        updateBannerHeight();
        // Store in localStorage to remember user preference
        localStorage.setItem('bannerClosed', 'true');
    });
}

// Check if banner was previously closed
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('bannerClosed') === 'true') {
        announcementBanner.classList.add('hidden');
    }
    updateBannerHeight();
    
    // Update on window resize
    window.addEventListener('resize', updateBannerHeight);
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Mobile Dropdown Toggle
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const dropdownLink = dropdown.querySelector('.nav-link');
    
    dropdownLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 968) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const targetId = href.split('#')[1];
            const target = document.querySelector('#' + targetId);
            if (target) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const banner = document.getElementById('announcementBanner');
                const bannerHeight = (banner && !banner.classList.contains('hidden')) ? banner.offsetHeight : 0;
                const offsetTop = target.offsetTop - navbarHeight - bannerHeight - 20;
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Handle hash navigation on page load
function scrollToHash() {
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const target = document.querySelector('#' + targetId);
            if (target) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const banner = document.getElementById('announcementBanner');
                const bannerHeight = (banner && !banner.classList.contains('hidden')) ? banner.offsetHeight : 0;
                const offsetTop = target.offsetTop - navbarHeight - bannerHeight - 20;
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
            }
        }, 300);
    }
}

// Handle cross-page navigation with hash
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.includes('#') && href.includes('.html')) {
            // Cross-page navigation - let the browser navigate, then scroll
            const [page, hash] = href.split('#');
            if (hash) {
                // Store hash for after page load
                sessionStorage.setItem('scrollToHash', hash);
            }
        }
    });
});

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have a stored hash from cross-page navigation
    const storedHash = sessionStorage.getItem('scrollToHash');
    if (storedHash) {
        sessionStorage.removeItem('scrollToHash');
        window.location.hash = storedHash;
    }
    scrollToHash();
});

// Also run after a short delay to ensure everything is loaded
window.addEventListener('load', () => {
    scrollToHash();
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Animate on Scroll (simple fade-in effect)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.section-card, .worship-card, .location-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

