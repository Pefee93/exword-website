/**
 * ExWord Marketing Website - Interactive JavaScript
 * Handles parallax effects, scroll animations, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initParallaxEffects();
    initScrollAnimations();
    initCounterAnimation();
    initVideoLoop();
    initCaseStudyModal();
    initRpgContact();
    initHeroScroll();
    initBannerExpansion();
    initScrollReveal();
    initHexReveal();
});

/**
 * Custom Slow Scroll for Hero CTA
 */
function initHeroScroll() {
    const heroBtn = document.querySelector('.hero-buttons .btn-primary');
    if (!heroBtn) return;

    heroBtn.addEventListener('click', (e) => {
        if (heroBtn.getAttribute('href') === '#contact') {
            e.preventDefault();
            const target = document.querySelector('#contact');
            if (!target) return;

            // finish any pending scroll
            const targetPosition = target.getBoundingClientRect().top + window.scrollY;
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            const duration = 2500; // 2.5 seconds
            let start = null;

            // Temporarily disable scroll snapping and native smooth scroll to prevent fighting
            const html = document.documentElement;
            const originalScrollSnap = getComputedStyle(html).scrollSnapType;
            const originalScrollBehavior = getComputedStyle(html).scrollBehavior;

            html.style.scrollSnapType = 'none';
            html.style.scrollBehavior = 'auto';

            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const percentage = Math.min(progress / duration, 1);

                // EaseInOutCubic for smooth start/end
                const eased = percentage < 0.5
                    ? 4 * percentage * percentage * percentage
                    : 1 - Math.pow(-2 * percentage + 2, 3) / 2;

                window.scrollTo(0, startPosition + distance * eased);

                if (progress < duration) {
                    window.requestAnimationFrame(step);
                } else {
                    window.scrollTo(0, targetPosition);
                    history.pushState(null, null, '#contact');
                    // Restore styles
                    html.style.scrollSnapType = originalScrollSnap;
                    html.style.scrollBehavior = originalScrollBehavior;
                }
            }
            window.requestAnimationFrame(step);
        }
    });
}

/**
 * Case Study Modal - Project card click to open overlay
 */
function initCaseStudyModal() {
    const modal = document.getElementById('caseStudyModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    const characterCards = document.querySelectorAll('.character-card');

    // Project data for each case study
    const projectData = {
        alpha: {
            title: 'Project Alpha',
            genre: 'RPG Adventure',
            icon: '🎮',
            challenge: 'Project Alpha was launching in a crowded RPG market with limited marketing budget. They needed to build an engaged community before launch to drive organic growth.',
            approach: 'We developed a Discord-first community strategy, partnered with mid-tier RPG streamers, and created a compelling behind-the-scenes content series showcasing the development journey.',
            stats: ['+320%', '75K+', '4.9★']
        },
        battle: {
            title: 'Battle Arena',
            genre: 'Action MOBA',
            icon: '⚔️',
            challenge: 'Breaking into the competitive MOBA space dominated by established titles. The studio needed to carve out a unique identity and build a dedicated player base.',
            approach: 'Focused on competitive esports partnerships and tournament organization. Created content highlighting unique mechanics and fostered a competitive community culture.',
            stats: ['+450%', '120K+', '4.7★']
        },
        space: {
            title: 'Space Voyage',
            genre: 'Sci-Fi Explorer',
            icon: '🚀',
            challenge: 'A niche space exploration game needed to find its audience among space enthusiasts and casual gamers interested in discovery-based gameplay.',
            approach: 'Partnered with space-themed content creators and science communicators. Created educational content that bridged gaming with real space exploration.',
            stats: ['+280%', '45K+', '4.8★']
        },
        kingdom: {
            title: 'Kingdom Rise',
            genre: 'Strategy Builder',
            icon: '🏰',
            challenge: 'The strategy game market demanded sophisticated marketing. Kingdom Rise needed to stand out with deep gameplay while remaining accessible.',
            approach: 'Built a community around player creativity, showcasing impressive player-created kingdoms. Organized building competitions and featured top creators.',
            stats: ['+190%', '60K+', '4.6★']
        },
        precision: {
            title: 'Precision',
            genre: 'FPS Tactical',
            icon: '🎯',
            challenge: 'Launching a tactical FPS in a market dominated by major AAA titles. Needed to highlight what made Precision different and better for certain players.',
            approach: 'Focused on hardcore FPS community engagement, pro player partnerships, and content showcasing the game\'s unique tactical depth.',
            stats: ['+380%', '95K+', '4.8★']
        }
    };

    // Open modal when clicking a card
    characterCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.project;
            const data = projectData[projectId];

            if (data) {
                // Populate modal with project data
                document.getElementById('modalTitle').textContent = data.title;
                document.getElementById('modalGenre').textContent = data.genre;
                document.getElementById('modalImage').textContent = data.icon;
                document.getElementById('modalChallenge').textContent = data.challenge;
                document.getElementById('modalApproach').textContent = data.approach;
                document.getElementById('modalStat1').textContent = data.stats[0];
                document.getElementById('modalStat2').textContent = data.stats[1];
                document.getElementById('modalStat3').textContent = data.stats[2];
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * Smooth video loop - restart slightly before end to avoid flicker
 */
function initVideoLoop() {
    const video = document.querySelector('.hero-video');
    if (!video) return;

    video.addEventListener('timeupdate', () => {
        // Restart 0.1 seconds before the video ends
        if (video.currentTime > video.duration - 0.1) {
            video.currentTime = 0;
            video.play();
        }
    });
}

/**
 * Navbar transparency on scroll
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    // Force paper mode for Services Page (disable scroll logic)
    if (document.body.classList.contains('services-page-new')) {
        navbar.classList.add('nav-paper-mode');
        return;
    }

    const hero = document.getElementById('hero');

    // Sections that should trigger white navbar text (Dark Backgrounds)
    const darkSections = [
        document.getElementById('projects'),
        document.getElementById('stats'),
        document.querySelector('.banner-section')
    ];

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const navbarHeight = navbar.offsetHeight;

        // Check if scrolled past hero (needs glass background)
        const heroHeight = hero ? hero.offsetHeight : 0;
        const pastHero = scrollY > (heroHeight - navbarHeight - 20);

        if (pastHero) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Check if navbar is over any dark section (for white text)
        let overDark = false;
        darkSections.forEach(section => {
            if (!section) return;
            const rect = section.getBoundingClientRect();
            // Navbar is at top (0 to navbarHeight)
            // Overlap if section top < navbarHeight AND section bottom > 0
            if (rect.top <= navbarHeight && rect.bottom >= 0) {
                overDark = true;
            }
        });

        if (overDark) {
            navbar.classList.add('dark-section');
        } else {
            navbar.classList.remove('dark-section');
        }

        // Check if navbar is over any PAPER section (for brown button)
        // Paper sections = Services, Philosophy (inside Services), Logo Scroll
        const paperSections = [
            document.getElementById('services'),
            document.querySelector('.logo-scroll')
        ];

        let overPaper = false;
        paperSections.forEach(section => {
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (rect.top <= navbarHeight && rect.bottom >= 0) {
                overPaper = true;
            }
        });

        if (overPaper) {
            navbar.classList.add('nav-paper-mode');
        } else {
            navbar.classList.remove('nav-paper-mode');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Audit on load
    handleScroll();
}

/**
 * Parallax effects for various elements
 */
function initParallaxEffects() {
    const heroContent = document.querySelector('.hero-content');
    const videoWrapper = document.querySelector('.hero-video-wrapper');

    let ticking = false;

    const handleParallax = () => {
        const scrollY = window.scrollY;

        // Hero content subtle parallax
        if (heroContent && scrollY < window.innerHeight) {
            const opacity = 1 - (scrollY / (window.innerHeight * 0.5));
            const translateY = scrollY * 0.3;

            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${translateY}px)`;
        }

        // Video slow parallax
        if (videoWrapper && scrollY < window.innerHeight) {
            const translateY = scrollY * 0.7;
            videoWrapper.style.transform = `translateY(${translateY}px)`;
        }

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleParallax);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.way-card, .stat-item, .section-header, .cta-content, .testimonial-card, .testimonial-card-small, .project-main'
    );

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add staggered animation delay for way cards
                if (entry.target.classList.contains('way-card')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }

                // Stagger for testimonial cards
                if (entry.target.classList.contains('testimonial-card-small')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    animatedElements.forEach((el) => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Animated counters for stats section
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observerOptions = {
        threshold: 0.5
    };

    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach((counter) => observer.observe(counter));
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * RPG Contact Section Logic
 */
function initRpgContact() {
    const rpgText = document.getElementById('rpg-text');
    const optionsGrid = document.getElementById('rpg-options');
    const options = document.querySelectorAll('.rpg-option');
    const rpgForm = document.getElementById('rpg-form');
    const backBtn = document.querySelector('.rpg-back');

    if (!rpgText) return;

    if (!rpgText) return;

    const initialMessage = "We are sad to see you go, let's stay in touch.";
    let isTyping = false;
    let typeTimeout;

    // Typewriter function
    function typeMessage(message, speed = 30) {
        // Clear existing typing
        clearTimeout(typeTimeout);
        isTyping = true;
        rpgText.textContent = '';
        let i = 0;

        function type() {
            if (i < message.length) {
                rpgText.textContent += message.charAt(i);
                i++;
                typeTimeout = setTimeout(type, speed);
            } else {
                isTyping = false;
            }
        }
        type();
    }

    // Initialize typewriter when visible
    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (rpgText.textContent === '') {
                    typeMessage(initialMessage);
                }
            } else {
                // Reset on leave (unless form is open)
                if (!rpgForm.classList.contains('active')) {
                    clearTimeout(typeTimeout); // Stop typing "S..."
                    rpgText.textContent = '';
                }
            }
        });
    }, { threshold: 0.3 });

    // Observer for Navbar Style
    // Observer for Navbar Style
    const visibleRpgSections = new Set();
    const navObserver = new IntersectionObserver((entries) => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visibleRpgSections.add(entry.target);
            } else {
                visibleRpgSections.delete(entry.target);
            }
        });

        if (visibleRpgSections.size > 0) {
            navbar.classList.add('nav-rpg-mode');
        } else {
            navbar.classList.remove('nav-rpg-mode');
        }
    }, {
        threshold: 0,
        rootMargin: "-2% 0px -85% 0px"
    });

    const contactSection = document.getElementById('contact');
    const testimonialsSection = document.getElementById('testimonials');
    const marqueeSection = document.querySelector('.glitch-marquee-wrapper');

    if (contactSection) {
        typeObserver.observe(contactSection);
        navObserver.observe(contactSection);
    }
    if (testimonialsSection) {
        navObserver.observe(testimonialsSection);
    }
    if (marqueeSection) {
        navObserver.observe(marqueeSection);
    }

    // Show Form
    function showForm() {
        optionsGrid.style.display = 'none';
        rpgForm.classList.add('active');
        typeMessage("Reveal your identity and state your business...", 25);
    }

    // Hide Form
    function hideForm() {
        rpgForm.classList.remove('active');
        optionsGrid.style.display = 'grid';
        typeMessage("Is there any other assistance you require?", 30);
    }

    // Button Actions
    options.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;

            if (action === 'talk') {
                showForm();
            } else if (action === 'email') {
                showForm();
            } else if (action === 'publisher') {
                typeMessage("Awesome! If you need help marketing your games, we are the right fit for you! Email us at hello@exword.co", 25);
            } else if (action === 'run') {
                typeMessage("See ya!", 40);
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 800);
            }
        });
    });

    // Back Button
    if (backBtn) {
        backBtn.addEventListener('click', hideForm);
    }

    // Form Submit
    if (rpgForm) {
        rpgForm.addEventListener('submit', (e) => {
            e.preventDefault();
            typeMessage("Dispatching courier... [|||||||||||||||]", 15);

            // Simulate API call
            setTimeout(() => {
                typeMessage("Missive sent. The Guild will send a response shortly.");
                rpgForm.reset();
                setTimeout(hideForm, 3000);
            }, 2000);
        });
    }
}

// ==========================================
// RPG Skill Tree Logic (Modal System)
// ==========================================
const skillData = {
    reddit: {
        title: "Reddit Operations",
        icon: "💬",
        desc: "Authentic engagement within gaming communities through strategically placed posts, organic discussions, and targeted Reddit advertising campaigns.",
        tags: ["Community Engagement", "Viral Content Creation", "Reddit Ads"]
    },
    community: {
        title: "Community Management",
        icon: "👥",
        desc: "Comprehensive community management across Discord, Reddit, and social platforms - including events, collaborations, and ongoing engagement.",
        tags: ["Discord Management", "Events & Collaborations", "Social Media Engagement"]
    },
    youtube: {
        title: "YouTube Strategy",
        icon: "▶️",
        desc: "Strategic YouTube comment placement to drive community discussions that feel natural and drive genuine interest in your game.",
        tags: ["YouTube Strategy", "Community Engagement", "Natural Conversations"]
    },
    tiktok: {
        title: "TikTok Viral",
        icon: "📱",
        desc: "Viral short-form content that captures the essence of your game and reaches millions of potential players on TikTok.",
        tags: ["Gameplay Videos", "Viral Content Creation", "Short-Form Content"]
    },
    content: {
        title: "Content Production",
        icon: "🎬",
        desc: "Engaging gameplay videos, cinematic trailers, and short-form content optimized for maximum engagement across all platforms.",
        tags: ["Gameplay Videos", "Immersive Trailers", "Short-form Content"]
    },
    influencer: {
        title: "Influencer Network",
        icon: "📢",
        desc: "High-value influencer collaborations across all tiers, from micro to macro, with transparent ROI tracking and performance-oriented campaign development.",
        tags: ["Tiered Strategy", "Creative Campaigns", "Performance Tracking"]
    }
};

function initSkillTree() {
    const nodes = document.querySelectorAll('.skill-node');
    const modal = document.getElementById('skillModal');
    const closeBtn = document.getElementById('closeSkillModal');

    // Modal Elements
    const mIcon = document.getElementById('modalIcon');
    const mTitle = document.getElementById('modalTitle');
    const mDesc = document.getElementById('modalDesc');
    const mTags = document.getElementById('modalTags');

    if (!modal) return;

    // --- Modal Logic ---
    function openModal(id) {
        const data = skillData[id];
        if (!data) return;

        mIcon.textContent = data.icon;
        mTitle.textContent = data.title;
        mDesc.textContent = data.desc;

        // Clear and add tags
        mTags.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag;
            mTags.appendChild(span);
        });

        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    // Update Selector for new "Inventory" design
    const inventorySlots = document.querySelectorAll('.inventory-slot:not(.empty)');
    inventorySlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const id = slot.dataset.id;
            openModal(id);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Initialize Skill Tree on Load
document.addEventListener('DOMContentLoaded', initSkillTree);

/**
 * Profile Banner Expansion Animation
 * Dept Agency style trigger on scroll
 */
function initBannerExpansion() {
    const banner = document.querySelector('.banner-expansion-wrapper');
    if (!banner) return;

    // Use IntersectionObserver for robust scroll triggering
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                banner.classList.add('expanded');
            } else {
                // Remove to allow re-animation when scrolling back up
                banner.classList.remove('expanded');
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% is visible
        rootMargin: "0px"
    });

    observer.observe(banner);
}

/**
 * Premium Scroll Reveal
 * Handles .reveal-on-scroll elements
 */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before bottom
    });

    elements.forEach(el => observer.observe(el));
}

/**
 * Hexagon Scroll Reveal
 * Animates hex slots into view with staggered entrance + pulse
 */
function initHexReveal() {
    const hexSlots = document.querySelectorAll('.inventory-slot.hex-slot');
    if (!hexSlots.length) return;

    const hexObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('hex-visible');
                hexObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: "0px 0px -30px 0px"
    });

    hexSlots.forEach(slot => hexObserver.observe(slot));
}

/**
 * RPG Dialogue Testimonials
 * Handles navigation between testimonial slides
 */
function initRpgDialogue() {
    const testimonials = [
        {
            name: "Alex Rivera",
            studio: "Relume Studios",
            text: "\"Working with ExWord felt like having an extension of our own team. They understood our game's vision and connected us with players who truly care.\"",
            gender: "male"
        },
        {
            name: "Sarah Chen",
            studio: "PixelDreams Interactive",
            text: "\"Our Discord grew by 15,000 members in just 3 months. The community engagement strategies they implemented were unlike anything we'd seen before.\"",
            gender: "female"
        },
        {
            name: "Marcus Webb",
            studio: "Indie Forge Games",
            text: "\"They just get it. The best agency partner we've worked with. They speak the language of gamers because they ARE gamers.\"",
            gender: "male"
        },
        {
            name: "Elena Vance",
            studio: "Neon Knight Studios",
            text: "\"From zero to a thriving community in record time. ExWord's approach to organic marketing transformed our game's launch trajectory completely.\"",
            gender: "female"
        }
    ];

    let currentIndex = 0;

    const dialogueCharacter = document.getElementById('dialogueCharacter');
    const dialogueName = document.getElementById('dialogueName');
    const dialogueStudio = document.getElementById('dialogueStudio');
    const dialogueText = document.getElementById('dialogueText');
    const prevBtn = document.querySelector('.dialogue-prev');
    const nextBtn = document.querySelector('.dialogue-next');
    const indicators = document.querySelectorAll('.dialogue-indicators .indicator');

    if (!dialogueCharacter || !dialogueName || !dialogueStudio || !dialogueText) return;

    // Removed typewriter effect per user request
    // function typewriterEffect(element, text, speed = 15) { ... }

    function updateTestimonial(index, animate = true) {
        const testimonial = testimonials[index];

        // Update character image based on gender
        const imagePath = testimonial.gender === 'male'
            ? 'assets/Vector Male.svg'
            : 'assets/Vector  Female.svg';
        dialogueCharacter.src = imagePath;

        // Update name and studio immediately
        dialogueName.textContent = testimonial.name;
        dialogueStudio.textContent = testimonial.studio;

        // Instant text update
        dialogueText.textContent = testimonial.text;

        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateTestimonial(currentIndex, true);
    }

    function goToPrev() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        updateTestimonial(currentIndex, true);
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', goToNext);
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateTestimonial(currentIndex, true);
        });
    });

    // Initialize first testimonial (no animation)
    updateTestimonial(0, false);
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initRpgDialogue();
    initStickyScrollSpy();
});

/**
 * Sticky Scroll Spy for Services Page
 * Updates sidebar active state based on scroll position
 */
function initStickyScrollSpy() {
    const serviceBlocks = document.querySelectorAll('.service-detail-block');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    if (serviceBlocks.length === 0 || sidebarLinks.length === 0) return;

    // Use IntersectionObserver to detect active block
    const observerOptions = {
        root: null,
        // Trigger when block is in the upper middle of viewport
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                sidebarLinks.forEach(link => link.classList.remove('active'));

                // Add active to current
                const id = entry.target.id;
                // Find link with matching href hash or data-target
                let activeLink = null;
                sidebarLinks.forEach(link => {
                    if (link.dataset.target === id || link.getAttribute('href') === `#${id}`) {
                        activeLink = link;
                    }
                });

                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, observerOptions);

    serviceBlocks.forEach(block => observer.observe(block));
}
