/* ============================================
   Animations — Scroll Reveals & Counters
   ============================================ */

const Animations = (() => {
    let observer;

    function init() {
        setupScrollReveal();
        setupCounters();
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

        const statsContainer = document.querySelector('.hero-stats');
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

    // Dismiss loading screen
    function dismissLoader() {
        const loader = document.getElementById('loadingScreen');
        if (loader) {
            setTimeout(() => loader.classList.add('hide'), 600);
        }
    }

    return { init, dismissLoader };
})();
