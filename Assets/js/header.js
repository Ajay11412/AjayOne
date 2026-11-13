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