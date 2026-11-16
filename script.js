
(() => {
  "use strict";

  const workView = document.getElementById("v-work");
  const infoView = document.getElementById("v-info");
  const navLinks = document.querySelectorAll(".pill a");
  const progress = document.querySelector(".page-progress");
  const header = document.querySelector(".top");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ==========================================
  // NAVIGATION
  // ==========================================

  function route() {
    const requested = (window.location.hash || "#work").slice(1);
    const page = requested === "info" ? "info" : "work";

    workView.classList.toggle("on", page === "work");
    infoView.classList.toggle("on", page === "info");

    navLinks.forEach((link) => {
      if (link.dataset.v === page) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });

    requestAnimationFrame(updateScrollUI);
    observeReveals();
  }

  // ==========================================
  // SCROLL PROGRESS & HEADER
  // ==========================================

  function updateScrollUI() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const ratio =
      scrollable > 0 ? window.scrollY / scrollable : 0;

    if (progress) {
      progress.style.width = `${Math.min(
        100,
        Math.max(0, ratio * 100)
      )}%`;
    }

    if (header) {
      header.classList.toggle(
        "is-scrolled",
        window.scrollY > 18
      );
    }

    const scrollHint = document.querySelector(".scroll-hint");
    if (scrollHint) {
      if (window.scrollY > 20) {
        scrollHint.style.opacity = "0";
        scrollHint.style.pointerEvents = "none";
      } else {
        scrollHint.style.opacity = "";
        scrollHint.style.pointerEvents = "";
      }
    }
  }

  // ==========================================
  // SCROLL REVEAL ANIMATION
  // ==========================================

  let revealObserver;

  function observeReveals() {
    if (revealObserver) {
      revealObserver.disconnect();
    }

    const targets = document.querySelectorAll(
      ".projects-section .card, " +
      ".about-hero, " +
      ".two, " +
      ".exp, " +
      ".sec, " +
      "footer"
    );

    targets.forEach((element) => {
      element.classList.add("reveal");
    });

    // Disable animation if user prefers reduced motion
    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      targets.forEach((element) => {
        element.classList.add("is-visible");
      });

      return;
    }

    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -45px 0px"
      }
    );

    targets.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================

  window.addEventListener("hashchange", route);

  window.addEventListener(
    "scroll",
    updateScrollUI,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateScrollUI
  );

  const scrollHint = document.querySelector(".scroll-hint");
  if (scrollHint) {
    scrollHint.addEventListener("click", () => {
      const projects = document.querySelector(".projects-section");
      if (projects) {
        projects.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  document.documentElement.classList.add("js-ready");

  route();
  updateScrollUI();

})();
