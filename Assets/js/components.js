
async function loadComponents() {
    try {
        // Load Header
        const headerResponse = await fetch("./Components/header.html");

        if (!headerResponse.ok) {
            throw new Error("Unable to load header.html");
        }

        const headerHTML = await headerResponse.text();

        document.getElementById("header-placeholder").innerHTML = headerHTML;

        // Initialize header after inserting HTML
        if (typeof initializeHeader === "function") {
            initializeHeader();
        }

        // Active Navigation
        const currentPage = location.pathname.split("/").pop() || "index.html";

        document.querySelectorAll(".navbar a").forEach(link => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
            }
        });

        // Load Footer
        const footerResponse = await fetch("./Components/footer.html");

        if (!footerResponse.ok) {
            throw new Error("Unable to load footer.html");
        }

        const footerHTML = await footerResponse.text();

        document.getElementById("footer-placeholder").innerHTML = footerHTML;

        console.log("Components loaded successfully!");

    } catch (error) {
        console.error("Error loading components:", error);
    }
}

loadComponents();
