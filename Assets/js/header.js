
document.addEventListener("click", function (event) {

    const menuBtn = event.target.closest("#menu-btn");
    const navbar = document.getElementById("navbar");
    const button = document.getElementById("menu-btn");

    if (!navbar || !button) return;

    const icon = button.querySelector("i");

    // Hamburger button click
    if (menuBtn) {
        const isOpen = navbar.classList.toggle("show");

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }

        button.setAttribute("aria-expanded", String(isOpen));
        return;
    }

    // Navigation link click
    if (event.target.closest("#navbar a")) {
        navbar.classList.remove("show");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

        button.setAttribute("aria-expanded", "false");
        return;
    }

    // Click outside menu
    if (!navbar.contains(event.target)) {
        navbar.classList.remove("show");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

        button.setAttribute("aria-expanded", "false");
    }
});
