/* ============================================
   Theme — Dark/Light Mode
   ============================================ */

const ThemeManager = (() => {
    const STORAGE_KEY = 'portfolio-theme';

    function init() {
        const saved = localStorage.getItem(STORAGE_KEY);
        const theme = saved || 'dark';

        apply(theme);
        bindToggle();

        // Listen for OS preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(STORAGE_KEY)) {
                apply(e.matches ? 'dark' : 'light');
            }
        });
    }

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }

    function toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        apply(next);
    }

    function bindToggle() {
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', toggle);
        });
    }

    return { init };
})();
