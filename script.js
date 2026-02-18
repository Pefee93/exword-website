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
    initRandomGlitch();
    initLoader();
    initMobileMenu();
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
    const modalClose = document.getElementById('csModalClose');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    const characterCards = document.querySelectorAll('.character-card');

    // Project data for each case study
    const projectData = {
        diplomacy: {
            title: 'Diplomacy is Not an Option',
            genre: 'Door 407',
            image: 'assets/projects/diplomacy.jpg',
            challenge: 'We helped the game find its target audience on Reddit through a combination of targeted organic Reddit marketing and highly specialized Reddit ads. Through the combination of the two, Diplomacy is Not an Option was put in front of over 5 million players and established as one of the leading real-time strategy games.\n\nDue to the campaign’s success, the studio decided to continue working with ExWord as their long-term partners after the initial campaign for Diplomacy is Not an Option in 2024. Since then, we’ve helped them promote, alongside Diplomacy is Not an Option, their newest title, Abra Cooking Dabra, and other side projects.',
            platforms: ['Steam'],
            stats: ['12M+', '500k+', '1M+'],
            statLabels: ['Players Reached', 'Launch Day Wishlists', 'Total Copies Sold']
        },
        astral: {
            title: 'Astral Ascent',
            genre: 'Hibernian Workshop',
            image: 'assets/projects/astral-ascent-cover-DaaHsuMo.jpg',
            challenge: 'Through a highly specialized, targeted Reddit strategy, we put Astral Ascent in front of 4M+ players on Reddit, built widespread hype, and established the game as one of the most talked-about roguelites on social media.\n\nAfter the initial collaboration was finished and the initial goal was reached, Hibernian Workshop collaborated with ExWord on two other occasions - the first time for the promotion of a big update for Astral Ascent, and the second time for the help promoting the Kickstarter campaign of their latest project - Fallen Fates.',
            platforms: ['Steam', 'Console'],
            stats: ['5M+', '91%', '12+'],
            statLabels: ['Players Reached', 'Positive Engagement Rate', 'Months of Organic Buzz Sustained']
        },
        vail: {
            title: 'VAIL VR',
            genre: 'AEXLAB',
            image: 'assets/projects/vail-vr-CFhHfYeD.png',
            challenge: 'Helped establish VAIL VR as one of the leading VR shooters on social media, positioned it in front of key VR communities, and organized engaging community events that strengthened the game\'s presence and expanded its player base. Alongside that, we helped the developers establish long-lasting, high-value collaborations with key Esports and VR gaming communities that propelled the game’s popularity to new heights.',
            platforms: ['Steam', 'Meta', 'VR'],
            stats: ['10M+', '20+', '5,000+'],
            statLabels: ['Players Reached', 'Community Events Organized', 'Positive Social Media Engagements']
        },
        atre: {
            title: 'Atre: Dominance Wars',
            genre: 'Ironward',
            image: 'assets/projects/atre-dominance-wars-ClSNUBvy.avif',
            challenge: 'As an emerging and unique 4X strategy game blending the RTS and 4X genres, the real challenge for Atre was finding its true audience on Reddit. We published a few posts, tracked their performance, and identified the best-performing communities in which we built Atre’s reputation later on and established a long-term presence.',
            platforms: ['Steam'],
            stats: ['3M+', '92%', '400%+'],
            statLabels: ['Players Reached', 'Positive Player Sentiment', 'Increase in Social Media Mentions']
        },
        galactic: {
            title: 'Galactic Glitch',
            genre: 'Crunchy Leaf Games',
            image: 'assets/projects/galactic-glitch-COuJvM3i.jpg',
            challenge: 'Due to regular, big updates produced by the studio, we designed a strategy that focuses on two things at once: sustaining the presence of the game in all relevant communities during the low periods, and short-term hype bursts around the patch releases. This worked perfectly and elevated the game to one of the best-performing twin-stick shooters on Steam.',
            platforms: ['Steam'],
            stats: ['6M+', '30+', '2'],
            statLabels: ['Players Reached', 'High-value Influencer Collaborations', 'Record-breaking CCP Peaks']
        }
    };

    // Open modal when clicking a card
    characterCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const projectId = card.getAttribute('data-project') || card.dataset.project;
            const data = projectData[projectId];

            if (data) {
                // Populate modal with project data
                document.getElementById('csModalTitle').textContent = data.title;
                document.getElementById('csModalGenre').textContent = data.genre;

                // Update Image
                const imgContainer = document.getElementById('csModalImage');
                if (imgContainer) {
                    imgContainer.innerHTML = `<img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover; display:block;">`;
                }

                const challengeEl = document.getElementById('csModalChallenge');
                if (challengeEl) challengeEl.textContent = data.challenge;

                // Update Platforms (Badges)
                const platformsContainer = document.getElementById('csModalPlatforms');
                if (platformsContainer) {
                    platformsContainer.innerHTML = '';
                    if (data.platforms && data.platforms.length > 0) {
                        data.platforms.forEach(p => {
                            const badge = document.createElement('span');
                            badge.className = 'platform-badge';
                            badge.textContent = p;
                            platformsContainer.appendChild(badge);
                        });
                    }
                }

                // Update Stats
                const s1 = document.getElementById('csModalStat1');
                const l1 = document.getElementById('csModalStatLabel1');
                const s2 = document.getElementById('csModalStat2');
                const l2 = document.getElementById('csModalStatLabel2');
                const s3 = document.getElementById('csModalStat3');
                const l3 = document.getElementById('csModalStatLabel3');

                if (s1) s1.textContent = data.stats[0];
                if (l1) l1.textContent = data.statLabels[0];
                if (s2) s2.textContent = data.stats[1];
                if (l2) l2.textContent = data.statLabels[1];
                if (s3) s3.textContent = data.stats[2];
                if (l3) l3.textContent = data.statLabels[2];

                // Open modal only when data is valid
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
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
    if (document.body.classList.contains('services-page-new') || document.body.classList.contains('services-overview-page')) {
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

    const initialMessage = "You reached the end, traveller. Let’s stay in touch!";
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
    if (rpgForm) {
        rpgForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Robust selection in case IDs are missing in original HTML
            const nameInput = document.getElementById('contact-name') || rpgForm.querySelector('input[type="text"]');
            const emailInput = document.getElementById('contact-email') || rpgForm.querySelector('input[type="email"]');
            const messageInput = document.getElementById('contact-message') || rpgForm.querySelector('textarea');

            const name = nameInput ? nameInput.value : "Unknown";
            const email = emailInput ? emailInput.value : "Unknown";
            const message = messageInput ? messageInput.value : "No message provided.";

            typeMessage("Dispatching courier... [|||||||||||||||]", 15);

            setTimeout(() => {
                const subject = `ExWord Contact: ${name}`;
                const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
                const mailtoLink = `mailto:ognjen@exword.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                window.location.href = mailtoLink;

                typeMessage("Missive sent. Opening your preferred mail client...");
                rpgForm.reset();
                setTimeout(hideForm, 3000);
            }, 1500);

        });
    }
}

// ==========================================
// RPG Skill Tree Logic (Modal System)
// ==========================================
const skillData = {
    reddit: {
        title: "REDDIT AUTHENTIC ENGAGEMENT",
        icon: '<img src="assets/logos/reddit-143-svgrepo-com.svg" class="diablo-icon" alt="Reddit">',
        desc: "Authentic presence & hype building in key gaming subreddits through meticulously-crafted posts, genuine player engagement, and organic growth that translates into measurable awareness, discussion, and player acquisition.",
        tags: ["Community Engagement", "Hype-Building & Discovery-Focused Posting", "Sustained Organic Growth"]
    },
    community: {
        title: "COMMUNITY MANAGEMENT",
        icon: '<img src="assets/logos/discord-icon-svgrepo-com.svg" class="diablo-icon" alt="Discord">',
        desc: "Hands-on Discord and community management that turns your server into an online space where players feel heard, valued, and excited to participate.",
        tags: ["Server Setup & Structure", "Ongoing Engagement", "Events & Mod Support"]
    },
    youtube: {
        title: "YOUTUBE COMMENT PLACEMENT",
        icon: '<img src="assets/logos/youtube-168-svgrepo-com.svg" class="diablo-icon" alt="YouTube">',
        desc: "Strategic YouTube comment positioning designed to blend into conversations, organically grow interest around your game, and catch creator's attention.",
        tags: ["Creator Sourcing", "Campaign Concepts", "Performance Recaps"]
    },
    tiktok: {
        title: "TIKTOK CAMPAIGN",
        icon: '<img src="assets/logos/tiktok-svgrepo-com.svg" class="diablo-icon" alt="TikTok">',
        desc: "Lasting TikTok presence built through platform-native content, trend-aware execution, and engaging videos designed to capture attention and drive consistent discovery.",
        tags: ["Content & Hook Ideas", "Posting Strategy", "TikTok Creator Collabs"]
    },

    influencer: {
        title: "CREATOR PARTNERSHIPS",
        icon: '<img src="assets/logos/instagram-svgrepo-com.svg" class="diablo-icon" alt="Influencer">',
        desc: "High-value creator collaborations across all tiers, from micro to macro, with transparent ROI tracking and performance-oriented campaign development. Designed to put your game in the spotlight.",
        tags: ["Creator Mapping", "Outreach & Coordination", "Ambassador Program Concepts"]
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

        mIcon.innerHTML = data.icon;
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
            name: "Clever Plays",
            studio: "",
            logo: "assets/marquee logos/2024__CLEVER_PLAYS_-_FULL_COLOR_WHITE_IS_TRANSPARENT.png",
            text: "\"Working with ExWord on the Happy Bastards campaign has been fantastic. The ExWord team is highly knowledgeable about games, internet culture, and community building for new titles. They are professional, genuinely care about games, and value strong relationships. Partnering with them was a no-brainer for us.\"",
            gender: "male"
        },
        {
            name: "Filmic Studios",
            studio: "",
            logo: "assets/marquee logos/filmic-studios-sPf-updh.png",
            text: "\"I am incredibly impressed with the personal touch that ExWord has brought to our game. They take the time to really understand our vision and goals. What sets them apart is their deep understanding of the channels that gamers use. I highly recommend this game promotion company to developers looking to elevate their game.\"",
            gender: "female"
        },
        {
            name: "Hibernian Workshop",
            studio: "",
            logo: "assets/marquee logos/hibernian-workshop-DdrPp1ul.png",
            text: "\"ExWord took time to understand our game and our needs to help us grow our community. As a self-publishing studio, it was great getting support on this. They provided reports of their work and have been following us closely since we started working together. We will be happy working with them again in the future.\"",
            gender: "male"
        },
        {
            name: "AEXLAB",
            studio: "",
            logo: "assets/marquee logos/aexlab-D8upVgGr.png",
            text: "\"I recommend ExWord, as they really helped us reach out to community leaders and organize and set up events for grassroots marketing. This all really helped us as we were growing our game and looking for new players to add to our community. They are easy to work with, dedicated, and focused on delivering the best results.\"",
            gender: "female"
        }
    ];

    let currentIndex = 0;

    const dialogueCharacter = document.getElementById('dialogueCharacter');
    const dialogueName = document.getElementById('dialogueName');
    const dialogueStudio = document.getElementById('dialogueStudio');
    const dialogueText = document.getElementById('dialogueText');
    const dialogueLogo = document.getElementById('dialogueLogo'); // Added
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

        // Update Logo
        if (testimonial.logo && dialogueLogo) {
            dialogueLogo.src = testimonial.logo;
            dialogueLogo.style.display = 'block';
        } else if (dialogueLogo) {
            dialogueLogo.style.display = 'none';
        }

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

/**
 * Random Signal Loss Glitch Effect on Cards
 */
function initRandomGlitch() {
    const cards = document.querySelectorAll('.character-card');
    if (!cards.length) return;

    function triggerGlitch() {
        // Pick random card
        const randomIndex = Math.floor(Math.random() * cards.length);
        const card = cards[randomIndex];

        // Add glitch class
        card.classList.add('signal-lost');

        // Remove after random short duration (150ms - 400ms)
        const duration = 150 + Math.random() * 250;
        setTimeout(() => {
            card.classList.remove('signal-lost');
            scheduleNextGlitch();
        }, duration);
    }

    function scheduleNextGlitch() {
        // Random delay between glitches (2s - 6s)
        const delay = 2000 + Math.random() * 4000;
        setTimeout(triggerGlitch, delay);
    }

    // Start loop
    scheduleNextGlitch();
}

/**
 * Loading Screen Logic
 * Hides loader when window is fully loaded (images + video)
 */
function initLoader() {
    const loader = document.getElementById('loader-wrapper');
    if (!loader) return;

    window.addEventListener('load', () => {
        // Minimum load time of 1s to show logo
        setTimeout(() => {
            loader.classList.add('fade-out');

            // Remove from DOM after fade
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');

    if (!hamburger || !menu) return;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}
