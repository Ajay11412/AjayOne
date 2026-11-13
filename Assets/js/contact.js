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

