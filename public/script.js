document.addEventListener('DOMContentLoaded', () => {
    
    // Check if device is touch capable
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    /* =========================================================================
       CUSTOM CURSOR & FLAME TRAIL
       ========================================================================= */
    const cursorDot = document.getElementById('cursorDot');
    const cursorGlow = document.getElementById('cursorGlow');
    
    if (!isTouchDevice && cursorDot && cursorGlow) {
        let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        const interactables = document.querySelectorAll('a, button, input, textarea, .widget-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '60px';
                cursorGlow.style.height = '60px';
                cursorGlow.style.borderColor = 'rgba(255, 46, 46, 0.8)';
                cursorGlow.style.boxShadow = '0 0 30px rgba(255, 46, 46, 0.6), inset 0 0 20px rgba(255, 46, 46, 0.3)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '40px';
                cursorGlow.style.height = '40px';
                cursorGlow.style.borderColor = 'rgba(255, 46, 46, 0.5)';
                cursorGlow.style.boxShadow = '0 0 20px rgba(193, 18, 31, 0.4), inset 0 0 10px rgba(255, 46, 46, 0.2)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });

        function animateCursor() {
            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    } else {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorGlow) cursorGlow.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    /* =========================================================================
       3D TILT EFFECT FOR CARDS
       ========================================================================= */
    if (!isTouchDevice) {
        const tiltElements = document.querySelectorAll('.tilt-element');
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', handleTilt);
            el.addEventListener('mouseleave', resetTilt);
        });

        function handleTilt(e) {
            const el = e.currentTarget;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Adjust divisor for tilt sensitivity (lower = more tilt)
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.transition = 'transform 0.1s ease-out';
        }

        function resetTilt(e) {
            const el = e.currentTarget;
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.transition = 'transform 0.5s ease-in-out';
        }
    }

    /* =========================================================================
       TERMINAL LOG GENERATOR (Widget)
       ========================================================================= */
    const terminalLog = document.getElementById('terminalLog');
    if (terminalLog) {
        const logMessages = [
            "Establishing secure connection...",
            "Encrypting payload data...",
            "Routing through Proxy-09...",
            "Ping response: 12ms",
            "Warning: Unauthorized access attempt blocked.",
            "Analyzing packet headers...",
            "SSL Handshake successful.",
            "Data stream synchronized."
        ];

        function addLog() {
            const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
            const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
            const p = document.createElement('p');
            p.className = 'log-line';
            p.innerHTML = `<span style="color:#A0A0A0">[${time}]</span> ${msg}`;
            
            terminalLog.appendChild(p);
            
            if (terminalLog.children.length > 5) {
                terminalLog.removeChild(terminalLog.firstChild);
            }
            
            setTimeout(addLog, Math.random() * 2000 + 1000);
        }
        
        // Start logging slightly after load
        setTimeout(addLog, 1500);
    }

    /* =========================================================================
       GLITCH TEXT REVEAL
       ========================================================================= */
    const glitchTitle = document.querySelector('.glitch-title');
    if (glitchTitle) {
        const originalText = glitchTitle.getAttribute('data-text');
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
        let iterations = 0;
        
        const interval = setInterval(() => {
            glitchTitle.innerText = originalText.split("").map((letter, index) => {
                if(index < iterations) {
                    return originalText[index];
                }
                return letters[Math.floor(Math.random() * 43)];
            }).join("");
            
            if(iterations >= originalText.length){
                clearInterval(interval);
            }
            iterations += 1 / 3;
        }, 30);
    }

    /* =========================================================================
       CANVAS PARTICLES BACKGROUND
       ========================================================================= */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                const colors = ['rgba(255, 0, 0, 0.6)', 'rgba(255, 69, 0, 0.6)', 'rgba(255, 140, 0, 0.3)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.size > 0.2) this.size -= 0.005;

                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.size <= 0.2) {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.size = Math.random() * 1.5 + 0.5;
                }
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = Math.min(Math.floor(window.innerWidth / 20), 80);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 69, 0, ${0.1 - distance/1200})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    /* =========================================================================
       SCROLL REVEAL ANIMATIONS
       ========================================================================= */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    setTimeout(() => {
        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    /* =========================================================================
       FORM VALIDATION & SUBMIT ANIMATION
       ========================================================================= */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !message) {
                showError('All fields are required.');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('Please enter a valid comm-link (email).');
                return;
            }
            
            formMessage.textContent = '';
            formMessage.className = 'form-message';
            submitBtn.classList.add('loading');
            
            // Add a small delay for dramatic effect
            setTimeout(() => {
                contactForm.submit();
            }, 1000);
        });

        function showError(msg) {
            formMessage.textContent = msg;
            formMessage.className = 'form-message error';
            
            submitBtn.style.transform = 'translateX(-10px)';
            setTimeout(() => submitBtn.style.transform = 'translateX(10px)', 100);
            setTimeout(() => submitBtn.style.transform = 'translateX(-10px)', 200);
            setTimeout(() => submitBtn.style.transform = 'translateX(10px)', 300);
            setTimeout(() => submitBtn.style.transform = 'translateX(0)', 400);
        }
    }
});
