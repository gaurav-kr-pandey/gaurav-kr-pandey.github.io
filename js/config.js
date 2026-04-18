/* ============================================
   Config — Data Loader
   Fetches all JSON data files and provides
   fallback data for file:// protocol.
   ============================================ */

const DataLoader = (() => {
    const BASE_PATH = 'data/';

    const files = [
        'personal',
        'experience',
        'skills',
        'education',
        'articles',
        'certifications',
        'social',
        'meta'
    ];

    async function loadJSON(filename) {
        try {
            const response = await fetch(`${BASE_PATH}${filename}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn(`[DataLoader] Failed to load ${filename}.json:`, err.message);
            return null;
        }
    }

    async function loadAll() {
        const results = await Promise.all(files.map(f => loadJSON(f)));
        const data = {};
        files.forEach((name, i) => {
            data[name] = results[i];
        });
        return data;
    }

    return { loadAll };
})();
