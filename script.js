/* -------------------------------------------------------------
   INTERACTIVE JAVASCRIPT FOR DHARMIK GAJJAR'S PORTFOLIO
   ------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. LIGHT / DARK THEME MANAGER ---
    const themeToggleBtn = document.getElementById("theme-toggle");
    const body = document.body;

    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark-theme";
    body.className = savedTheme;

    themeToggleBtn.addEventListener("click", () => {
        if (body.classList.contains("dark-theme")) {
            body.classList.replace("dark-theme", "light-theme");
            localStorage.setItem("portfolio-theme", "light-theme");
        } else {
            body.classList.replace("light-theme", "dark-theme");
            localStorage.setItem("portfolio-theme", "dark-theme");
        }
        // Redraw canvas with theme-appropriate colors
        initCanvasColors();
    });


    // --- 2. HTML5 CANVAS: CODING / NEURAL NETWORK BACKGROUND ---
    const canvas = document.getElementById("coding-bg");
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    let particleColor = "";
    let lineColor = "";
    const maxParticles = 60;

    // Set colors depending on theme
    function initCanvasColors() {
        if (body.classList.contains("dark-theme")) {
            particleColor = "rgba(0, 242, 254, 0.4)";
            lineColor = "rgba(0, 242, 254, 0.08)";
        } else {
            particleColor = "rgba(37, 99, 235, 0.3)";
            lineColor = "rgba(37, 99, 235, 0.05)";
        }
    }
    initCanvasColors();

    // Track mouse position
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle Object Blueprint
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce on boundaries
            if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

            // Mouse proximity repulsion
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (mouse.radius - distance) / mouse.radius;
                    this.x += forceDirectionX * force * 1.5;
                    this.y += forceDirectionY * force * 1.5;
                }
            }
        }

        draw() {
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Populate particles
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < maxParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    // Draw lines between nearby particles
    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx*dx + dy*dy);

                if (distance < 150) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Canvas Animation Loop
    function animateBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateBackground);
    }
    animateBackground();


    // --- 3. HERO TYPEWRITER EFFECT ---
    const typewriterText = document.getElementById("typewriter-text");
    const phrases = [
        "intelligent AI models.",
        "scalable web applications.",
        "interactive mobile designs.",
        "intelligent system solutions."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
        const currentPhrase = phrases[wordIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 40;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeDelay = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % phrases.length;
            typeDelay = 400; // Pause before typing next word
        }

        setTimeout(type, typeDelay);
    }
    setTimeout(type, 1000);


    // --- 4. INTERACTIVE TERMINAL WIDGET ---
    const terminalInput = document.getElementById("terminal-input");
    const terminalBody = document.getElementById("terminal-body");

    // Static resume data formatted for terminal output
    const terminalCommands = {
        help: `
            <span class="text-accent">Available Commands:</span><br>
            - <span class="text-info">bio</span>       : Summary about Dharmik<br>
            - <span class="text-info">skills</span>    : Technical skill listings<br>
            - <span class="text-info">education</span> : Educational background<br>
            - <span class="text-info">projects</span>  : Key portfolio projects<br>
            - <span class="text-info">contact</span>   : E-mail, phone & social link values<br>
            - <span class="text-info">clear</span>     : Flush terminal logs
        `,
        bio: `
            <span class="text-accent">Dharmik Gajjar - Bio Summary</span><br>
            --------------------------------------------<br>
            I am a dynamic second-year B.Tech CSE (AI/ML) student at GSFC University.
            Passionate about coding, AI meal plan engines, databases, and cross-platform UI engineering.
            I focus on turning raw data parameters into structured backend scripts and sleek visuals.
        `,
        skills: `
            <span class="text-accent">Technical Skills & Tools:</span><br>
            --------------------------------------------<br>
            • <span class="text-info">Languages</span>     : Java, Python, C++, HTML5, CSS3, JS (ES6+), PHP, SQL<br>
            • <span class="text-info">Backend/DBs</span>   : Django, NodeJS, MySQL, MongoDB, Firebase<br>
            • <span class="text-info">Frontend/Apps</span> : ReactJS, AngularJS, Flutter, Java Swing (GUI)<br>
            • <span class="text-info">AI Tech</span>       : Gemini API integrations, Prompt Engineering<br>
            • <span class="text-info">Dev Tools</span>     : VS Code, GitHub, Postman
        `,
        education: `
            <span class="text-accent">Education Timeline:</span><br>
            --------------------------------------------<br>
            • <span class="text-info">B.Tech (Computer Science - AI/ML)</span> | 2024 - 2027 (Ongoing)<br>
              GSFC University, Vadodara, Gujarat<br>
            • <span class="text-info">Diploma (Computer Science)</span> | 2019 - 2022 (Completed)<br>
              Parul University, Vadodara, Gujarat (CGPA: 7.29/10)
        `,
        projects: `
            <span class="text-accent">Key Projects Showcase:</span><br>
            --------------------------------------------<br>
            1. <span class="text-info">AI Meal-Planner</span> (MEAN stack + Gemini API)<br>
               Generates personalized healthy meal recommendations and matches image outputs.<br>
            2. <span class="text-info">Campus Navigation System</span> (Java, Swing, Flutter, Python)<br>
               GPS locations routing maps tool matching administrators coordinates to mobile clients.<br>
            3. <span class="text-info">Blood Bank Management</span> (PHP, Java, MySQL)<br>
               Clinic donor records catalog, donor availability request slots.
        `,
        contact: `
            <span class="text-accent">Direct Contact Channels:</span><br>
            --------------------------------------------<br>
            • Email    : <a href="mailto:dharmikrgajjar088@gmail.com" class="text-info">dharmikrgajjar088@gmail.com</a><br>
            • Phone    : +91 83470-28187<br>
            • Location : Vadodara, Gujarat, India<br>
            • LinkedIn : <a href="https://www.linkedin.com/in/dharmik-r-gajjar-14110325p" target="_blank" class="text-info">linkedin.com/in/dharmik-r-gajjar-14110325p</a><br>
            • GitHub   : <a href="https://github.com/Dharmik-1403" target="_blank" class="text-info">github.com/Dharmik-1403</a>
        `
    };

    // Auto-focus terminal input when clicking the terminal widget
    document.querySelector(".terminal-wrapper").addEventListener("click", () => {
        terminalInput.focus();
    });

    terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const rawCmd = terminalInput.value.trim();
            const cmd = rawCmd.toLowerCase();
            terminalInput.value = "";

            // Write user command line to screen
            const cmdLine = document.createElement("div");
            cmdLine.className = "terminal-line text-info";
            cmdLine.innerHTML = `<span class="terminal-prompt">guest@dharmik-portfolio:~$</span> <span>${rawCmd}</span>`;
            terminalBody.insertBefore(cmdLine, terminalInput.parentElement);

            // Command response
            if (cmd === "clear") {
                // Clear all terminal lines except welcome comments and input prompt
                const lines = Array.from(terminalBody.children);
                lines.forEach(line => {
                    if (line !== terminalInput.parentElement && !line.classList.contains("text-comment")) {
                        line.remove();
                    }
                });
            } else if (cmd !== "") {
                const outputLine = document.createElement("div");
                outputLine.className = "terminal-output";

                if (terminalCommands.hasOwnProperty(cmd)) {
                    outputLine.innerHTML = terminalCommands[cmd];
                } else {
                    outputLine.innerHTML = `<span style="color:#ef4444">Command not found: '${rawCmd}'. Type 'help' to see list of valid instructions.</span>`;
                }

                terminalBody.insertBefore(outputLine, terminalInput.parentElement);
            }

            // Scroll body to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });


    // --- 5. RESUME DOWNLOAD dropdown ---
    const cvDropdownBtn = document.getElementById("download-cv-btn");
    const cvDropdownMenu = document.getElementById("resume-dropdown-menu");

    cvDropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        cvDropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        cvDropdownMenu.classList.remove("show");
    });

    // Generate Markdown CV for direct download
    document.getElementById("download-md-cv").addEventListener("click", (e) => {
        e.preventDefault();
        const markdownContent = `# Dharmik Gajjar - Curriculum Vitae
        
**Title**: B.Tech CSE Student (AI-ML Specialized)
**Email**: dharmikrgajjar088@gmail.com
**Phone**: +91 83470-28187
**Location**: Vadodara, Gujarat, India - 390012
**LinkedIn**: https://www.linkedin.com/in/dharmik-r-gajjar-14110325p
**GitHub**: https://github.com/Dharmik-1403

---

## Professional Summary
I am Dharmik Gajjar, a dynamic and ambitious 2nd-year B.Tech Computer Science and Engineering student at GSFC University, with a core specialization in Artificial Intelligence and Machine Learning (AI/ML). I am passionate about utilizing data to solve complex problems and build intelligent systems.

---

## Technical Skills
* **Languages**: Java, Python, C++, HTML5, CSS3, JavaScript, PHP, SQL
* **Backend & DB**: Django, NodeJS, MySQL, MongoDB, Firebase
* **Frontend**: ReactJS, AngularJS, Flutter, Java Swing GUI
* **AI Tech**: Gemini API, Prompt Engineering, ChatGPT
* **Developer Tools**: VS Code, GitHub, Postman

---

## Projects
### 1. AI Meal-Planner (MEAN Stack + Gemini API)
* AI-driven meal planning generator with customized schedules matching nutritional targets.
* Integrates multimodal Gemini API features to fetch and render meal image graphics.
* **My Contribution**: Built core API server routes, handled data persistence structures inside MongoDB, and debugged REST endpoint connectivity.

### 2. Campus Navigation System (Java Swing + Flutter + Python)
* GPS navigation and mapping system featuring route directions around a campus.
* **My Contribution**: Developed mobile screens via Flutter (Google Maps SDK integration), coded distance calculations backend logic in Python, and synchronized credentials through Firebase DB.

### 3. Blood Bank Management System (PHP + Java + MySQL)
* Clinic dashboard tracking donor availability data, matching patient request slots.
* **My Contribution**: Programmed the frontend layout forms, optimized database filters, and secured queries against injection.

---

## Education
* **GSFC University, Vadodara** | B.Tech CSE (AI/ML Specialized) - 2024 - 2027 (Ongoing Study)
* **Parul University, Vadodara** | Diploma in Computer Science & Engineering - 2019 - 2022 (CGPA: 7.29/10)

---

## Certifications
* Python Developer Certification (AWS & Cloud Deployment)
* Networking Basics (TCP/IP Protocols, Router Configs)
* AI Security & Threat Analysis Fundamentals
* Hackathon Innovation & Problem Solving
* Personality & Leadership Development Skills
`;

        downloadFile(markdownContent, "Dharmik_Gajjar_Resume.md", "text/markdown");
    });

    // Generate Plain Text CV for download
    document.getElementById("download-txt-cv").addEventListener("click", (e) => {
        e.preventDefault();
        const textContent = `DHARMIK GAJJAR - RESUME
========================================
Contact:
- Location: Vadodara, Gujarat - 390012
- Phone: +91 83470-28187
- Email: dharmikrgajjar088@gmail.com
- LinkedIn: www.linkedin.com/in/dharmik-r-gajjar-14110325p
- GitHub: github.com/Dharmik-1403

SUMMARY:
I am Dharmik Gajjar, a dynamic and ambitious 2nd-year B.Tech Computer Science and Engineering student at GSFC University, specializing in AI/ML.

TECHNICAL SKILLS:
- Languages: Java, Python, C++, HTML, CSS, JavaScript, PHP, SQL
- Backend/DB: Django, NodeJS, MySQL, MongoDB, Firebase
- Mobile/Frontend: ReactJS, AngularJS, Flutter, Java Swing (GUI)
- AI Tools: Gemini API, ChatGPT, Copilot, Blackbox AI
- Tools: VS Code, GitHub

PROJECTS:
1. AI Meal-Planner (AngularJS, NodeJS, Gemini API, MongoDB)
   - Created full-stack meal generation engine, with image lookups.
   - Built backend API endpoints, configured database schemas, and resolved communication errors.
2. Campus Navigation System (Java Swing, Flutter, Python, Firebase, MySQL)
   - Designed real-time GPS routes navigation markers database.
   - Programmed Flutter mapping UI, built route calculation services, and synchronized authentication.
3. Blood Bank Management System (Java, PHP, MySQL, CSS)
   - Built donor database matching patient request systems.
   - Programmed logic files and secured MySQL database queries.

EDUCATION:
- B.Tech (Computer Science - AI/ML) | GSFC University | 2024 - 2027 (Current Study)
- Diploma (Computer Science) | Parul University | 2019 - 2022 (CGPA: 7.29/10)

CERTIFICATIONS:
- Python Course (Cloud, AWS Services, Deployment)
- Networking Basics (TCP/IP Protocols, Routing)
- AI Learning (Cybersecurity Fundamentals, Data Protection)
- Hackathons (Problem Solving, Prototyping)
- Personality Development (Leadership, Presentation)
`;

        downloadFile(textContent, "Dharmik_Gajjar_Resume.txt", "text/plain");
    });

    // Helper file download logic
    function downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }


    // --- 6. PROJECTS FILTER LOGIC ---
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons, add to current
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const categories = card.getAttribute("data-category").split(" ");
                if (filterValue === "all" || categories.includes(filterValue)) {
                    card.style.display = "flex";
                    // Brief delay to allow CSS transitions to trigger
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    // Wait for fadeout animation before hiding
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });

            // Scroll to projects section top smoothly to align grid when a category is selected
            const projectsSec = document.getElementById("projects");
            if (projectsSec) {
                projectsSec.scrollIntoView({ behavior: "smooth" });
            }
        });
    });


    // --- 7. DETAILS MODALS MANAGEMENT ---
    const modalButtons = document.querySelectorAll(".open-project-modal");
    const closeButtons = document.querySelectorAll(".modal-close");
    const modals = document.querySelectorAll(".modal");
    const projectCardsList = document.querySelectorAll(".project-card");

    // Make the entire project card clickable to directly open details
    projectCardsList.forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener("click", (e) => {
            // Ignore modal trigger if clicking inside other interactive items
            if (e.target.closest(".open-project-modal") || e.target.closest("a") || e.target.closest("button")) {
                return;
            }
            const btn = card.querySelector(".open-project-modal");
            if (btn) {
                const project = btn.getAttribute("data-project");
                const targetModal = document.getElementById(`modal-${project}`);
                if (targetModal) {
                    targetModal.classList.add("show");
                    body.style.overflow = "hidden"; // Freeze scroll
                }
            }
        });
    });

    modalButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const project = btn.getAttribute("data-project");
            const targetModal = document.getElementById(`modal-${project}`);
            if (targetModal) {
                targetModal.classList.add("show");
                body.style.overflow = "hidden"; // Freeze scroll
            }
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const project = btn.getAttribute("data-close");
            const targetModal = document.getElementById(`modal-${project}`);
            if (targetModal) {
                targetModal.classList.remove("show");
                body.style.overflow = ""; // Restore scroll
            }
        });
    });

    // Close modal by clicking backdrop overlay
    modals.forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("show");
                body.style.overflow = "";
            }
        });
    });


    // --- 8. COPY TO CLIPBOARD HANDLERS ---
    const copyButtons = document.querySelectorAll(".btn-copy");
    const toast = document.getElementById("toast");

    copyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const copyText = btn.getAttribute("data-copy");
            navigator.clipboard.writeText(copyText).then(() => {
                // Show custom toast notification
                toast.classList.add("show");
                setTimeout(() => {
                    toast.classList.remove("show");
                }, 2000);
            }).catch(err => {
                console.error("Could not copy text: ", err);
            });
        });
    });


    // --- 9. CONTACT FORM HANDLER ---
    const contactForm = document.getElementById("contact-form");
    const formSuccessModal = document.getElementById("modal-form-success");
    const closeSuccessBtn = document.getElementById("btn-success-close");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Extract input values
            const name = document.getElementById("form-name").value;
            const email = document.getElementById("form-email").value;
            const subject = document.getElementById("form-subject").value;
            const message = document.getElementById("form-message").value;

            // Log details (simulates sending database email triggers)
            console.log("Contact Form Submission Logged:");
            console.log(`From: ${name} (${email})`);
            console.log(`Subject: ${subject}`);
            console.log(`Content: ${message}`);

            // Reset the fields
            contactForm.reset();

            // Trigger success screen overlay
            formSuccessModal.classList.add("show");
            body.style.overflow = "hidden";
        });
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener("click", () => {
            formSuccessModal.classList.remove("show");
            body.style.overflow = "";
        });
    }


    // --- 10. BACK TO TOP BUTTON CONTROL ---
    const backToTopBtn = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    // --- 11. NAVIGATION SCROLL TRACKING & MOBILE TOGGLE ---
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    // Scroll active indicator listener
    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            const sectionHeight = sec.clientHeight;
            // Subtract small header offset
            if (window.scrollY >= (sectionTop - 120)) {
                currentSectionId = sec.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    // Mobile hamburger menu controls
    mobileMenuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        const isOpen = navMenu.classList.contains("active");
        
        // Toggle hamburger / close icons
        const openIcon = mobileMenuToggle.querySelector(".menu-open");
        const closeIcon = mobileMenuToggle.querySelector(".menu-close");

        if (isOpen) {
            openIcon.style.display = "none";
            closeIcon.style.display = "block";
            body.style.overflow = "hidden";
        } else {
            openIcon.style.display = "block";
            closeIcon.style.display = "none";
            body.style.overflow = "";
        }
    });

    // Collapse mobile menu clicking nav links
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            mobileMenuToggle.querySelector(".menu-open").style.display = "block";
            mobileMenuToggle.querySelector(".menu-close").style.display = "none";
            body.style.overflow = "";
        });
    });
});
