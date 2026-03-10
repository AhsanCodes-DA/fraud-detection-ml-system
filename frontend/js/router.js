document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".section");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const target = button.dataset.section;

            /* Hide all sections */
            sections.forEach(section =>
                section.classList.remove("active-section")
            );

            /* Show selected */
            document.getElementById(target)
                .classList.add("active-section");

            /* Update active button */
            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");
        });
    });
});