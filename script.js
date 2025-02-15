/**
 * Mobile Menu Initialization
 * Handles the mobile menu toggle functionality and overlay
 */
const initMobileMenu = () => {
  // Get DOM elements
  const bar = document.querySelector(".bar-icon");
  const menu = document.querySelector(".menu");
  const overlay = document.querySelector(".overlay");
  const closeBar = document.querySelector(".X-icon");

  // Toggle menu open/close
  const toggleMenu = () => {
    menu.classList.toggle("open");
    overlay.classList.toggle("overlay-open");
  };

  // Close menu function
  const closeMenu = () => {
    menu.classList.remove("open");
    overlay.classList.remove("overlay-open");
  };

  // Event listeners for menu interactions
  bar.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);
  closeBar.addEventListener("click", closeMenu);
};

/**
 * Logo Slider Animation
 * Creates an infinite scrolling animation for logos
 * Uses RequestAnimationFrame for smooth performance
 */
const initLogoSlider = () => {
  const logosContainer = document.getElementById("logos");
  if (!logosContainer) return;

  // Clone logos once and store length
  const originalContent = logosContainer.innerHTML;
  logosContainer.innerHTML = originalContent + originalContent;
  const halfWidth = logosContainer.scrollWidth / 2;

  let scrollAmount = 0;
  let rafId;
  let isAnimating = false;

  const scrollLogos = () => {
    if (!isAnimating) return;

    scrollAmount -= 1;
    logosContainer.style.transform = `translateX(${scrollAmount}px)`;
    if (Math.abs(scrollAmount) >= halfWidth) scrollAmount = 0;

    rafId = requestAnimationFrame(scrollLogos);
  };

  const startAnimation = () => {
    if (isAnimating) return;
    isAnimating = true;
    scrollLogos();
  };

  const stopAnimation = () => {
    isAnimating = false;
    cancelAnimationFrame(rafId);
  };

  document.addEventListener("visibilitychange", () =>
    document.hidden ? stopAnimation() : startAnimation()
  );

  startAnimation();
};

/**
 * FAQ Section Initialization
 * Handles accordion-style FAQ functionality with animations
 * Uses event delegation for better performance
 */
const initFAQ = () => {
  const faqSection = document.querySelector(".faq-section");
  if (!faqSection) return;

  faqSection.addEventListener("click", (e) => {
    const question = e.target.closest(".faq-question");
    if (!question) return;

    const answer = question.nextElementSibling;
    const icon = question.querySelector(".toggle-icon");

    // Close other open answers (accordion functionality)
    document.querySelectorAll(".faq-answer.open").forEach((openAnswer) => {
      if (openAnswer !== answer) {
        openAnswer.style.maxHeight = null;
        openAnswer.classList.remove("open");
        openAnswer.previousElementSibling.querySelector(
          ".toggle-icon"
        ).style.transform = "rotate(0deg)";
      }
    });

    // Toggle current answer
    const isOpen = answer.style.maxHeight;
    answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
    answer.classList.toggle("open");
    icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(-45deg)";
  });
};

/**
 * Scroll Animations
 * Implements scroll-based animations using IntersectionObserver
 * Efficiently handles multiple animation types for different elements
 */
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -20px 0px",
  };

  const animationMap = {
    "services-card": "slide-up",
    "faq-item": "slide-right",
    "testemonial-item": "slide-up",
    "bloge-item": "slide-left",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".services-card, .dream div, .faq-item, .testemonial-item, .bloge-item"
    )
    .forEach((element, index) => {
      const elementClass = [...element.classList].find(
        (cls) => animationMap[cls]
      );
      const animationType = animationMap[elementClass] || "scale";

      element.classList.add(
        "fade-in-hidden",
        animationType,
        `delay-${(index % 5) + 1}`
      );
      observer.observe(element);
    });
};

/**
 * Gallery Filter Initialization
 * Implements filtering functionality for the image gallery
 * Includes smooth animations for filter transitions
 */
const initGalleryFilter = () => {
  const filterButtons = document.querySelectorAll(".filter");
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (!filterButtons.length || !galleryItems.length) return;

  // Add animation styles to document
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes fadeIn {
      0% { opacity: 0; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(styleSheet);

  // Filter gallery items function
  const filterGallery = (filterValue) => {
    galleryItems.forEach((item) => {
      const show =
        filterValue === "all" || item.dataset.category === filterValue;
      item.style.display = show ? "block" : "none";
      if (show) item.style.animation = "fadeIn 0.5s ease forwards";
    });
  };

  // Event delegation for filter buttons
  const buttonContainer = filterButtons[0].parentElement;
  buttonContainer.addEventListener("click", (e) => {
    const button = e.target.closest(".filter");
    if (!button) return;

    // Update active state and filter
    filterButtons.forEach((btn) => btn.classList.remove("filter-active"));
    button.classList.add("filter-active");
    filterGallery(button.dataset.filter);
  });
};

/**
 * Initialize all functionality when DOM is ready
 * Ensures all elements are available before running scripts
 */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initLogoSlider();
  initFAQ();
  initScrollAnimations();
  initGalleryFilter();
});

// end
function animateProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar:not(.visible)");
  const threshold = window.innerHeight - 100;

  progressBars.forEach((bar) => {
    if (bar.getBoundingClientRect().top < threshold) {
      bar.classList.add("visible");
      const fill = bar.querySelector(".fill");
      const text = bar.querySelector(".progress-text");
      const targetValue = parseInt(bar.dataset.width);

      fill.style.width = `${targetValue}%`;
      text.style.opacity = 1;

      let count = 0;
      const animateCount = () => {
        text.textContent = `${count}%`;
        if (count < targetValue) {
          count++;
          requestAnimationFrame(animateCount);
        }
      };
      animateCount();
    }
  });
}

// Throttle scroll event for better performance
let scrollTimeout;
document.addEventListener("scroll", () => {
  if (scrollTimeout) return;
  scrollTimeout = setTimeout(() => {
    animateProgressBars();
    scrollTimeout = null;
  }, 50);
});

// Contact form validation
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let name = document.getElementById("name");
    let phone = document.getElementById("phone");
    let email = document.getElementById("email");
    let message = document.getElementById("message");
    let terms = document.getElementById("terms");

    let isNameValid = validateInput(name, /.+/, "Name is required");
    let isPhoneValid = validateInput(
      phone,
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid phone number"
    );
    let isEmailValid = validateInput(
      email,
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
      "Please enter a valid email address"
    );
    let isMessageValid = validateInput(message, /.+/, "Message is required");

    if (!terms.checked) {
      const errorDisplay =
        terms.nextElementSibling || document.createElement("span");
      errorDisplay.className = "error-message";
      errorDisplay.textContent = "Please accept the terms";
      errorDisplay.style.display = "block";
      if (!terms.nextElementSibling) {
        terms.parentNode.insertBefore(errorDisplay, terms.nextSibling);
      }
    }

    // ... rest of the code ...
  });
}

// Simplified member page handling
const memberHandler = {
  initIndex() {
    document
      .querySelectorAll(".about-card-img-container")
      .forEach((box, idx) => {
        box.addEventListener("click", () => {
          localStorage.setItem(
            "selectedImage",
            `Images/Member/members_photo_${idx + 1}.jpg`
          );
        });
      });
  },

  initMemberPage() {
    const profileImg = document.querySelector(".member-details-profile-img");
    if (profileImg) {
      const selectedImage = localStorage.getItem("selectedImage");
      if (selectedImage) profileImg.setAttribute("src", selectedImage);
    }
  },
};

document.querySelector(".about-card-container")
  ? memberHandler.initIndex()
  : memberHandler.initMemberPage();
