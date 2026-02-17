// Navigation State Management
let currentView = 'home'; // 'home', 'academic', 'datascience'
let currentSection = '';

// Navigate between main views
function navigateTo(view) {
    const homepage = document.getElementById('homepage');
    const academicPortfolio = document.getElementById('academic-portfolio');
    const datasciencePortfolio = document.getElementById('datascience-portfolio');
    
    // Remove active class from all
    homepage.classList.remove('active');
    academicPortfolio.classList.remove('active');
    datasciencePortfolio.classList.remove('active');
    
    // Add fade out effect
    if (view === 'home') {
        currentView = 'home';
        setTimeout(() => {
            homepage.classList.add('active');
        }, 100);
    } else if (view === 'academic') {
        currentView = 'academic';
        setTimeout(() => {
            academicPortfolio.classList.add('active');
            showSection('academic-home');
        }, 100);
    } else if (view === 'datascience') {
        currentView = 'datascience';
        setTimeout(() => {
            datasciencePortfolio.classList.add('active');
            showSection('ds-home');
        }, 100);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show specific section within a portfolio
function showSection(sectionId) {
    // Get all section contents
    const allSections = document.querySelectorAll('.section-content');
    
    // Remove active class from all sections
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Scroll to content area
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.scrollTo({
                top: navbar.offsetHeight,
                behavior: 'smooth'
            });
        }
    }
    
    // Prevent default link behavior
    event?.preventDefault();
}

// Add smooth scrolling
document.addEventListener('DOMContentLoaded', () => {
    // Initialize homepage
    navigateTo('home');

    // Load markdown content for sections
    loadMarkdownSections().then(() => {
        enhanceGalleries();
    });
    
    // Add hover effects to split sections
    const splitHalves = document.querySelectorAll('.split-half');
    splitHalves.forEach(half => {
        half.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        half.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    });

    // Toggle dropdown on click (for touch devices)
    document.querySelectorAll('.dropdown > .dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = toggle.closest('.dropdown');
            if (dropdown) {
                document.querySelectorAll('.dropdown').forEach(item => {
                    if (item !== dropdown) {
                        item.classList.remove('open');
                    }
                });
                dropdown.classList.toggle('open');
            }
        });
    });

    // Mobile nav toggle
    document.querySelectorAll('.nav-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const menuId = toggle.getAttribute('aria-controls');
            const menu = menuId ? document.getElementById(menuId) : null;
            if (!menu) {
                return;
            }
            const isOpen = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            if (!isOpen) {
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });
    });

    // Close mobile menu on item click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.nav-menu').forEach(menu => menu.classList.remove('open'));
            document.querySelectorAll('.nav-toggle').forEach(toggle => toggle.setAttribute('aria-expanded', 'false'));
            document.querySelectorAll('.dropdown').forEach(dropdown => dropdown.classList.remove('open'));
        });
    });
});

// Load markdown files into placeholders
async function loadMarkdownSections() {
    const mdBlocks = document.querySelectorAll('.md-content[data-md], .md-gallery[data-md]');

    for (const block of mdBlocks) {
        const src = block.getAttribute('data-md');
        if (!src) {
            continue;
        }

        try {
            const response = await fetch(src, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`Failed to load ${src}`);
            }

            const markdown = await response.text();
            if (window.marked) {
                block.innerHTML = window.marked.parse(markdown);
            } else {
                block.textContent = markdown;
            }
        } catch (error) {
            block.innerHTML = '<p>Content failed to load.</p>';
            console.error(error);
        }
    }
}

// Enhance gallery markup and add scroll reveal
function enhanceGalleries() {
    const galleries = document.querySelectorAll('.md-gallery');

    galleries.forEach(gallery => {
        const images = Array.from(gallery.querySelectorAll('img'));

        images.forEach(img => {
            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-item reveal-on-scroll';

            const caption = img.nextElementSibling && img.nextElementSibling.tagName === 'P'
                ? img.nextElementSibling
                : null;

            img.classList.add('gallery-image');
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);

            if (caption) {
                caption.classList.add('gallery-caption');
                wrapper.appendChild(caption);
            }
        });
    });

    const revealItems = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    revealItems.forEach(item => revealObserver.observe(item));
}

// Add parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-section');
    
    parallaxElements.forEach(element => {
        const speed = 0.8;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });

    // Fade out academic hero image on scroll
    const academicHeroImage = document.querySelector('#academic-home .hero-section .md-content img');
    if (academicHeroImage) {
        const fadeStart = 0;
        const fadeEnd = 300;
        const progress = Math.min(Math.max((scrolled - fadeStart) / (fadeEnd - fadeStart), 0), 1);
        academicHeroImage.style.opacity = `${1 - progress}`;
    }
});

// Prevent dropdown menu from closing when clicking inside
document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// Page loaded - no need for fade in animation that might conflict with content display

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key to return to homepage
    if (e.key === 'Escape' && currentView !== 'home') {
        navigateTo('home');
    }
    
    // Arrow keys for section navigation (optional)
    if (e.key === 'ArrowLeft' && currentView === 'datascience') {
        navigateTo('academic');
    }
    if (e.key === 'ArrowRight' && currentView === 'academic') {
        navigateTo('datascience');
    }
});

// Add animation on section change
function animateSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.5s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Note: Removed conflicting intersection observer that was causing content to disappear
// Active sections are already controlled by CSS and the showSection() function
