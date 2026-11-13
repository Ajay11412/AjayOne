 // Update footer year
    document.getElementById("current-year").textContent =
        new Date().getFullYear();

    // Contact form: prepare an email using the visitor's email application
    const contactForm = document.getElementById("contact-form");

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const senderEmail = document.getElementById("sender-email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        const yourEmail = "ajaysuresh396@gmail.com";

        const body =
            "Name: " + name + "\n" +
            "Email: " + senderEmail + "\n\n" +
            "Message:\n" + message;

        const mailtoLink =
            "mailto:" + yourEmail +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);

        document.getElementById("form-hint").textContent =
            "Opening your email application...";

        window.location.href = mailtoLink;
    });

/* Shared script: works on every page (home, about, ...). Missing elements are skipped. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;

/* Auto-setup: adds the effect elements and animation attributes itself,
   so the HTML pages need no extra markup. */
(function autoSetup() {
    if (!$('.progress')) {
        document.body.insertAdjacentHTML('afterbegin',
            '<div class="progress"></div><div class="cursor-dot"></div><div class="cursor-ring"></div>' +
            '<div class="blob blob-a" data-depth="60"></div><div class="blob blob-b" data-depth="40"></div>');
    }

    const reveal = (sel, base = 0, step = 0) => $$(sel).forEach((el, i) => {
        if (el.hasAttribute('data-reveal')) return;
        el.setAttribute('data-reveal', '');
        el.style.setProperty('--d', (base + i * step) + 's');
    });

    /* Contact page */
    reveal('.contact-hero .section-tag');
    reveal('.contact-hero h1', 0.1);
    reveal('.contact-hero-content > p', 0.2);
    reveal('.contact-heading h2');
    reveal('.contact-heading p', 0.1);
    reveal('.contact-card', 0, 0.15);
    reveal('.message-info');
    reveal('.contact-form', 0.15);
    $$('.contact-card').forEach(el => el.setAttribute('data-tilt', ''));

    const hero = $('.contact-hero');
    if (hero && !$('.chip', hero)) {
        hero.insertAdjacentHTML('afterbegin',
            '<div class="chip chip-a" data-depth="45"><i class="fas fa-envelope"></i></div>' +
            '<div class="chip chip-b" data-depth="60"><i class="fas fa-paper-plane"></i></div>' +
            '<div class="chip chip-c" data-depth="35"><i class="fab fa-github"></i></div>');
    }
})();

/* Mobile menu (delegated: works when the header is injected later by components.js) */
document.addEventListener('click', e => {
    const nav = $('#navbar'), btn = e.target.closest('#menu-btn');
    if (btn && nav) {
        e.stopImmediatePropagation();
        const open = nav.classList.toggle('show');
        btn.setAttribute('aria-expanded', open);
        const icon = $('i', btn);
        if (icon) { icon.classList.toggle('fa-bars', !open); icon.classList.toggle('fa-xmark', open); }
    } else if (nav && e.target.closest('#navbar a')) {
        nav.classList.remove('show');
    }
}, true);

/* Scroll progress + header state */
const bar = $('.progress');
function onScroll() {
    const h = document.documentElement;
    if (bar) bar.style.transform = `scaleX(${h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)})`;
    const header = $('.header');
    if (header) header.classList.toggle('scrolled', h.scrollTop > 20);
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Typing effect (home page) */
const typed = $('#typed');
if (typed) {
    const words = ['Web Developer', 'Problem Solver', 'Creative Thinker', 'Lifelong Learner'];
    let w = 0, c = 0, del = false;
    (function type() {
        if (reduce) { typed.textContent = words[0]; return; }
        const word = words[w];
        c += del ? -1 : 1;
        typed.textContent = word.slice(0, c);
        let d = del ? 45 : 90;
        if (!del && c === word.length) { del = true; d = 1400; }
        else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 300; }
        setTimeout(type, d);
    })();
}

/* Reveal on scroll. The attribute is removed afterwards so hover effects work normally. */
const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('in');
    io.unobserve(el);
    setTimeout(() => { el.removeAttribute('data-reveal'); el.classList.remove('in'); }, 2200);
}), { threshold: 0.15 });
$$('[data-reveal]').forEach(el => reduce ? el.classList.add('in') : io.observe(el));

/* Animated counters */
const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    co.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, start = performance.now();
    (function tick(now) {
        const p = Math.min((now - start) / 1400, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + (el.dataset.suffix || '');
        if (p < 1) requestAnimationFrame(tick);
    })(start);
}), { threshold: 0.6 });
$$('[data-count]').forEach(el => co.observe(el));

/* Tech ticker: duplicate content for a seamless loop */
const track = $('.track');
if (track) track.innerHTML += track.innerHTML;

/* Button ripple */
$$('.btn, .about-btn, .primary-btn, .education-btn, .send-btn').forEach(b => b.addEventListener('click', e => {
    const r = b.getBoundingClientRect(), s = document.createElement('span');
    s.className = 'ripple';
    s.style.left = e.clientX - r.left + 'px';
    s.style.top = e.clientY - r.top + 'px';
    b.appendChild(s);
    setTimeout(() => s.remove(), 600);
}));

/* Mouse interactions (desktop only) */
if (fine && !reduce) {

    /* Custom cursor with trailing ring */
    const dot = $('.cursor-dot'), ring = $('.cursor-ring');
    if (dot && ring) {
        let x = 0, y = 0, rx = 0, ry = 0;
        addEventListener('mousemove', e => {
            x = e.clientX; y = e.clientY;
            document.body.classList.add('has-cursor');
            dot.style.transform = `translate(${x}px, ${y}px)`;
        });
        (function loop() {
            rx += (x - rx) * 0.15;
            ry += (y - ry) * 0.15;
            ring.style.transform = `translate(${rx}px, ${ry}px)`;
            requestAnimationFrame(loop);
        })();
        document.addEventListener('mouseover', e => ring.classList.toggle('hover', !!e.target.closest('a, button')));
    }

    /* Magnetic buttons (delegated, so the injected header button works too) */
    const MAG = '[data-magnetic], .nav-btn, .send-btn';
    document.addEventListener('mousemove', e => {
        const b = e.target.closest && e.target.closest(MAG);
        if (!b) return;
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    document.addEventListener('mouseout', e => {
        const b = e.target.closest && e.target.closest(MAG);
        if (b && !b.contains(e.relatedTarget)) b.style.transform = '';
    });

    /* Hero spotlight + depth parallax */
    const hero = $('.home, .about-hero, .projects-hero, .education-hero, .contact-hero'), depth = $$('[data-depth]');
    if (hero) hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', e.clientX - r.left + 'px');
        hero.style.setProperty('--my', e.clientY - r.top + 'px');
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        depth.forEach(el => {
            const d = +el.dataset.depth;
            el.style.translate = `${-nx * d}px ${-ny * d}px`;
        });
    });

    /* 3D tilt + glare (profile card on home, developer card on about, code window on projects) */
    const stage = $('.home-image, .about-visual, .hero-decoration, .education-visual'), card = $('.profile-card, .developer-card, .code-window, .education-main-card');
    if (stage && card) {
        stage.addEventListener('mousemove', e => {
            const r = stage.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
            card.style.transform = `rotateY(${(px - 0.5) * 16}deg) rotateX(${(0.5 - py) * 16}deg)`;
            card.style.setProperty('--gx', px * 100 + '%');
            card.style.setProperty('--gy', py * 100 + '%');
        });
        stage.addEventListener('mouseleave', () => card.style.transform = '');
    }

    /* Card spotlight (about page) */
    $$('.approach-card, .project-card, .timeline-card, .study-card, .contact-card').forEach(c => c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--cx', e.clientX - r.left + 'px');
        c.style.setProperty('--cy', e.clientY - r.top + 'px');
    }));
}

/* 3D tilt on any element with data-tilt (contact cards) */
if (fine && !reduce) {
    $$('[data-tilt]').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
            el.style.transform = `perspective(800px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 10}deg) translateY(-8px)`;
        });
        el.addEventListener('mouseleave', () => el.style.transform = '');
    });
}