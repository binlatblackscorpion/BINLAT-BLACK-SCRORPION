document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       1. PRELOADER & INITIALIZATION
       ====================================================================== */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                initRevealAnimations();
            }, 500);
        }, 800);
    });

    /* ======================================================================
       2. TYPEWRITER EFFECT
       ====================================================================== */
    const typeElement = document.querySelector('.type-effect');
    if (typeElement) {
        const text = typeElement.getAttribute('data-text');
        typeElement.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                typeElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            } else {
                typeElement.innerHTML = `${text}<span style="animation: blink 1s infinite;">_</span>`;
            }
        }
        setTimeout(typeWriter, 1500);
    }

    const style = document.createElement('style');
    style.innerHTML = `@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;
    document.head.appendChild(style);

    /* ======================================================================
       3. CUSTOM CURSOR (DESKTOP ONLY)
       ====================================================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (window.matchMedia("(pointer: fine)").matches) {
        cursorDot.style.display = 'block';
        cursorRing.style.display = 'block';

        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;

            cursorRing.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 150, fill: "forwards" });
        });

        const interactables = document.querySelectorAll('a, button, .tab-btn, .price-box');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorRing.style.backgroundColor = 'rgba(245, 166, 35, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorRing.style.backgroundColor = 'transparent';
            });
        });
    }

    /* ======================================================================
       4. NAVBAR & MOBILE MENU
       ====================================================================== */
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navList = document.getElementById('nav-list');
    const navLinks = document.querySelectorAll('.nav-item, .btn-daftar-nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    function toggleMobileMenu() {
        navList.classList.toggle('active');
        const bars = menuBtn.querySelectorAll('.bar');
        if (navList.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    }

    menuBtn.addEventListener('click', toggleMobileMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) toggleMobileMenu();
        });
    });

    // Scroll Spy
    const sections = document.querySelectorAll('section, header');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-item').forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href') === `#${current}`) li.classList.add('active');
        });
    });

    /* ======================================================================
       5. TABS SYSTEM
       ====================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabBodies = document.querySelectorAll('.tab-body');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabBodies.forEach(content => content.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    /* ======================================================================
       6. REVEAL ANIMATIONS ON SCROLL
       ====================================================================== */
    function initRevealAnimations() {
        const revealItems = document.querySelectorAll('.reveal-item');
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        revealItems.forEach(item => observer.observe(item));
    }

    /* ======================================================================
       7. VISITOR COUNTER LOGIC
       ====================================================================== */
    const visitorCountEl = document.getElementById('visitor-count');

    if (visitorCountEl) {
        // Base logic for realistic starting point and incrementing
        let currentCount = localStorage.getItem('blackscorpion_visitor_count');

        // If it doesn't exist, start from a realistic base number (or 0 as requested, but starting at 0 looks empty, we will simulate starting from 0 and counting up fast to the real number, OR literally just increment from 0).
        // Since user said "mulai dari 0 ya", we will literally set it to 0 initially if first time.
        if (!currentCount) {
            currentCount = 0;
            localStorage.setItem('blackscorpion_visitor_count', currentCount);
        }

        // Increment by 1 for this visit session
        // Check if already visited this session to prevent spam reload counting
        if (!sessionStorage.getItem('visited')) {
            currentCount = parseInt(currentCount) + 1;
            localStorage.setItem('blackscorpion_visitor_count', currentCount);
            sessionStorage.setItem('visited', 'true');
        }

        // Function to animate the counter from 0 to the currentCount
        function animateValue(obj, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // add ease-out effect
                const easeOutQuad = 1 - (1 - progress) * (1 - progress);
                obj.innerHTML = Math.floor(easeOutQuad * (end - start) + start).toLocaleString('id-ID');
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        // Delay the counter animation slightly until page is ready
        setTimeout(() => {
            animateValue(visitorCountEl, 0, parseInt(currentCount), 2000);
        }, 1500);
    }

    /* ======================================================================
       8. FLOATING BUTTONS & WA ACTION
       ====================================================================== */
    const floatTopBtn = document.getElementById('float-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) floatTopBtn.classList.add('show');
        else floatTopBtn.classList.remove('show');
    });

    floatTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const noWaAdmin = "6282319047065";

    document.querySelectorAll('.order-wa').forEach(btn => {
        btn.addEventListener('click', () => {
            const paketName = btn.getAttribute('data-item');
            const text = `Izin Admin Black Scorpion Binlat, saya berminat dengan ${paketName}. Mohon arahan untuk proses pendaftaran.`;
            window.open(`https://wa.me/${noWaAdmin}?text=${encodeURIComponent(text)}`, '_blank');
        });
    });

    document.getElementById('float-wa').addEventListener('click', () => {
        const text = "Halo Admin Black Scorpion, saya ingin berkonsultasi mengenai program persiapan seleksi Abdi Negara.";
        window.open(`https://wa.me/${noWaAdmin}?text=${encodeURIComponent(text)}`, '_blank');
    });

});
