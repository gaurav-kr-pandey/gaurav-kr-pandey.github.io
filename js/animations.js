/* ============================================
   Animations — Scroll Reveals & Counters
   ============================================ */

const Animations = (() => {
    let observer;

    function init() {
        setupScrollReveal();
        setupCounters();
        setupCursor();
        setupTilt();
    }

    function setupScrollReveal() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        };

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Don't unobserve — keeps it simple
                }
            });
        }, options);

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            observer.observe(el);
        });
    }

    function setupCounters() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('[data-count]');
                    counters.forEach(el => animateCounter(el));
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const statsContainer = document.querySelector('.stats-tile, .hero-stats');
        if (statsContainer) {
            counterObserver.observe(statsContainer);
        }
    }

    function animateCounter(el) {
        const target = el.getAttribute('data-count');
        const isDecimal = target.includes('.');
        const numericTarget = parseFloat(target);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            const current = numericTarget * eased;

            if (isDecimal) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(current) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    /* ── Magnetic Cursor ── */
    function setupCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on mobile

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth follow
        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            cursorX += dx * 0.2;
            cursorY += dy * 0.2;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);

        // Magnetic effect on elements
        document.querySelectorAll('.magnetic, a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                el.style.transform = '';
            });
            
            if (el.classList.contains('magnetic')) {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = (e.clientX - rect.left) - rect.width / 2;
                    const y = (e.clientY - rect.top) - rect.height / 2;
                    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                });
            }
        });
    }

    /* ── 3D Card Tilt ── */
    function setupTilt() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        // Apply tilt to bento tiles and cards
        const cards = document.querySelectorAll('.bento-tile, .experience-card, .article-card, .skill-category-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element.
                const y = e.clientY - rect.top;  // y position within the element.
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5; // max rotation 5deg
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'none';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s var(--ease-spring), box-shadow 0.5s var(--ease-out)';
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s var(--ease-out)';
            });
        });
    }

    // Dismiss loading screen
    function dismissLoader() {
        const loader = document.getElementById('loadingScreen');
        if (loader) {
            setTimeout(() => loader.classList.add('hide'), 600);
        }
    }

    return { init, dismissLoader };
})();
