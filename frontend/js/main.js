/* Sidebar Collapse System                    */


const toggleBtn = document.getElementById("toggleSidebar");

const sidebar = document.getElementById("sidebar");

if (toggleBtn) {

    toggleBtn.addEventListener("click", () => {

        sidebar.classList.toggle("collapsed");

    });

}