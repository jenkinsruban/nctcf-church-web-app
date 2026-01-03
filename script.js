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
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a non-dropdown link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Only close if it's not a dropdown parent link
                if (!link.parentElement.classList.contains('dropdown')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });

        // Mobile Dropdown Toggle
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('.nav-link');
            
            if (dropdownLink) {
                dropdownLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= 968) {
                        const href = dropdownLink.getAttribute('href');
                        const isPageLink = href && (href.endsWith('.html') || href.includes('.html#'));
                        const isArrowClick = e.target.classList.contains('dropdown-arrow') || e.target.closest('.dropdown-arrow');
                        
                        // If clicking on a page link (like about.html) and not the arrow, allow navigation
                        if (isPageLink && !isArrowClick) {
                            // Close menu and navigate
                            navMenu.classList.remove('active');
                            hamburger.classList.remove('active');
                            // Allow default navigation
                            return true;
                        }
                        
                        // Otherwise, toggle dropdown
                        e.preventDefault();
                        e.stopPropagation();
                        // Close other dropdowns
                        dropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('active');
                            }
                        });
                        dropdown.classList.toggle('active');
                    }
                });
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
});

// Smooth Scrolling for hash links
document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.includes('#')) {
            const hashIndex = href.indexOf('#');
            const hash = href.substring(hashIndex);
            const targetId = hash.substring(1);
            
            // If it's a cross-page link (contains .html), let browser navigate first
            if (href.includes('.html') && hashIndex > 0) {
                // Store hash for after page load
                sessionStorage.setItem('scrollToHash', targetId);
                // Allow default navigation
                return true;
            }
            
            // For same-page hash links, handle smooth scroll
            if (hash !== '#' && targetId) {
                e.preventDefault();
                const target = document.querySelector('#' + targetId);
                if (target) {
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 70;
                    const banner = document.getElementById('announcementBanner');
                    const bannerHeight = (banner && !banner.classList.contains('hidden')) ? banner.offsetHeight : 0;
                    const offsetTop = target.offsetTop - navbarHeight - bannerHeight - 30;
                    window.scrollTo({
                        top: Math.max(0, offsetTop),
                        behavior: 'smooth'
                    });
                }
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
                const offsetTop = target.offsetTop - navbarHeight - bannerHeight - 30;
                window.scrollTo({
                    top: Math.max(0, offsetTop),
                    behavior: 'smooth'
                });
            }
        }, 500);
    }
}

// Handle cross-page navigation with hash (this is now handled in the smooth scrolling section above)

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have a stored hash from cross-page navigation
    const storedHash = sessionStorage.getItem('scrollToHash');
    if (storedHash) {
        sessionStorage.removeItem('scrollToHash');
        window.location.hash = storedHash;
    }
    // Delay to ensure page is fully rendered
    setTimeout(() => {
        scrollToHash();
    }, 100);
});

// Also run after page is fully loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        scrollToHash();
    }, 200);
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

