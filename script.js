document.addEventListener('DOMContentLoaded', () => {

    /* ======================================================================
       1. SISTEM PRELOADER
       ====================================================================== */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                initRevealAnimations();
            }, 800);
        }, 1000);
    });

    /* ======================================================================
       2. BACKGROUND PARTIKEL CANVAS (CYBER NODE)
       ====================================================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Sesuaikan ukuran canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = { x: null, y: null, radius: 150 };

    // Dengarkan gerakan mouse hanya di Desktop
    if(window.innerWidth > 768) {
        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = undefined;
            mouse.y = undefined;
        });
    }

    // Class Partikel
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = this.x;
            this.baseY = this.y;
        }

        // Gambar titik
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Hitung posisi dan pantulan mouse
        update() {
            // Pantulan dinding
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

            // Interaksi menghindar dari mouse
            if (mouse.x !== undefined && mouse.y !== undefined) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const maxDistance = mouse.radius;
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = forceDirectionX * force * 5;
                    const directionY = forceDirectionY * force * 5;

                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 20;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 20;
                    }
                }
            }

            // Gerak normal
            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    // Inisialisasi kumpulan partikel
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 15000;
        // Batasi untuk performa HP
        if(window.innerWidth < 768) numberOfParticles = (canvas.height * canvas.width) / 25000;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;
            let color = 'rgba(245, 166, 35, 0.4)'; // Warna emas transparan

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Animasi Garis Penghubung
    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    // Buat garis antar titik terdekat
    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(245, 166, 35, ${opacityValue * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        initParticles();
    });

    initParticles();
    animateParticles();


    /* ======================================================================
       3. KURSOR KUSTOM (Hanya Aktif di Desktop)
       ====================================================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (window.matchMedia("(pointer: fine)").matches) {
        cursorDot.style.display = 'block';
        cursorRing.style.display = 'block';

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorRing.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 250, fill: "forwards" });
        });

        // Efek hover pada tombol dan link
        const interactables = document.querySelectorAll('a, button, .tab-btn, .gallery-item');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.style.width = '60px';
                cursorRing.style.height = '60px';
                cursorRing.style.backgroundColor = 'rgba(245, 166, 35, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.style.width = '36px';
                cursorRing.style.height = '36px';
                cursorRing.style.backgroundColor = 'transparent';
            });
        });
    }

    /* ======================================================================
       4. EFEK MESIN KETIK (TYPING EFFECT)
       ====================================================================== */
    const typeElement = document.querySelector('.type-effect');
    if(typeElement) {
        const text = typeElement.textContent;
        typeElement.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                typeElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Mulai ketik setelah preloader hilang
        setTimeout(typeWriter, 1500);
    }

    /* ======================================================================
       5. NAVIGASI MOBILE & STICKY NAVBAR
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
            bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
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

    // Scroll Spy Logika
    const sections = document.querySelectorAll('section, header');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-item').forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href') === `#${current}`) li.classList.add('active');
        });
    });

    /* ======================================================================
       6. SISTEM TABS MATERI
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
       7. ANIMASI REVEAL ON SCROLL
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
        }, { threshold: 0.1 });

        revealItems.forEach(item => observer.observe(item));
    }

    /* ======================================================================
       8. LOGIKA TOMBOL FLOATING WA & BACK TO TOP
       ====================================================================== */
    const floatTopBtn = document.getElementById('float-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) floatTopBtn.classList.add('show');
        else floatTopBtn.classList.remove('show');
    });

    floatTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // WhatsApp Action Dinamis
    const noWaAdmin = "6282319047065";
    
    // Tombol harga
    document.querySelectorAll('.order-wa').forEach(btn => {
        btn.addEventListener('click', () => {
            const paketName = btn.getAttribute('data-item');
            const text = `Izin Admin Black Scorpion Binlat, saya sangat berminat dengan ${paketName}. Mohon arahan untuk proses pendaftaran.`;
            window.open(`https://wa.me/${noWaAdmin}?text=${encodeURIComponent(text)}`, '_blank');
        });
    });

    // Tombol Floating Utama
    document.getElementById('float-wa').addEventListener('click', () => {
        const text = "Halo Admin Black Scorpion, saya ingin berkonsultasi mengenai program persiapan seleksi Abdi Negara.";
        window.open(`https://wa.me/${noWaAdmin}?text=${encodeURIComponent(text)}`, '_blank');
    });

});