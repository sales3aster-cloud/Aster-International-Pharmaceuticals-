const toggleButton = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");
const yearEl = document.getElementById("year");
const contactForm = document.querySelector(".contact-form");
const newsletterForm = document.querySelector(".newsletter-form");
const filterChips = document.querySelectorAll(".filter-chip");
const productCards = document.querySelectorAll(".product-card");
const counterItems = document.querySelectorAll(".count-up");
const productSearch = document.getElementById("product-search");
const visibleProductCount = document.getElementById("visible-product-count");

if (toggleButton && navLinks) {
  toggleButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggleButton.setAttribute("aria-expanded", "false");
    });
  });
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const countUp = (element) => {
  const target = Number(element.dataset.target || 0);
  const duration = 1200;
  const startTime = performance.now();

  const frame = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const currentValue = Math.floor(progress * target);
    element.textContent = `${currentValue}+`;
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      element.textContent = `${target}+`;
    }
  };

  requestAnimationFrame(frame);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");

      if (entry.target.classList.contains("count-up") && !entry.target.dataset.counted) {
        entry.target.dataset.counted = "true";
        countUp(entry.target);
      }

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 50, 400)}ms`;
  observer.observe(item);
});

counterItems.forEach((item) => observer.observe(item));

const updateCatalog = () => {
  const activeChip = document.querySelector(".filter-chip.active");
  const activeFilter = activeChip ? activeChip.dataset.filter : "all";
  const searchValue = productSearch ? productSearch.value.trim().toLowerCase() : "";
  let visibleCount = 0;

  productCards.forEach((card) => {
    const category = card.dataset.category;
    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const matchesSearch = card.textContent.toLowerCase().includes(searchValue);
    const shouldShow = matchesFilter && matchesSearch;
    card.classList.toggle("hidden", !shouldShow);
    if (shouldShow) {
      visibleCount += 1;
    }
  });

  if (visibleProductCount) {
    visibleProductCount.textContent = String(visibleCount);
  }
};

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((button) => button.classList.remove("active"));
    chip.classList.add("active");
    updateCatalog();
  });
});

if (productSearch) {
  productSearch.addEventListener("input", updateCatalog);
}

updateCatalog();

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector("button[type='submit']");
    const originalLabel = submitButton.textContent;
    submitButton.textContent = "Inquiry Sent";
    submitButton.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      submitButton.textContent = originalLabel;
      submitButton.disabled = false;
    }, 1800);
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = newsletterForm.querySelector("input");
    const button = newsletterForm.querySelector("button");
    const originalLabel = button.textContent;
    button.textContent = "Added";
    button.disabled = true;

    setTimeout(() => {
      input.value = "";
      button.textContent = originalLabel;
      button.disabled = false;
    }, 1500);
  });
}
