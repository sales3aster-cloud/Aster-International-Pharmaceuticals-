const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const yearNodes = document.querySelectorAll("[data-year]");
const counterItems = document.querySelectorAll(".count-up");
const filterChips = document.querySelectorAll(".filter-chip");
const productCards = document.querySelectorAll(".product-card");
const productSearch = document.getElementById("product-search");
const visibleProductCount = document.getElementById("visible-product-count");
const contactForms = document.querySelectorAll(".contact-form");
const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dot");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

yearNodes.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

if (heroSlides.length && heroDots.length) {
  let currentSlide = 0;

  const showSlide = (index) => {
    heroSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === index);
    });

    heroDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });

    currentSlide = index;
  };

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  setInterval(() => {
    const nextSlide = (currentSlide + 1) % heroSlides.length;
    showSlide(nextSlide);
  }, 4500);
}

const countUp = (element) => {
  const target = Number(element.dataset.target || 0);
  const startTime = performance.now();
  const duration = 1200;

  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    element.textContent = `${value}+`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = `${target}+`;
    }
  };

  requestAnimationFrame(update);
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
  item.style.transitionDelay = `${Math.min(index * 45, 250)}ms`;
  observer.observe(item);
});

counterItems.forEach((item) => observer.observe(item));

const updateCatalog = () => {
  if (!productCards.length) {
    return;
  }

  const activeChip = document.querySelector(".filter-chip.active");
  const activeFilter = activeChip ? activeChip.dataset.filter : "all";
  const searchValue = productSearch ? productSearch.value.trim().toLowerCase() : "";
  let visibleCount = 0;

  productCards.forEach((card) => {
    const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
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

contactForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = form.querySelector("button[type='submit']");
    const originalLabel = submitButton.textContent;
    submitButton.textContent = "Inquiry Sent";
    submitButton.disabled = true;

    setTimeout(() => {
      form.reset();
      submitButton.textContent = originalLabel;
      submitButton.disabled = false;
    }, 1600);
  });
});
