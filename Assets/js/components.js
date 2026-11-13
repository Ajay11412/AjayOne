
async function loadComponents() {

    try {

        // Load Header
        const headerResponse = await fetch("./Components/header.html");
        const headerHTML = await headerResponse.text();

        document.getElementById("header-placeholder").innerHTML = headerHTML;

        // Load Footer
        const footerResponse = await fetch("./Components/footer.html");
        const footerHTML = await footerResponse.text();

        document.getElementById("footer-placeholder").innerHTML = footerHTML;

        // Active Navigation
        const currentPage = location.pathname.split("/").pop() || "index.html";

        document.querySelectorAll(".navbar a").forEach(link => {

            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
            }

        });

        console.log("Components loaded successfully!");

    } catch (error) {

        console.error("Error loading components:", error);

    }

}

loadComponents();
