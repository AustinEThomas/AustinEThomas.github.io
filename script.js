const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const header = document.querySelector(".site-header");
const backToTop = document.getElementById("backToTop");
const currentYear = document.getElementById("currentYear");
const navigationLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");

// Set the current year automatically.
currentYear.textContent = new Date().getFullYear();

// Open and close the mobile navigation.
menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuButton.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
});

// Close the mobile menu after a navigation link is selected.
navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    });
});

// Add header styling and show the back-to-top button while scrolling.
window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;

    header.classList.toggle("scrolled", scrollPosition > 20);
    backToTop.classList.toggle("visible", scrollPosition > 500);

    updateActiveNavigation();
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Highlight the current navigation section.
function updateActiveNavigation() {
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionBottom
        ) {
            navigationLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${sectionId}`
                );
            });
        }
    });
}

// Add subtle reveal animations to major page elements.
const revealElements = document.querySelectorAll(
    ".skill-card, .project-card, .experience-card, .about-copy, .contact-links"
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

async function loadSiteData() {
    try {
        const response = await fetch("data/site-data.json");

        if (!response.ok) {
            throw new Error(`Failed to load site data: ${response.status}`);
        }

        const data = await response.json();

        updateSiteStats(data.stats);
        renderProjects(data.projects);
    } catch (error) {
        console.error(error);

        updateSiteStats({
            powerBiDashboards: "6+",
            databaseTables: "20+",
            pythonStreamlitApps: "8+"
        });
    }
}

loadSiteData();

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

// Run once when the page first loads.
updateActiveNavigation();
