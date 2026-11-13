
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;

/* ========================================
   MOBILE HAMBURGER MENU
======================================== */

const menuBtn = $('#menu-btn');
const navbar = $('#navbar');

if (menuBtn && navbar) {

    const icon = menuBtn.querySelector('i');

    function closeMenu() {
        navbar.classList.remove('show');

        if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }

        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open navigation menu');
    }

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        const isOpen = navbar.classList.toggle('show');

        if (icon) {
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-xmark', isOpen);
        }

        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuBtn.setAttribute(
            'aria-label',
            isOpen ? 'Close navigation menu' : 'Open navigation menu'
        );
    });

    // Close menu after clicking a navigation link
    $$('.navbar a', navbar).forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu when switching to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

}

/* ========================================
   SCROLL PROGRESS + HEADER STATE
======================================== */

const header = $('.header');
const bar = $('.progress');

function onScroll() {

    const h = document.documentElement;

    if (bar) {
        bar.style.transform =
            `scaleX(${h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)})`;
    }

    if (header) {
        header.classList.toggle('scrolled', h.scrollTop > 20);
    }
}

addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ========================================
   TYPING EFFECT
======================================== */

const words = [
    'Web Developer',
    'Problem Solver',
    'Creative Thinker',
    'Lifelong Learner'
];

const typed = $('#typed');

if (typed) {

    let w = 0, c = 0, del = false;

    (function type() {

        if (reduce) {
            typed.textContent = words[0];
            return;
        }

        const word = words[w];

        c += del ? -1 : 1;
        typed.textContent = word.slice(0, c);

        let d = del ? 45 : 90;

        if (!del && c === word.length) {
            del = true;
            d = 1400;
        }
        else if (del && c === 0) {
            del = false;
            w = (w + 1) % words.length;
            d = 300;
        }

        setTimeout(type, d);

    })();
}

/* ========================================
   REVEAL ON SCROLL
======================================== */

if ('IntersectionObserver' in window) {

    const io = new IntersectionObserver(es => {

        es.forEach(e => {

            if (e.isIntersecting) {
                e.target.classList.add('in');
                io.unobserve(e.target);
            }

        });

    }, { threshold: 0.15 });

    $$('[data-reveal]').forEach(el => {
        reduce ? el.classList.add('in') : io.observe(el);
    });

} else {
    $$('[data-reveal]').forEach(el => el.classList.add('in'));
}

/* ========================================
   ANIMATED COUNTERS
======================================== */

if ('IntersectionObserver' in window) {

    const co = new IntersectionObserver(es => {

        es.forEach(e => {

            if (!e.isIntersecting) return;

            co.unobserve(e.target);

            const el = e.target;
            const end = +el.dataset.count;
            const start = performance.now();

            (function tick(now) {

                const p = Math.min((now - start) / 1400, 1);

                el.textContent =
                    Math.round(end * (1 - Math.pow(1 - p, 3))) +
                    (el.dataset.suffix || '');

                if (p < 1) {
                    requestAnimationFrame(tick);
                }

            })(start);

        });

    }, { threshold: 0.6 });

    $$('[data-count]').forEach(el => co.observe(el));

}

/* ========================================
   TECH TICKER
======================================== */

const track = $('.track');

if (track && !track.dataset.duplicated) {
    track.innerHTML += track.innerHTML;
    track.dataset.duplicated = 'true';
}

/* ========================================
   BUTTON RIPPLE EFFECT
======================================== */

$$('.btn').forEach(b => {

    b.addEventListener('click', e => {

        const r = b.getBoundingClientRect();
        const s = document.createElement('span');

        s.className = 'ripple';
        s.style.left = e.clientX - r.left + 'px';
        s.style.top = e.clientY - r.top + 'px';

        b.appendChild(s);

        setTimeout(() => s.remove(), 600);

    });

});

/* ========================================
   MOUSE INTERACTIONS (DESKTOP ONLY)
======================================== */

if (fine && !reduce) {

    /* Custom cursor with trailing ring */

    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');

    if (dot && ring) {

        let x = 0, y = 0, rx = 0, ry = 0;

        addEventListener('mousemove', e => {

            x = e.clientX;
            y = e.clientY;

            document.body.classList.add('has-cursor');

            dot.style.transform = `translate(${x}px, ${y}px)`;

        });

        (function loop() {

            rx += (x - rx) * 0.15;
            ry += (y - ry) * 0.15;

            ring.style.transform = `translate(${rx}px, ${ry}px)`;

            requestAnimationFrame(loop);

        })();

        document.addEventListener('mouseover', e => {
            ring.classList.toggle(
                'hover',
                !!e.target.closest('a, button')
            );
        });

    }

    /* Magnetic buttons */

    $$('[data-magnetic]').forEach(b => {

        b.addEventListener('mousemove', e => {

            const r = b.getBoundingClientRect();

            b.style.transform =
                `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;

        });

        b.addEventListener('mouseleave', () => {
            b.style.transform = '';
        });

    });

    /* Hero spotlight + depth parallax */

    const home = $('.home');
    const depth = $$('[data-depth]');

    if (home) {

        home.addEventListener('mousemove', e => {

            const r = home.getBoundingClientRect();

            home.style.setProperty('--mx', e.clientX - r.left + 'px');
            home.style.setProperty('--my', e.clientY - r.top + 'px');

            const nx = e.clientX / innerWidth - 0.5;
            const ny = e.clientY / innerHeight - 0.5;

            depth.forEach(el => {

                const d = +el.dataset.depth;

                el.style.translate =
                    `${-nx * d}px ${-ny * d}px`;

            });

        });

    }

    /* 3D tilt + glare on profile card */

    const stage = $('.home-image');
    const card = $('.profile-card');

    if (stage && card) {

        stage.addEventListener('mousemove', e => {

            const r = stage.getBoundingClientRect();

            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;

            card.style.transform =
                `rotateY(${(px - 0.5) * 16}deg) rotateX(${(0.5 - py) * 16}deg)`;

            card.style.setProperty('--gx', px * 100 + '%');
            card.style.setProperty('--gy', py * 100 + '%');

        });

        stage.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });

    }

}
