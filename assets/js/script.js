
// Ensure jQuery is ready
jQuery(document).ready(function ($) {
  // ==========================
  // 🔹 Site base + asset() helper (dev/prod safe)
  // ==========================
  (function () {
    const metaBase = document.querySelector('meta[name="site-base"]')?.content?.trim();
    let base = '/';

    if (metaBase) {
      base = metaBase.endsWith('/') ? metaBase : metaBase + '/';
    } else {
      const segs = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
      base = segs.length >= 2 ? `/${segs.slice(0, 2).join('/')}/` : '/';
    }
    window.SITE_BASE = base;
    window.asset = (p) => `${window.SITE_BASE}${String(p).replace(/^\/+/, '')}`;
  })();

  // ==========================
  // 🔹 Topics Slider
  // ==========================
  const nextHtmlTopics = document.getElementById('arrowNextTopics')?.innerHTML.trim();
  if ($('.topics').length) {
    $('.topics').slick({
      dots: false,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      prevArrow: false,
      nextArrow: nextHtmlTopics,
      responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            centerMode: true,
            centerPadding: '5px',
            nextArrow: nextHtmlTopics,
          },
        },
      ],
    });
  }

  // ==========================
  // 🔹 Video Slider + Modal
  // ==========================
  const prevHtml = document.getElementById('arrowPrev')?.innerHTML.trim();
  const nextHtml = document.getElementById('arrowNext')?.innerHTML.trim();

  if ($('#videoSlider').length) {
    $('#videoSlider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: true,
      speed: 400,
      prevArrow: prevHtml,
      nextArrow: nextHtml,
      centerMode: true,
      centerPadding: '25%',
      initialSlide: 1,
      responsive: [
        { breakpoint: 1024, settings: { centerPadding: '18%', initialSlide: 1 } },
        { breakpoint: 640, settings: { centerPadding: '5px', initialSlide: 0 } },
      ],
    });
  }

  const $modal = $('#videoModal');
  const $mount = $('#videoMount');

  function openVideo(src) {
    $modal.removeClass('hidden');
    if (!src.startsWith('mp4:')) {
      const url = new URL(src);
      if (url.host.includes('youtube')) {
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('rel', '0');
        url.searchParams.set('modestbranding', '1');
      } else if (url.host.includes('vimeo')) {
        url.searchParams.set('autoplay', '1');
        url.searchParams.set('title', '0');
        url.searchParams.set('byline', '0');
        url.searchParams.set('portrait', '0');
      }
      $mount.html(
        `<iframe src="${url.toString()}" allow="autoplay; encrypted-media" allowfullscreen class="h-full w-full"></iframe>`
      );
    } else {
      const mp4 = src.replace(/^mp4:/, '');
      $mount.html(`<video src="${mp4}" controls autoplay class="h-full w-full object-contain" playsinline></video>`);
    }
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    $modal.addClass('hidden');
    $mount.empty();
    document.body.style.overflow = '';
  }

  $(document).on('click', '#videoSlider article', function () {
    const src = this.getAttribute('data-video');
    if (src) openVideo(src);
  });

  $('#closeModal').on('click', closeVideo);
  $('#videoModal').on('click', function (e) {
    if (e.target === this || $(e.target).hasClass('bg-black/70')) closeVideo();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideo();
  });

  // ==========================
  // 🔹 Dropdown Toggle
  // ==========================
  window.toggleDropdown = function (id) {
    const dropdown = document.getElementById(id);
    const icon = document.getElementById('icon-' + id);
    if (dropdown.classList.contains('hidden')) {
      dropdown.classList.remove('hidden');
      icon?.classList.add('rotate-180');
    } else {
      dropdown.classList.add('hidden');
      icon?.classList.remove('rotate-180');
    }
  };

  // ==========================
  // 🔹 Header Scroll Behavior
  // ==========================
  function updateHeaderOnScroll() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    const navLinks = header.querySelectorAll('nav a');
    const logo = header.querySelector('img[alt="Logo"]');
    const lang = localStorage.getItem('lang') || 'jp';
    const isBlueLogo = document.body.dataset.blueLogo === 'true';
    const search = document.getElementById('headerSearch');

    const logoBlue = lang === 'en' ? asset('assets/img/brand-logo.webp') : asset('assets/img/logo-blue.webp');
    const logoWhite = lang === 'en' ? asset('assets/img/brand-logo-white.webp') : asset('assets/img/brand-logo-white.webp');

    if (isBlueLogo) {
      if (window.scrollY > 10) {
        header.classList.add('bg-white', 'shadow-md');
        header.classList.remove('bg-transparent');
        navLinks.forEach((link) => {
          link.classList.remove('text-[#fff]');
          link.classList.add('text-[#111111]');
        });
        if (logo) logo.src = logoBlue;
      } else {
        header.classList.remove('bg-white', 'shadow-md');
        header.classList.add('bg-transparent');
        navLinks.forEach((link) => {
          link.classList.remove('text-[#111111]');
          link.classList.add('text-[#fff]');
        });
        if (logo) logo.src = logoWhite;
      }
      navLinks.forEach((link) => {
        link.classList.remove('text-[#fff]');
        link.classList.add('text-[#111111]');
      });
      if (logo) logo.src = logoBlue;
      if (search) {
        search.classList.remove('bg-white', 'rounded-full');
        search.classList.add('border', 'border-solid', 'border-[#BAD8F6]', 'rounded-full');
      }
      return;
    }

    if (window.scrollY > 10) {
      header.classList.add('bg-white', 'shadow-md');
      header.classList.remove('bg-transparent');
      navLinks.forEach((link) => {
        link.classList.remove('text-[#fff]');
        link.classList.add('text-[#111111]');
      });
      if (logo) logo.src = logoBlue;
      if (search) {
        search.classList.remove('bg-white', 'rounded-full');
        search.classList.add('border', 'border-solid', 'border-[#BAD8F6]', 'rounded-full');
      }
    } else {
      header.classList.remove('bg-white', 'shadow-md');
      header.classList.add('bg-transparent');
      navLinks.forEach((link) => {
        link.classList.remove('text-[#111111]');
        link.classList.add('text-[#fff]');
      });
      if (logo) logo.src = logoWhite;
      if (search) {
        search.classList.remove('border', 'border-none');
        search.classList.add('bg-white', 'rounded-full');
      }
    }
  }

  window.updateHeaderOnScroll = updateHeaderOnScroll;

  window.forceWhiteLogoWhenMenuOpen = function () {
    const headerLogo = document.querySelector('#mainHeader img[alt="Logo"]');
    const mobileLogo = document.querySelector('#mobileMenu img[alt="Logo"]');
    const mobileLanguageLogo = document.querySelector('#mobileLanguage img[alt="Logo"]');
    const lang = localStorage.getItem('lang') || 'jp';

    const whiteLogo = lang === 'en' ? asset('assets/img/brand-logo-white.webp') : asset('assets/img/brand-logo-white.webp');

    if (headerLogo) headerLogo.src = whiteLogo;
    if (mobileLogo) mobileLogo.src = whiteLogo;
    if (mobileLanguageLogo) mobileLanguageLogo.src = whiteLogo;
  };

  window.addEventListener('load', updateHeaderOnScroll);
  window.addEventListener('scroll', updateHeaderOnScroll);
  window.addEventListener('resize', updateHeaderOnScroll);

  // ==========================
  // 🔹 Language Switch (Instant Logo Update)
  // ==========================
  // window.setLanguage = function (lang) {
  //   localStorage.setItem('lang', lang);
  //   document.documentElement.setAttribute('lang', lang);

  //   // 🔹 Sync currentLang for your global updateLanguage() script
  //   if (typeof window.currentLang !== 'undefined') {
  //     window.currentLang = lang;
  //   }

  //   // 🔹 Call your main updateLanguage() immediately
  //   if (typeof window.updateLanguage === 'function') {
  //     window.updateLanguage();
  //   }

  //   // 🔹 Keep your existing behavior (logo/menu updates)
  //   if (typeof window.updateHeaderOnScroll === 'function') {
  //     window.updateHeaderOnScroll();
  //   }

  //   const menu = document.getElementById('mobileMenu');
  //   if (menu && !menu.classList.contains('hidden') && typeof window.forceWhiteLogoWhenMenuOpen === 'function') {
  //     window.forceWhiteLogoWhenMenuOpen();
  //   }
  // };

  // Optional: attach click listeners for elements with [data-lang]
  // document.addEventListener('click', (e) => {
  //   const btn = e.target.closest('[data-lang]');
  //   if (!btn) return;
  //   const lang = btn.getAttribute('data-lang');
  //   window.setLanguage(lang);
  // });
});

// ==========================
// 🔹 Active Nav Highlight & Smooth Scroll
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function activateNavLink() {
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - (-900);
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const li = link.closest('li');
      const dot = li?.querySelector('.dot');

      // Reset link color and hide dot
      link.classList.remove('text-[#0055A6]');
      link.classList.add('text-[#C4C8CF]');
      if (dot) dot.style.opacity = 0; // hide dot without affecting layout

      // Show dot for the active section
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('text-[#0055A6]');
        link.classList.remove('text-[#C4C8CF]');
        if (dot) dot.style.opacity = 1; // show dot
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  window.addEventListener('scroll', activateNavLink);
  activateNavLink();

  // Initialize WOW.js
  new WOW({
    boxClass: 'wow', // default
    animateClass: 'animated', // default
    offset: 100, // distance to trigger animation
    mobile: true, // animate on mobile
    live: true // check for new elements
  }).init();
});

document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll(".count-number");
  let counted = false;

  const startCounting = () => {
    if (counted) return;
    counted = true;

    counters.forEach((el) => {
      let rawTarget = el.getAttribute("data-count").trim();

      // Detect if the target has a symbol (+ or %)
      const symbolMatch = rawTarget.match(/[%+]/);
      const symbol = symbolMatch ? symbolMatch[0] : "";
      const target = +rawTarget.replace(/[^0-9]/g, ""); // extract number

      let current = 0;
      const step = Math.max(1, Math.ceil(target / 200)); // smaller step = slower

      const updateCount = () => {
        current += step;

        if (current < target) {
          el.innerText = current.toLocaleString() + symbol;
          setTimeout(updateCount, 15);
        } else {
          el.innerText = target.toLocaleString() + symbol;
        }
      };

      updateCount();
    });
  };

  // Trigger when visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startCounting();
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((counter) => observer.observe(counter));
});

$(document).ready(function () {
  $('.leaders-slider').slick({
    infinite: true,
    slidesToShow: 1,        // 2 slides on desktop
    slidesToScroll: 1,
    dots: false,             // pagination dots
    arrows: true,           // prev/next arrows
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,   // Mobile
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  });
});

$(document).ready(function () {
  $('.news-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });
});

$(document).ready(function () {
  $('.sis-slider').slick({
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const messageEl = document.getElementById('message');

    if (!email || !email.includes("@")) {
      messageEl.innerText = "Please enter a valid email.";
      setTimeout(() => { messageEl.innerText = ""; }, 3000);
      return;
    }

    const formData = new URLSearchParams();
    formData.append('email', email);

    fetch('subscribe.php', {
      method: 'POST',
      body: formData
    })
      .then(res => res.text())
      .then(data => {
        messageEl.innerText = data;
        form.reset();
        setTimeout(() => { messageEl.innerText = ""; }, 3000);
      })
      .catch(err => {
        messageEl.innerText = "Something went wrong.";
        setTimeout(() => { messageEl.innerText = ""; }, 3000);
        console.error(err);
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".js-nav-parent");

  navItems.forEach(item => {
    const toggle = item.querySelector(".js-nav-toggle");
    const menu = item.querySelector(".js-nav-menu");
    const arrow = item.querySelector(".js-nav-arrow");

    if (!toggle || !menu) return;

    item.addEventListener("click", (e) => {
      const isToggle = e.target.closest(".js-nav-toggle");

      if (!isToggle) return;
      
      e.preventDefault();
      e.stopPropagation();

      const isOpen = !menu.classList.contains("hidden");

      // 🔴 Close ALL dropdowns first and reset styles
      navItems.forEach(i => {
        const m = i.querySelector(".js-nav-menu");
        const a = i.querySelector(".js-nav-arrow");
        const t = i.querySelector(".js-nav-toggle");

        i.classList.remove("bg-[#0055A6]");
        // Reset text color to default (removing white force)
        t?.classList.remove("!text-white", "text-white"); 
        
        m?.classList.add("hidden");
        m?.classList.remove("flex");
        a?.classList.remove("rotate-180");
      });

      // 🟢 Open clicked one (if it was closed)
      if (!isOpen) {
        menu.classList.remove("hidden");
        menu.classList.add("flex");
        item.classList.add("bg-[#0055A6]");
        
        // Force text to stay white while this menu is active
        toggle.classList.add("!text-white"); 
        
        arrow?.classList.add("rotate-180");
      }
    });
  });

  // ===== Click outside closes everything =====
  document.addEventListener("click", () => {
    navItems.forEach(item => {
      const menu = item.querySelector(".js-nav-menu");
      const arrow = item.querySelector(".js-nav-arrow");
      const toggle = item.querySelector(".js-nav-toggle");

      item.classList.remove("bg-[#0055A6]");
      toggle?.classList.remove("!text-white", "text-white");
      
      menu?.classList.add("hidden");
      menu?.classList.remove("flex");
      arrow?.classList.remove("rotate-180");
    });
  });

  // ===== Inner dropdowns (Programs etc.) =====
  const innerToggles = document.querySelectorAll(".js-dropdown-toggle");

  innerToggles.forEach(toggle => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const parent = toggle.closest(".group\\/inner");
      const menu = parent?.querySelector(".js-dropdown-menu-inner");
      const arrow = toggle.querySelector(".js-inner-arrow");

      if (!menu) return;

      const isOpen = !menu.classList.contains("hidden");

      // 🔴 Close all inner menus + reset arrows
      document.querySelectorAll(".js-dropdown-menu-inner").forEach(m => {
        m.classList.add("hidden");
        m.classList.remove("flex");
      });

      document.querySelectorAll(".js-inner-arrow").forEach(a => {
        a.classList.remove("rotate-180");
      });

      // 🟢 Open current
      if (!isOpen) {
        menu.classList.remove("hidden");
        menu.classList.add("flex");
        arrow?.classList.add("rotate-180");
      }
    });
  });
});
