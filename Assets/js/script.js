
const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("show");

    const icon = menuBtn.querySelector("i");

    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
});

// Close mobile menu after clicking a link
document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("show");

        const icon = menuBtn.querySelector("i");
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-xmark");
    });
});
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;

/* Mobile menu */
const nav = $('#navbar');
$('#menu-btn').addEventListener('click', () => nav.classList.toggle('show'));
$$('a', nav).forEach(a => a.addEventListener('click', () => nav.classList.remove('show')));

/* Scroll progress + header state */
const header = $('.header'), bar = $('.progress');
function onScroll() {
    const h = document.documentElement;
    bar.style.transform = `scaleX(${h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)})`;
    header.classList.toggle('scrolled', h.scrollTop > 20);
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Typing effect */
const words = ['Web Developer', 'Problem Solver', 'Creative Thinker', 'Lifelong Learner'];
const typed = $('#typed');
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

/* Reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
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
track.innerHTML += track.innerHTML;

/* Button ripple */
$$('.btn').forEach(b => b.addEventListener('click', e => {
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

    /* Magnetic buttons */
    $$('[data-magnetic]').forEach(b => {
        b.addEventListener('mousemove', e => {
            const r = b.getBoundingClientRect();
            b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
        });
        b.addEventListener('mouseleave', () => b.style.transform = '');
    });

    /* Hero spotlight + depth parallax */
    const home = $('.home'), depth = $$('[data-depth]');
    home.addEventListener('mousemove', e => {
        const r = home.getBoundingClientRect();
        home.style.setProperty('--mx', e.clientX - r.left + 'px');
        home.style.setProperty('--my', e.clientY - r.top + 'px');
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        depth.forEach(el => {
            const d = +el.dataset.depth;
            el.style.translate = `${-nx * d}px ${-ny * d}px`;
        });
    });

    /* 3D tilt + glare on profile card */
    const stage = $('.home-image'), card = $('.profile-card');
    stage.addEventListener('mousemove', e => {
        const r = stage.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = `rotateY(${(px - 0.5) * 16}deg) rotateX(${(0.5 - py) * 16}deg)`;
        card.style.setProperty('--gx', px * 100 + '%');
        card.style.setProperty('--gy', py * 100 + '%');
    });
    stage.addEventListener('mouseleave', () => card.style.transform = '');
}

