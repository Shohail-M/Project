/**
 * Global Configuration
 */
const CONFIG = {
  animations: {
    scroll: {
      threshold: 0.2,
      margin: "0px 0px -20px 0px",
      speed: 1,
    },
    progress: {
      threshold: 0.5,
      interval: 15,
    },
  },
  selectors: {
    menu: {
      bar: ".bar-icon",
      menu: ".menu",
      overlay: ".overlay",
      close: ".X-icon",
    },
    animations: {
      elements:
        ".services-card, .dream div, .faq-item, .testemonial-item, .bloge-item",
      progress: ".progress-bar",
    },
    gallery: {
      filters: ".filter",
      items: ".gallery-item",
    },
    forms: {
      contact: "#contactForm",
      newsletter: ".newsletter-form",
    },
  },
  validation: {
    patterns: {
      name: { regex: /.+/, message: "Name is required" },
      phone: {
        regex: /^\+?[1-9]\d{1,14}$/,
        message: "Please enter a valid phone number",
      },
      email: {
        regex: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
        message: "Please enter a valid email address",
      },
      message: { regex: /.+/, message: "Message is required" },
    },
  },
};

/**
 * Utility Functions
 */
const Utils = {
  /**
   * Safely query DOM elements
   */
  dom: {
    get: (selector) => document.querySelector(selector),
    getAll: (selector) => document.querySelectorAll(selector),
    create: (tag, className) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      return element;
    },
  },

  /**
   * Animation utilities
   */
  animation: {
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    requestFrame: (callback) => {
      let rafId;
      const animate = () => {
        callback();
        rafId = requestAnimationFrame(animate);
      };
      animate();
      return () => cancelAnimationFrame(rafId);
    },
  },
};

/**
 * Mobile Menu Controller
 */
class MobileMenuController {
  constructor() {
    this.elements = {
      bar: Utils.dom.get(CONFIG.selectors.menu.bar),
      menu: Utils.dom.get(CONFIG.selectors.menu.menu),
      overlay: Utils.dom.get(CONFIG.selectors.menu.overlay),
      closeBar: Utils.dom.get(CONFIG.selectors.menu.close),
    };

    if (Object.values(this.elements).some((el) => !el)) return;
    this.initEventListeners();
  }

  initEventListeners() {
    this.elements.bar.addEventListener("click", () => this.toggleMenu());
    this.elements.overlay.addEventListener("click", () => this.closeMenu());
    this.elements.closeBar.addEventListener("click", () => this.closeMenu());
  }

  toggleMenu() {
    this.elements.menu.classList.toggle("open");
    this.elements.overlay.classList.toggle("overlay-open");
  }

  closeMenu() {
    this.elements.menu.classList.remove("open");
    this.elements.overlay.classList.remove("overlay-open");
  }
}

/**
 * Logo Slider Controller
 */
class LogoSliderController {
  constructor() {
    this.container = Utils.dom.get("#logos");
    if (!this.container) return;

    this.scrollAmount = 0;
    this.stopAnimation = null;
    this.init();
  }

  init() {
    this.container.innerHTML += this.container.innerHTML;
    this.startAnimation();
    this.handleVisibilityChange();
  }

  startAnimation() {
    this.stopAnimation = Utils.animation.requestFrame(() => {
      this.scrollAmount -= CONFIG.animations.scroll.speed;
      this.container.style.transform = `translateX(${this.scrollAmount}px)`;

      if (Math.abs(this.scrollAmount) >= this.container.scrollWidth / 2) {
        this.scrollAmount = 0;
      }
    });
  }

  handleVisibilityChange() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stopAnimation?.();
      } else {
        this.startAnimation();
      }
    });
  }
}

/**
 * Scroll Animation Controller
 */
class ScrollAnimationController {
  constructor() {
    this.observer = this.createObserver();
    this.initAnimations();
  }

  createObserver() {
    return new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: CONFIG.animations.scroll.threshold,
        rootMargin: CONFIG.animations.scroll.margin,
      }
    );
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-visible");
        this.observer.unobserve(entry.target);
      }
    });
  }

  initAnimations() {
    Utils.dom
      .getAll(CONFIG.selectors.animations.elements)
      .forEach((element, index) => {
        const animationType = this.getAnimationType(element);
        element.classList.add(
          "fade-in-hidden",
          animationType,
          `delay-${(index % 5) + 1}`
        );
        this.observer.observe(element);
      });
  }

  getAnimationType(element) {
    const classMap = {
      "services-card": "slide-up",
      "faq-item": "slide-right",
      "testemonial-item": "slide-up",
      "bloge-item": "slide-left",
    };

    return (
      Object.entries(classMap).find(([className]) =>
        element.classList.contains(className)
      )?.[1] || "scale"
    );
  }
}

/**
 * Form Validation Controller
 */
class FormValidationController {
  constructor() {
    this.form = Utils.dom.get(CONFIG.selectors.forms.contact);
    if (!this.form) return;

    this.initFormValidation();
  }

  initFormValidation() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.initInputValidation();
  }

  initInputValidation() {
    Object.keys(CONFIG.validation.patterns).forEach((field) => {
      const input = Utils.dom.get(`#${field}`);
      if (input) {
        input.addEventListener(
          "input",
          Utils.animation.debounce(() => {
            this.validateInput(input, CONFIG.validation.patterns[field]);
          }, 300)
        );
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const isValid = Object.entries(CONFIG.validation.patterns).every(
      ([field, pattern]) => {
        const input = Utils.dom.get(`#${field}`);
        return input ? this.validateInput(input, pattern) : true;
      }
    );

    if (isValid) {
      this.submitForm();
    }
  }

  validateInput(input, { regex, message }) {
    const isValid = regex.test(input.value);
    this.toggleError(input, !isValid, message);
    return isValid;
  }

  toggleError(input, show, message) {
    let errorDisplay = input.nextElementSibling;

    if (!errorDisplay?.classList.contains("error-message")) {
      errorDisplay = Utils.dom.create("span", "error-message");
      input.parentNode.insertBefore(errorDisplay, input.nextSibling);
    }

    errorDisplay.textContent = message;
    errorDisplay.style.display = show ? "block" : "none";
  }

  async submitForm() {
    try {
      const formData = new FormData(this.form);
      // Add form submission logic here
      console.log("Form submitted:", Object.fromEntries(formData));
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }
}

/**
 * Progress Bar Controller
 */
class ProgressBarController {
  constructor() {
    this.observer = this.createObserver();
    this.initProgressBars();
  }

  createObserver() {
    return new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: CONFIG.animations.progress.threshold }
    );
  }

  initProgressBars() {
    Utils.dom.getAll(CONFIG.selectors.animations.progress).forEach((bar) => {
      this.observer.observe(bar);
    });
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.animateProgressBar(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  animateProgressBar(bar) {
    const fill = bar.querySelector(".fill");
    const text = bar.querySelector(".progress-text");
    const targetValue = parseInt(bar.dataset.width);

    fill.style.width = `${targetValue}%`;
    text.style.opacity = 1;

    let count = 0;
    const increment = targetValue > 50 ? 2 : 1;
    const interval = setInterval(() => {
      if (count >= targetValue) {
        text.textContent = `${targetValue}%`;
        clearInterval(interval);
      } else {
        count += increment;
        text.textContent = `${count}%`;
      }
    }, CONFIG.animations.progress.interval);
  }
}

/**
 * Initialize all controllers when DOM is ready
 */
document.addEventListener("DOMContentLoaded", () => {
  new MobileMenuController();
  new LogoSliderController();
  new ScrollAnimationController();
  new FormValidationController();
  new ProgressBarController();
});

// Handle reduced motion preference
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.style.setProperty(
    "--transition-duration",
    "0.001ms"
  );
}
