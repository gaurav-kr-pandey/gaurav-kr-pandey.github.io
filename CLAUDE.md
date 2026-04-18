# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🏗️ Architecture Overview

The repository implements Gaurav Pandey's personal portfolio website using a modular, JSON-data-driven, static site architecture.

**Key Design Principles:**
* **Data-driven:** All content is stored in JSON files under `data/`. Change text, add experience, or update skills without touching HTML or JS.
* **Modular CSS:** Styles are split into 6 files under `css/` — variables (design tokens), base, components, sections, animations, and responsive.
* **Modular JS:** Logic is split into 5 files under `js/` — config (data loader), renderer (DOM builder), animations, navigation, and theme.
* **No build step:** Pure vanilla HTML/CSS/JS. No npm, no bundler. Loads directly in any browser.
* **Versioned:** Previous versions preserved in `versions/` directory (`index_v1.html` through `index_v5.html`).

**Project Structure:**
```
├── index.html              # Current version (v6)
├── index_v1–v5.html        # Preserved previous versions
├── profile_pic.jpeg         # Profile picture (root — legacy compat)
├── css/
│   ├── variables.css       # Design tokens & CSS custom properties
│   ├── base.css            # Reset, typography, globals
│   ├── components.css      # Buttons, cards, badges, tags, etc.
│   ├── sections.css        # Section-specific layouts
│   ├── animations.css      # Keyframes & scroll-reveal classes
│   └── responsive.css      # Media queries (480, 768, 1024, 1440)
├── js/
│   ├── config.js           # DataLoader — fetches JSON files
│   ├── renderer.js         # Renderer — builds DOM from data
│   ├── animations.js       # Scroll observers & counters
│   ├── navigation.js       # Navbar, scroll, mobile menu
│   └── theme.js            # Dark/light mode toggle
├── data/
│   ├── personal.json       # Name, title, bio, stats, badges
│   ├── experience.json     # Work history
│   ├── skills.json         # Categorized skills
│   ├── education.json      # Academic background
│   ├── articles.json       # Newsletter & featured articles
│   ├── certifications.json # Credentials
│   ├── social.json         # Social links & YouTube
│   └── meta.json           # SEO, navigation, footer config
└── assets/images/          # Image assets
```

**External Dependencies (CDN):**
* Google Fonts: Inter, JetBrains Mono
* Lucide Icons: SVG icon library

## 🚀 Common Development Commands & Tasks

* **View Locally:** Run `python3 -m http.server 8000` and open `http://localhost:8000`
* **Edit Content:** Modify JSON files in `data/` — changes reflect on reload.
* **Edit Styles:** Modify CSS files in `css/`. Start with `variables.css` for design tokens.
* **Edit Logic:** Modify JS files in `js/`. `renderer.js` controls DOM generation.

## 📖 Project Setup & Deployment Reference

1. **Clone:** `git clone https://github.com/gaurav-kr-pandey/gaurav-kr-pandey.github.io.git`
2. **View:** `python3 -m http.server 8000` or open `index.html` in a browser.
3. **Deployment:** GitHub Pages from the `main` branch, root `/`.