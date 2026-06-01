// Navigation State Management
let currentView = 'home'; // 'home', 'academic', 'datascience'
let currentSection = '';
const NAV_STATE_KEY = 'ps_portfolio_nav_state';

const VIEW_SECTIONS = {
    academic: new Set(['academic-home', 'education', 'research', 'publications', 'teaching', 'academic-about', 'academic-blog', 'contact']),
    datascience: new Set(['ds-home', 'projects', 'skills', 'tools', 'certifications', 'ds-about', 'ds-blog', 'contact', 'ds-contact', 'euchresisdata'])
};

function getDefaultSectionForView(view) {
    if (view === 'academic') {
        return 'academic-home';
    }
    if (view === 'datascience') {
        return 'ds-home';
    }
    return '';
}

function canSectionBelongToView(sectionId, view) {
    if (!sectionId) {
        return false;
    }
    if (sectionId === 'contact') {
        return true;
    }
    return VIEW_SECTIONS[view]?.has(sectionId) ?? false;
}

function saveNavigationState() {
    try {
        const state = {
            view: currentView,
            section: currentSection
        };
        localStorage.setItem(NAV_STATE_KEY, JSON.stringify(state));
    } catch {
        // Ignore storage errors (e.g., disabled storage).
    }
}

function getSavedNavigationState() {
    try {
        const rawState = localStorage.getItem(NAV_STATE_KEY);
        if (!rawState) {
            return null;
        }

        const state = JSON.parse(rawState);
        const isValidView = state?.view === 'home' || state?.view === 'academic' || state?.view === 'datascience';
        if (!isValidView) {
            return null;
        }

        const section = typeof state?.section === 'string' ? state.section : '';
        return {
            view: state.view,
            section
        };
    } catch {
        return null;
    }
}

// Navigate between main views
function navigateTo(view, targetSection = '', options = {}) {
    const { persistState = true, smoothScroll = true } = options;
    const homepage = document.getElementById('homepage');
    const academicPortfolio = document.getElementById('academic-portfolio');
    const datasciencePortfolio = document.getElementById('datascience-portfolio');
    const sectionToShow = canSectionBelongToView(targetSection, view)
        ? targetSection
        : getDefaultSectionForView(view);
    
    // Remove active class from all
    homepage.classList.remove('active');
    academicPortfolio.classList.remove('active');
    datasciencePortfolio.classList.remove('active');
    
    // Add fade out effect
    if (view === 'home') {
        currentView = 'home';
        currentSection = '';
        setTimeout(() => {
            homepage.classList.add('active');
        }, 100);
    } else if (view === 'academic') {
        currentView = 'academic';
        setTimeout(() => {
            academicPortfolio.classList.add('active');
            showSection(sectionToShow, undefined, { persistState: false, smoothScroll });
        }, 100);
    } else if (view === 'datascience') {
        currentView = 'datascience';
        setTimeout(() => {
            datasciencePortfolio.classList.add('active');
            showSection(sectionToShow, undefined, { persistState: false, smoothScroll });
        }, 100);
    }

    if (persistState) {
        saveNavigationState();
    }
    
    // Scroll to top with fallback for older browsers
    if (smoothScroll) {
        smoothScrollToTop();
    }
}

// Show specific section within a portfolio
function showSection(sectionId, e, options = {}) {
    const { persistState = true, smoothScroll = true } = options;
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
        const sectionView = sectionId.startsWith('ds-') || VIEW_SECTIONS.datascience.has(sectionId)
            ? 'datascience'
            : 'academic';
        if (sectionId !== 'contact') {
            currentView = sectionView;
        }
        
        // Scroll to content area
        const navbar = document.querySelector('.portfolio-section.active .navbar');
        if (smoothScroll) {
            const navbarOffset = navbar ? navbar.offsetHeight : 0;
            const scrollAnchor = sectionId === 'contact'
                ? targetSection.querySelector('h2') || targetSection
                : targetSection;
            const targetTop = Math.max(
                scrollAnchor.getBoundingClientRect().top + window.pageYOffset - navbarOffset - 12,
                0
            );
            smoothScrollTo(targetTop);
        }

        if (persistState) {
            saveNavigationState();
        }
    }
    
    // Prevent default link behavior
    e?.preventDefault();
}

function smoothScrollToTop() {
    smoothScrollTo(0);
}

function smoothScrollTo(top) {
    try {
        window.scrollTo({ top, behavior: 'smooth' });
    } catch {
        window.scrollTo(0, top);
    }
}

// Add smooth scrolling
document.addEventListener('DOMContentLoaded', () => {
    const savedState = getSavedNavigationState();
    const initialView = savedState?.view ?? 'home';
    const initialSection = savedState?.section ?? '';

    // Make the DS announcement ticker use a measured distance instead of a browser-dependent percentage.
    const dsAnnouncementTrack = document.querySelector('.ds-announcement-track');
    const dsPortfolio = document.getElementById('datascience-portfolio');

    function scheduleDsAnnouncementDistanceUpdate() {
        // Two RAFs ensure layout is settled after visibility/class changes.
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(updateDsAnnouncementDistance);
        });
    }

    function updateDsAnnouncementDistance() {
        if (!dsAnnouncementTrack) {
            return;
        }

        const firstMessage = dsAnnouncementTrack.querySelector('span');
        if (!firstMessage) {
            return;
        }

        const computedStyles = window.getComputedStyle(dsAnnouncementTrack);
        const gapValue = parseFloat(computedStyles.gap || computedStyles.columnGap || '0') || 0;
        const messageWidth = firstMessage.getBoundingClientRect().width || 0;
        if (messageWidth <= 0) {
            return;
        }
        dsAnnouncementTrack.style.setProperty('--ds-marquee-distance', `${Math.ceil(messageWidth + gapValue)}px`);
    }

    scheduleDsAnnouncementDistanceUpdate();
    window.addEventListener('resize', () => {
        scheduleDsAnnouncementDistanceUpdate();
    }, { passive: true });

    if (dsPortfolio) {
        const dsVisibilityObserver = new MutationObserver(() => {
            if (dsPortfolio.classList.contains('active')) {
                scheduleDsAnnouncementDistanceUpdate();
            }
        });

        dsVisibilityObserver.observe(dsPortfolio, { attributes: true, attributeFilter: ['class'] });
    }

    if (document.fonts && typeof document.fonts.ready?.then === 'function') {
        document.fonts.ready.then(() => {
            scheduleDsAnnouncementDistanceUpdate();
        });
    }

    // Restore last visited page on refresh
    navigateTo(initialView, initialSection, { persistState: false, smoothScroll: false });

    // Load markdown content for sections
    loadMarkdownSections().then(() => {
        enhanceGalleries();
        enhanceTeachingContent();
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
            e.stopPropagation();
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
            if (link.classList.contains('dropdown-toggle')) {
                return;
            }
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
            if (/\/blog\.md$/i.test(src)) {
                // Blog files intentionally contain HTML layout blocks.
                // Inject directly to avoid parser-specific HTML block quirks.
                block.innerHTML = markdown;
                continue;
            }

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
    if (!('IntersectionObserver' in window)) {
        revealItems.forEach(item => item.classList.add('is-visible'));
        return;
    }

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

function enhanceTeachingContent() {
    const teachingContent = document.querySelector('#teaching .md-content');
    if (!teachingContent) {
        return;
    }

    const images = Array.from(teachingContent.querySelectorAll('img'));

    images.forEach(img => {
        if (img.parentElement?.classList.contains('teaching-media')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'teaching-media';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
    });
}

// Add parallax effect on scroll (optimized to avoid jank on initial scroll)
let academicHeroSection = null;
let cachedAcademicHeroImage = null;
let isScrollTicking = false;
const isEdgeBrowser = /\bEdg\//.test(navigator.userAgent);

function shouldEnableHeroParallax() {
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
    return !isEdgeBrowser && !isMobileViewport;
}

function applyScrollEffects() {
    isScrollTicking = false;

    // Keep scroll effects lightweight and only while viewing academic sections.
    if (currentView !== 'academic') {
        return;
    }

    const scrolled = window.pageYOffset || window.scrollY || 0;
    const parallaxOffset = Math.round(scrolled * 0.14);

    if (!academicHeroSection) {
        academicHeroSection = document.querySelector('#academic-home .hero-section');
    }

    if (academicHeroSection) {
        if (!shouldEnableHeroParallax()) {
            academicHeroSection.style.transform = '';
        } else {
            academicHeroSection.style.transform = `translateY(${parallaxOffset}px)`;
        }
    }

    // Fade out academic hero image on scroll.
    if (!cachedAcademicHeroImage) {
        cachedAcademicHeroImage = document.querySelector('#academic-home .hero-section .md-content img');
    }

    if (cachedAcademicHeroImage) {
        const fadeStart = 0;
        const fadeEnd = 300;
        const progress = Math.min(Math.max((scrolled - fadeStart) / (fadeEnd - fadeStart), 0), 1);
        cachedAcademicHeroImage.style.opacity = `${1 - progress}`;
    }
}

window.addEventListener('scroll', () => {
    if (isScrollTicking) {
        return;
    }
    isScrollTicking = true;
    window.requestAnimationFrame(applyScrollEffects);
}, { passive: true });

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
