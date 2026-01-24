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
    // Ensure banner element exists
    if (announcementBanner) {
        // Force banner to be visible (temporarily ignore localStorage for testing)
        announcementBanner.classList.remove('hidden');
        announcementBanner.style.transform = 'translateY(0)';
        announcementBanner.style.display = 'block';
        announcementBanner.style.visibility = 'visible';
        announcementBanner.style.position = 'fixed';
        announcementBanner.style.top = '0';
        announcementBanner.style.left = '0';
        announcementBanner.style.right = '0';
        announcementBanner.style.width = '100%';
        announcementBanner.style.zIndex = '1001';
        updateBannerHeight();
    }
    
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

        // Close mobile menu when clicking on dropdown menu items
        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Allow navigation - don't prevent default or stop propagation
                // Let the smooth scrolling handler also run
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                // Close all dropdowns
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
                // Don't stop propagation - let other handlers run
            });
        });

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
                        // Only stop propagation if not clicking on a dropdown menu item
                        // This allows dropdown menu items to navigate
                        if (!e.target.closest('.dropdown-menu')) {
                            e.stopPropagation();
                        }
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

// Simple navigation function that can be called directly
function navigateToHash(href) {
    if (!href || !href.includes('#')) {
        return true; // Not a hash link, let browser handle it
    }
    
    const hashIndex = href.indexOf('#');
    const hash = href.substring(hashIndex);
    const targetId = hash.substring(1);
    
    // Get current page name
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Check if it's a cross-page link
    if (href.includes('.html')) {
        let linkPage = href.split('#')[0];
        linkPage = linkPage.replace(/^\.\//, '').replace(/^\//, '').replace(/\/$/, '');
        
        // If linking to a different page, store hash and navigate
        if (linkPage && linkPage !== currentPage) {
            sessionStorage.setItem('scrollToHash', targetId);
            window.location.href = href; // Navigate directly
            return false; // Prevent default
        }
    }
    
    // Same-page hash link - handle smooth scroll
    if (hash !== '#' && targetId) {
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
            return false; // Prevent default
        }
    }
    
    return true; // Allow default navigation
}

// Attach event listeners to hash links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!navigateToHash(href)) {
                e.preventDefault();
            }
        });
    });
});

// Handle hash navigation on page load (same logic as same-page scrolling)
function scrollToHash() {
    const hash = window.location.hash || sessionStorage.getItem('scrollToHash');
    if (hash) {
        const targetId = hash.replace('#', '');
        if (targetId) {
            // Use the same scrolling logic as same-page links
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
                // Clear stored hash after successful scroll
                if (sessionStorage.getItem('scrollToHash')) {
                    sessionStorage.removeItem('scrollToHash');
                }
            }
        }
    }
}

// Run on page load - use same approach as "Plan a Visit" (#locations)
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have a stored hash from cross-page navigation
    const storedHash = sessionStorage.getItem('scrollToHash');
    if (storedHash) {
        window.location.hash = storedHash;
    }
    
    // Scroll to hash after a short delay (same timing as same-page links)
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

// Handle hash changes (when hash changes on same page)
window.addEventListener('hashchange', () => {
    setTimeout(() => {
        scrollToHash();
    }, 100);
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
    const dropdowns = document.querySelectorAll('.dropdown');
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

