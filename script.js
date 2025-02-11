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

  // Clone logos for infinite scroll effect
  logosContainer.innerHTML += logosContainer.innerHTML;

  let scrollAmount = 0;
  let rafId; // Store RAF ID for cleanup

  // Animation function
  const scrollLogos = () => {
    scrollAmount -= 1; // Scroll speed
    logosContainer.style.transform = `translateX(${scrollAmount}px)`;

    // Reset position when reaching halfway
    if (Math.abs(scrollAmount) >= logosContainer.scrollWidth / 2) {
      scrollAmount = 0;
    }
    rafId = requestAnimationFrame(scrollLogos);
  };

  // Start the animation
  scrollLogos();

  // Pause animation when page is not visible (performance optimization)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      scrollLogos();
    }
  });
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
  // Observer configuration
  const observerOptions = {
    threshold: 0.2, // Trigger when 20% of element is visible
    rootMargin: "0px 0px -20px 0px",
  };

  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-visible");
        observer.unobserve(entry.target); // Stop observing after animation
      }
    });
  }, observerOptions);

  // Select all elements to animate
  const elementsToAnimate = document.querySelectorAll(
    ".services-card, .dream div, .faq-item, .testemonial-item, .bloge-item"
  );

  // Apply animations to elements
  elementsToAnimate.forEach((element, index) => {
    let animationType = "scale";

    // Determine animation type based on element class
    const classList = element.classList;
    if (classList.contains("services-card")) {
      animationType = "slide-up";
    } else if (classList.contains("faq-item")) {
      animationType = "slide-right";
    } else if (classList.contains("testemonial-item")) {
      animationType = "slide-up";
    } else if (classList.contains("bloge-item")) {
      animationType = "slide-left";
    }

    // Add animation classes with staggered delays
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
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      bar.classList.add("visible");
      const fill = bar.querySelector(".fill");
      const text = bar.querySelector(".progress-text");
      const targetValue = parseInt(bar.getAttribute("data-width"));
      fill.style.width = targetValue + "%";
      text.style.opacity = 1;
      let count = 0;
      const interval = setInterval(() => {
        if (count >= targetValue) {
          text.textContent = targetValue + "%";
          clearInterval(interval);
        } else {
          count++;
          text.textContent = count + "%";
        }
      }, 15);
    }
  });
}

document.addEventListener("scroll", animateProgressBars);
document.addEventListener("DOMContentLoaded", animateProgressBars);
