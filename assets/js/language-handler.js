let currentLang = 'en';
localStorage.setItem('lang', currentLang);
function updateLanguage() {
    // ✅ Update language label in button
    const langTextDesktop = document.getElementById("langTextDesktop");
    const langTextMobile = document.getElementById("langTextMobile");
    const langTextMobileMenu = document.getElementById("langTextMobileMenu");
    const langTextMobileLanguage = document.getElementById("langTextMobileLanguage");
    // ==========================
    // 🔹 Site base + asset() helper (dev/prod safe)
    // ==========================
    (function () {
        const metaBase = document.querySelector('meta[name="site-base"]')?.content?.trim();
        let base = '/';

        if (metaBase) {
            base = metaBase.endsWith('/') ? metaBase : metaBase + '/';
        } else {
            // Auto-detect when no <meta> provided:
            // if URL looks like /develop/lcic/... => use first 2 segments as base, else '/'
            const segs = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
            base = segs.length >= 2 ? `/${segs.slice(0, 2).join('/')}/` : '/';
        }
        window.SITE_BASE = base;
        window.asset = (p) => `${window.SITE_BASE}${String(p).replace(/^\/+/, '')}`;
    })();


    if (langTextDesktop) langTextDesktop.textContent = currentLang.toUpperCase();
    if (langTextMobile) langTextMobile.textContent = currentLang.toUpperCase();
    if (langTextMobileMenu) langTextMobileMenu.textContent = currentLang.toUpperCase();
    if (langTextMobileLanguage) langTextMobileLanguage.textContent = currentLang.toUpperCase();

    // ✅ Apply translations and styles from the "languages" object
    document.querySelectorAll('[data-text-key]').forEach(el => {
        const key = el.getAttribute('data-text-key');
        const langData = languages[currentLang][key];
        if (!langData) return;

        // ✅ If it's an <img>, change its src
        if (el.tagName.toLowerCase() === 'img') {
            el.setAttribute('src', langData[0]);
        }
        // ✅ Otherwise, change its innerHTML (text)
        else {
            el.innerHTML = langData[0];
        }

        // ✅ If a class name is provided in langData[1], replace it
        if (langData[1]) { el.setAttribute("class", langData[1]); }
        if ((el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') && langData) {
            el.setAttribute('placeholder', langData[0]);
        }
    });
    // ✅ Apply global font (for language consistency)
    const fontClass = currentLang === 'jp' ? 'hiragino-font' : 'asap-font';
    document.body.classList.remove('hiragino-font', 'asap-font');
    document.body.classList.add(fontClass);

    // ✅ Helper: update footer logo
    function updateFooterLogo() {
        const footerLogo = document.querySelector('#footer img[alt="FooterLogo"]');
        if (!footerLogo) return;
        footerLogo.src = currentLang === 'en'
            ? asset('assets/img/brand-logo-white.webp')
            : asset('assets/img/brand-logo-white.webp');
    }

    // ✅ Update footer logo immediately
    updateFooterLogo();

    window.updateHeaderOnScroll = function () {
        const logos = document.querySelectorAll('img[alt="Logo"]');
        const isTransparentHeader = document.body.dataset.transparentHeader === 'true';
        const isBlueLogoPage = document.body.dataset.blueLogo === 'true';
        const isScrolled = window.scrollY > 10;

        logos.forEach(logo => {
            if (isBlueLogoPage) {
                // Always blue
                logo.src = currentLang === 'en'
                    ? asset('assets/img/brand-logo.webp')
                    : asset('assets/img/logo-blue.webp');
            }
            else if (isTransparentHeader) {
                // Transparent page (like index)
                if (isScrolled) {
                    // Scrolled → blue logo
                    logo.src = currentLang === 'en'
                        ? asset('assets/img/brand-logo.webp')
                        : asset('assets/img/logo-blue.webp');
                } else {
                    // Top → white logo
                    logo.src = currentLang === 'en'
                        ? asset('assets/img/brand-logo-white.webp')
                        : asset('assets/img/brand-logo-white.webp');
                }
            }
            else {
                // Default pages
                logo.src = currentLang === 'en'
                    ? asset('assets/img/brand-logo.webp')
                    : asset('assets/img/logo-blue.webp');
            }
        });
        updateFooterLogo();
    };
    // ✅ Force header/logo update based on scroll state
    if (typeof window.updateHeaderOnScroll === 'function') {
        window.updateHeaderOnScroll();
    }

}

function toggleLanguage() {
    currentLang = currentLang === 'jp' ? 'en' : 'jp';
    localStorage.setItem('lang', currentLang);
    updateLanguage();
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', currentLang);
    updateLanguage();
    // Hide the mobile language modal after selecting
    const modal = document.getElementById('mobileLanguage');
    if (modal) modal.classList.add('hidden');
}

// ✅ Initialize on load
document.addEventListener("DOMContentLoaded", updateLanguage);
window.addEventListener('scroll', window.updateHeaderOnScroll);