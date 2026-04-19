/* ============================================
   Renderer — Builds DOM from JSON Data
   ============================================ */

const Renderer = (() => {

    /* ── Icon Helper ── */
    // Branded SVGs that Lucide doesn't include
    const BRAND_SVGS = {
        linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
        github: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>',
        youtube: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
    };

    function icon(name, cls) {
        // Use inline SVG for branded icons, Lucide for everything else
        if (BRAND_SVGS[name]) {
            return BRAND_SVGS[name];
        }
        return `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ''}></i>`;
    }

    /* ── SEO Metadata ── */
    function renderMeta(meta) {
        if (!meta || !meta.seo) return;
        const s = meta.seo;
        document.title = s.title || document.title;

        const setMeta = (name, content) => {
            if (!content) return;
            let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('description', s.description);
        setMeta('keywords', s.keywords);
        setMeta('author', s.author);
        setMeta('og:title', s.title);
        setMeta('og:description', s.description);
        setMeta('og:image', s.ogImage);
        setMeta('og:url', s.ogUrl);
    }

    /* ── Navigation ── */
    function renderNavigation(personal, meta) {
        const navContainer = document.getElementById('navLinks');
        const mobileNavContainer = document.getElementById('mobileNavLinks');
        if (!meta || !meta.navigation) return;

        const links = meta.navigation.map(item =>
            `<li><a href="${item.href}" class="nav-link" id="${item.id}"><span>${item.label}</span></a></li>`
        ).join('');

        if (navContainer) navContainer.innerHTML = links;

        if (mobileNavContainer) {
            const mobileLinks = meta.navigation.map(item =>
                `<li><a href="${item.href}" class="nav-link"><span>${item.label}</span></a></li>`
            ).join('');
            mobileNavContainer.innerHTML = mobileLinks;
        }

        // Brand
        const brandName = document.getElementById('brandName');
        const brandTitle = document.getElementById('brandTitle');
        const brandImg = document.getElementById('brandImg');
        if (brandName && personal) brandName.textContent = personal.name;
        if (brandTitle && personal) brandTitle.textContent = personal.title;
        if (brandImg && personal) {
            brandImg.src = personal.profileImage;
            brandImg.alt = personal.name;
        }
    }

    /* ── Hero Section ── */
    function renderHero(personal) {
        if (!personal) return;

        setText('heroBadgeText', personal.heroBadge);
        setText('heroTitle', personal.name);
        setText('heroSubtitle', personal.tagline);
        setText('heroDescription', personal.heroDescription);

        // Profile image
        const heroImg = document.getElementById('heroProfileImg');
        if (heroImg) {
            heroImg.src = personal.profileImage;
            heroImg.alt = personal.name;
        }

        // Stats
        const statsContainer = document.getElementById('heroStats');
        if (statsContainer && personal.stats) {
            statsContainer.innerHTML = personal.stats.map(stat => `
                <div class="bento-stat">
                    <div class="stat-value font-mono" data-count="${stat.value}" data-suffix="${stat.suffix || ''}">0</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `).join('');
        }

        // Location Time (Bengaluru - IST)
        const timeEl = document.getElementById('localTime');
        if (timeEl) {
            const updateTime = () => {
                const now = new Date();
                const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
                timeEl.innerText = now.toLocaleTimeString('en-US', options) + ' IST';
            };
            updateTime();
            setInterval(updateTime, 60000);
        }

        // Badges
        const badgesContainer = document.getElementById('heroBadges');
        if (badgesContainer && personal.profileBadges) {
            badgesContainer.innerHTML = personal.profileBadges.map(b =>
                `<span class="badge badge-outline">${b}</span>`
            ).join('');
        }
    }

    /* ── Architectural Impact (Systems Gallery) ── */
    function renderExperience(experience) {
        const container = document.getElementById('experienceTimeline');
        if (!container || !experience) return;

        // Mock SVG schematic for technical vibe
        const getSchematic = (idx) => {
            if(idx === 0) return `<svg class="system-schematic" viewBox="0 0 200 100"><path d="M10,50 L50,50 M50,20 L50,80 M50,20 L90,20 M50,80 L90,80" stroke="var(--brand-primary)" stroke-width="2" fill="none"/><circle cx="90" cy="20" r="10" fill="var(--surface)" stroke="var(--brand-primary)" stroke-width="2"/><circle cx="90" cy="80" r="10" fill="var(--surface)" stroke="var(--brand-primary)" stroke-width="2"/><rect x="130" y="30" width="40" height="40" fill="none" stroke="var(--text-secondary)" stroke-width="1" stroke-dasharray="4 4"/></svg>`;
            if(idx === 1) return `<svg class="system-schematic" viewBox="0 0 200 100"><rect x="10" y="40" width="40" height="20" rx="4" fill="none" stroke="var(--brand-primary)" stroke-width="2"/><path d="M50,50 L90,20 M50,50 L90,80 M90,20 L130,20 M90,80 L130,80" stroke="var(--brand-primary)" stroke-width="1" fill="none"/><path d="M130,20 L170,50 L130,80 Z" fill="none" stroke="var(--text-secondary)" stroke-width="1" stroke-dasharray="2 2"/></svg>`;
            return '';
        };

        container.innerHTML = experience.map((exp, i) => `
            <div class="system-card reveal stagger-${Math.min(i + 1, 8)} magnetic-card">
                ${getSchematic(i)}
                <div class="system-header">
                    <div class="company-logo ${exp.logoClass}" style="border: 1px solid var(--border-primary); background: transparent;">
                        ${exp.logoImage ? `<img src="${exp.logoImage}" alt="${exp.company}" style="width:100%;height:100%;object-fit:cover;filter:grayscale(1) brightness(1.5);">` : `<span class="font-mono" style="color:var(--text-secondary)">${exp.logoLetter}</span>`}
                    </div>
                    <div class="system-details">
                        <h3 class="font-mono" style="color: var(--text-primary); text-transform: uppercase;">${exp.company}</h3>
                        <div class="system-role">${exp.role} <span class="system-team" style="color: var(--brand-primary)">// ${exp.team || exp.type}</span></div>
                    </div>
                    <div class="system-duration font-mono">[ ${exp.duration} ]</div>
                </div>
                <div class="system-body">
                    <ul class="system-achievements">
                        ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }

    /* ── Skills Section ── */
    function renderSkills(skills) {
        const container = document.getElementById('skillsGrid');
        if (!container || !skills) return;

        container.innerHTML = skills.categories.map((cat, i) => `
            <div class="skill-category-card reveal stagger-${Math.min(i + 1, 8)}">
                <div class="skill-category-header">
                    <div class="skill-category-icon">${icon(cat.icon)}</div>
                    <h3 class="skill-category-title">${cat.title}</h3>
                </div>
                <div class="skill-tags-wrap">
                    ${cat.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    /* ── Articles / Writing Section ── */
    function renderArticles(articles) {
        const container = document.getElementById('articlesGrid');
        const nlBanner = document.getElementById('newsletterBanner');
        if (!container || !articles) return;

        // Show only featured articles on main page
        const featured = (articles.articles || []).filter(a => a.featured);
        container.innerHTML = featured.map((article, i) => `
            <a href="${article.url}" target="_blank" rel="noopener" class="article-card reveal stagger-${Math.min(i + 1, 8)}">
                <div class="article-meta">
                    <span>${article.date}</span>
                    <span class="dot"></span>
                    <span>${article.readTime} read</span>
                </div>
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <div class="article-tags">
                    ${article.tags.map(t => `<span class="article-tag">${t}</span>`).join('')}
                </div>
            </a>
        `).join('');

        // Newsletter banner with View All link
        if (nlBanner && articles.newsletter) {
            const nl = articles.newsletter;
            const totalArticles = (articles.articles || []).length;
            const totalVideos = (articles.videos || []).length;
            nlBanner.innerHTML = `
                <h3>${nl.name}</h3>
                <p>${nl.description}</p>
                <div style="display:flex;gap:var(--space-4);justify-content:center;flex-wrap:wrap">
                    <a href="content.html" class="btn">View All ${totalArticles} Articles & ${totalVideos} Videos</a>
                    <a href="${nl.url}" target="_blank" rel="noopener" class="btn" style="background:transparent;border:1.5px solid #000000;color:#000000">Subscribe ${icon('external-link')}</a>
                </div>
            `;
        }
    }

    /* ── Education Section ── */
    function renderEducation(education, certifications) {
        const container = document.getElementById('educationGrid');
        if (!container || !education) return;

        container.innerHTML = education.map((edu, i) => `
            <div class="education-card reveal stagger-${Math.min(i + 1, 8)}">
                <div class="education-icon">${icon(edu.icon)}</div>
                <h3>${edu.institution}</h3>
                <div class="education-degree">${edu.degree} — ${edu.field}</div>
                <div class="education-duration">${edu.duration} · ${edu.location}</div>
                <p>${edu.description}</p>
            </div>
        `).join('');

        // Certifications
        const certsContainer = document.getElementById('certsGrid');
        if (certsContainer && certifications && certifications.length) {
            certsContainer.innerHTML = certifications.map((cert, i) => `
                <div class="cert-item reveal stagger-${Math.min(i + 1, 8)}">
                    <div class="cert-icon">${icon(cert.icon)}</div>
                    <div>
                        <div class="cert-title">${cert.title}</div>
                        <div class="cert-issuer">${cert.issuer}${cert.date ? ` · ${cert.date}` : ''}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    /* ── Contact Section ── */
    function renderContact(personal, social) {
        if (!social || !social.links) return;

        const channelsContainer = document.getElementById('contactChannels');
        if (channelsContainer) {
            const contactItems = social.links.map((link, i) => `
                <a href="${link.url}" target="${link.url.startsWith('mailto') ? '_self' : '_blank'}" rel="noopener" class="contact-item reveal stagger-${Math.min(i + 1, 8)}">
                    <div class="contact-item-icon">${icon(link.icon)}</div>
                    <div>
                        <div class="contact-item-label">${link.platform}</div>
                        <div class="contact-item-value">${link.username}</div>
                    </div>
                </a>
            `).join('');
            channelsContainer.innerHTML = contactItems;
        }

        // CTA
        const ctaMessage = document.getElementById('ctaMessage');
        const ctaEmail = document.getElementById('ctaEmail');
        if (ctaMessage && personal) ctaMessage.textContent = personal.availabilityMessage;
        if (ctaEmail && personal) ctaEmail.href = `mailto:${personal.email}`;
    }

    /* ── Footer ── */
    function renderFooter(meta, social) {
        const copyEl = document.getElementById('footerCopy');
        const builtEl = document.getElementById('footerBuilt');
        const linksContainer = document.getElementById('footerLinks');

        if (copyEl && meta && meta.footer) copyEl.textContent = meta.footer.copyright;
        if (builtEl && meta && meta.footer) builtEl.textContent = meta.footer.builtWith;

        if (linksContainer && social && social.links) {
            linksContainer.innerHTML = social.links
                .filter(l => ['LinkedIn', 'GitHub', 'YouTube', 'Email'].includes(l.platform))
                .map(link => `
                    <a href="${link.url}" target="${link.url.startsWith('mailto') ? '_self' : '_blank'}" rel="noopener" class="social-icon" data-tooltip="${link.platform}">
                        ${icon(link.icon)}
                    </a>
                `).join('');
        }
    }

    /* ── Render All ── */
    function renderAll(data) {
        renderMeta(data.meta);
        renderNavigation(data.personal, data.meta);
        renderHero(data.personal);
        renderExperience(data.experience);
        renderSkills(data.skills);
        renderArticles(data.articles);
        renderEducation(data.education, data.certifications);
        renderContact(data.personal, data.social);
        renderFooter(data.meta, data.social);

        // Initialize Lucide icons after rendering
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    /* ── Helpers ── */
    function setText(id, text) {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    }

    function adjustColor(hex, amount) {
        if (!hex) return '#333';
        let color = hex.replace('#', '');
        if (color.length === 3) {
            color = color.split('').map(c => c + c).join('');
        }
        const num = parseInt(color, 16);
        let r = Math.min(255, Math.max(0, (num >> 16) + amount));
        let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        let b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }

    return { renderAll };
})();
