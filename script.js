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
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            });
        }
    });
});

// Add parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-section');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Prevent dropdown menu from closing when clicking inside
document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

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

// Utility: Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections when they're loaded
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});
