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

function initializeRevealAnimations(parent = document) {
    const revealElements = parent.querySelectorAll(
        ".skill-card, .project-card, .experience-card, .about-copy, .contact-links"
    );

    revealElements.forEach((element) => {
        if (element.dataset.revealInitialized === "true") {
            return;
        }

        element.dataset.revealInitialized = "true";
        element.classList.add("reveal");
        revealObserver.observe(element);
    });
}

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

        updateSiteStats([
            {
                value: "6+",
                label: "Power BI Dashboards"
            },
            {
                value: "20+",
                label: "Database Tables"
            },
            {
                value: "8+",
                label: "Python & Streamlit Apps"
            }
        ]);
    }
}

function updateSiteStats(stats) {
    const heroStats = document.getElementById("heroStats");

    if (!heroStats) {
        return;
    }

    if (!Array.isArray(stats) || stats.length === 0) {
        heroStats.innerHTML = "";
        return;
    }

    heroStats.innerHTML = stats
        .map((stat) => {
            return `
                <div>
                    <strong>${escapeHtml(stat.value || "")}</strong>
                    <span>${escapeHtml(stat.label || "")}</span>
                </div>
            `;
        })
        .join("");
}

function renderProjects(projects) {
    const projectsGrid = document.getElementById("projectsGrid");

    if (!projectsGrid) {
        return;
    }

    if (!Array.isArray(projects) || projects.length === 0) {
        projectsGrid.innerHTML = `
            <p class="projects-empty">
                No projects are currently available.
            </p>
        `;

        return;
    }

    projectsGrid.innerHTML = projects
        .map((project) => createProjectCard(project))
        .join("");

    initializeRevealAnimations(projectsGrid);
}

function createProjectCard(project) {
    const tags = Array.isArray(project.tags)
        ? project.tags
            .map((tag) => `<span>${escapeHtml(tag)}</span>`)
            .join("")
        : "";

    const projectLink = project.link
        ? `
            <a
                href="${escapeAttribute(project.link)}"
                target="_blank"
                rel="noopener noreferrer"
                class="project-link"
            >
                ${escapeHtml(project.linkText || "View Project →")}
            </a>
        `
        : "";

    return `
        <article class="project-card">
            ${createProjectPreview(project)}

            <div class="project-content">
                <p class="project-type">
                    ${escapeHtml(project.type || "")}
                </p>

                <h3>${escapeHtml(project.title || "")}</h3>

                <p>
                    ${escapeHtml(project.description || "")}
                </p>

                <div class="project-tags">
                    ${tags}
                </div>

                ${projectLink}
            </div>
        </article>
    `;
}

function createProjectPreview(project) {
    const previewClass =
        project.previewClass || "preview-one";

    const previewLabel = project.previewLabel
        ? `<span>${escapeHtml(project.previewLabel)}</span>`
        : "";

    switch (project.previewType) {
        case "image":
            return createImagePreview(project, previewClass);
            
        case "image-gallery":
            return createImageGalleryPreview(project, previewClass);
            
        case "pipeline":
            return createPipelinePreview(
                project,
                previewClass,
                previewLabel
            );

        case "app-window":
            return `
                <div class="project-preview ${escapeAttribute(previewClass)}">
                    ${previewLabel}

                    <div class="app-window">
                        <div class="app-sidebar"></div>

                        <div class="app-content">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
            `;

        case "mini-dashboard":
            return `
                <div class="project-preview ${escapeAttribute(previewClass)}">
                    ${previewLabel}

                    <div class="mini-dashboard">
                        <div class="mini-kpi"></div>
                        <div class="mini-kpi"></div>
                        <div class="mini-kpi"></div>
                        <div class="mini-chart"></div>
                    </div>
                </div>
            `;

        default:
            return `
                <div class="project-preview ${escapeAttribute(previewClass)}">
                    ${previewLabel}
                </div>
            `;
    }
}

function createImagePreview(project, previewClass) {
    if (!project.image) {
        return `
            <div class="project-preview ${escapeAttribute(previewClass)}">
            </div>
        `;
    }

    return `
        <div class="project-preview ${escapeAttribute(previewClass)}">
            <img
                src="${escapeAttribute(project.image)}"
                alt="${escapeAttribute(project.imageAlt || project.title || "Project preview")}"
                class="project-preview-image"
                loading="lazy"
            >
        </div>
    `;
}

function createImageGalleryPreview(project, previewClass) {
    const images = Array.isArray(project.images)
        ? project.images.slice(0, 2)
        : [];

    if (images.length === 0) {
        return `
            <div class="project-preview ${escapeAttribute(previewClass)}">
            </div>
        `;
    }

    const galleryItems = images
        .map((image) => {
            return `
                <div class="project-gallery-item">
                    <img
                        src="${escapeAttribute(image.src || "")}"
                        alt="${escapeAttribute(
                            image.alt || project.title || "Project preview"
                        )}"
                        loading="lazy"
                    >
                </div>
            `;
        })
        .join("");

    return `
        <div class="project-preview project-preview-gallery ${escapeAttribute(previewClass)}">
            <div class="project-gallery">
                ${galleryItems}
            </div>
        </div>
    `;
}

function createPipelinePreview(
    project,
    previewClass,
    previewLabel
) {
    const steps = Array.isArray(project.pipelineSteps)
        ? project.pipelineSteps
        : [];

    const pipelineHtml = steps
        .map((step, index) => {
            const arrow = index < steps.length - 1
                ? "<span>→</span>"
                : "";

            return `
                <div>${escapeHtml(step)}</div>
                ${arrow}
            `;
        })
        .join("");

    return `
        <div class="project-preview ${escapeAttribute(previewClass)}">
            ${previewLabel}

            <div class="pipeline">
                ${pipelineHtml}
            </div>
        </div>
    `;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

loadSiteData();

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

// Run once when the page first loads.
initializeRevealAnimations();
loadSiteData();
updateActiveNavigation();
