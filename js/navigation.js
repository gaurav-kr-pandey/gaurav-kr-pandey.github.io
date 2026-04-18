/* ============================================
   Navigation — Navbar, Mobile Menu, Scrolling
   ============================================ */

const Navigation = (() => {
    let navbar, mobileToggle, mobileMenu, fab, progressBar;
    let ticking = false;

    function init() {
        navbar = document.getElementById('navbar');
        mobileToggle = document.getElementById('mobileToggle');
        mobileMenu = document.getElementById('mobileMenu');
        fab = document.getElementById('fab');
        progressBar = document.getElementById('progressBar');

        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', toggleMobile);
        }

        // Smooth scrolling for all nav links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Initial state
    }

    function toggleMobile() {
        mobileMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    }

    function handleNavClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;

        const offset = 100;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }

    function updateScroll() {
        const scrollY = window.pageYOffset;

        // Navbar shrink
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }

        // Progress bar
        if (progressBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            progressBar.style.width = `${pct}%`;
        }

        // FAB
        if (fab) {
            fab.classList.toggle('visible', scrollY > 400);
        }

        // Active nav link
        updateActiveLink(scrollY);

        ticking = false;
    }

    function updateActiveLink(scrollY) {
        const sections = document.querySelectorAll('section[id]');
        let currentId = '';

        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (scrollY >= top) {
                currentId = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${currentId}`);
        });
    }

    return { init };
})();
