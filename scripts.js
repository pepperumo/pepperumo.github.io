/**
 * Main JavaScript file for Peppe's Portfolio
 * Features:
 * - Smooth scrolling
 * - Dark mode toggle
 * - Mobile menu control
 * - Form validation
 * - Active section highlighting
 * - Fade-in animations
 */

document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const themeToggle = document.querySelector(".theme-toggle");
    const body = document.body;
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const contactForm = document.getElementById("contact-form");
    
    // Initialize state from localStorage
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
            updateThemeIcon();
        });

        // Set correct icon based on theme
        function updateThemeIcon() {
            if (body.classList.contains("dark-mode")) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
        
        // Initialize theme icon
        updateThemeIcon();
    }

    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            
            // Update button icon
            const isActive = navLinks.classList.contains("active");
            mobileMenuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking a link
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // Smooth scrolling for within-page navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Adjust for header height
                    behavior: "smooth"
                });
            }
        });
    });

    // Contact form validation
    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");
            let isValid = true;
            
            // Reset previous error messages
            document.querySelectorAll(".error-message").forEach(el => el.remove());
            
            // Validate name
            if (nameInput.value.trim() === "") {
                showError(nameInput, "Name is required");
                isValid = false;
            }
            
            // Validate email
            if (emailInput.value.trim() === "") {
                showError(emailInput, "Email is required");
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, "Please enter a valid email address");
                isValid = false;
            }
            
            // Validate message
            if (messageInput.value.trim() === "") {
                showError(messageInput, "Message is required");
                isValid = false;
            }
            
            // If form is valid, show success message and reset form
            if (isValid) {
                const successMessage = document.createElement("div");
                successMessage.className = "success-message";
                successMessage.innerText = "Message sent successfully!";
                contactForm.appendChild(successMessage);
                contactForm.reset();
                
                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            }
        });
        
        function showError(input, message) {
            const errorMessage = document.createElement("div");
            errorMessage.className = "error-message";
            errorMessage.innerText = message;
            input.parentElement.appendChild(errorMessage);
            input.classList.add("error");
            
            // Remove error styling when input changes
            input.addEventListener("input", function() {
                this.classList.remove("error");
                const error = this.parentElement.querySelector(".error-message");
                if (error) error.remove();
            });
        }
        
        function isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }
    }

    // Highlight active section in navigation
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-links a");
    
    window.addEventListener("scroll", () => {
        let current = "";
        const offset = window.innerHeight * 0.3;
        
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (pageYOffset >= sectionTop - offset && pageYOffset < sectionTop + sectionHeight - offset) {
                current = section.getAttribute("id");
            }
        });
        
        navItems.forEach((item) => {
            item.classList.remove("active");
            if (current && item.getAttribute("href") === `#${current}`) {
                item.classList.add("active");
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Target elements to animate
    document.querySelectorAll(".animate-on-scroll").forEach((element) => {
        element.classList.add("hidden");
        observer.observe(element);
    });

    // Add animation classes to main elements if they don't already have them
    sections.forEach(section => {
        if (!section.classList.contains("animate-on-scroll")) {
            section.classList.add("animate-on-scroll", "hidden");
            observer.observe(section);
        }
    });
});