/* Shared script: works on every page (home, about, ...). Missing elements are skipped. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;



/* Scroll progress + header state */
const header = $('.header'), bar = $('.progress');
function onScroll() {
    const h = document.documentElement;
    if (bar) bar.style.transform = `scaleX(${h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)})`;
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
$$('.btn, .about-btn, .primary-btn').forEach(b => b.addEventListener('click', e => {
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

    /* Magnetic buttons */
    $$('[data-magnetic]').forEach(b => {
        b.addEventListener('mousemove', e => {
            const r = b.getBoundingClientRect();
            b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
        });
        b.addEventListener('mouseleave', () => b.style.transform = '');
    });

    /* Hero spotlight + depth parallax */
    const hero = $('.home, .about-hero, .projects-hero'), depth = $$('[data-depth]');
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
    const stage = $('.home-image, .about-visual, .hero-decoration'), card = $('.profile-card, .developer-card, .code-window');
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
    $$('.approach-card, .project-card').forEach(c => c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--cx', e.clientX - r.left + 'px');
        c.style.setProperty('--cy', e.clientY - r.top + 'px');
    }));
}
