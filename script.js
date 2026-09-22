(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-button");
  const siteNav = document.querySelector("#site-nav");
  const navLinks = document.querySelectorAll("#site-nav a");
  const yearElement = document.querySelector("#year");
  const revealElements = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  function setMenuState(open) {
    if (!menuButton || !siteNav) return;

    menuButton.setAttribute("aria-expanded", String(open));
    siteNav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  }

  if (menuButton && siteNav) {
    menuButton.addEventListener("click", () => {
      const currentlyOpen = menuButton.getAttribute("aria-expanded") === "true";
      setMenuState(!currentlyOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuState(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080) setMenuState(false);
    });
  }

  if (reduceMotion) {
    revealElements.forEach((element) => element.classList.add("revealed"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("revealed"));
  }

  const header = document.querySelector(".site-header");

  if (header) {
    let ticking = false;

    function updateHeader() {
      const scrolled = window.scrollY > 18;
      header.style.background = scrolled ? "rgba(244, 241, 233, 0.94)" : "transparent";
      header.style.backdropFilter = scrolled ? "blur(14px)" : "none";
      header.style.webkitBackdropFilter = scrolled ? "blur(14px)" : "none";
      header.style.position = scrolled ? "sticky" : "relative";
      header.style.top = scrolled ? "0" : "auto";
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateHeader();
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const destination = document.querySelector(href);
      if (!destination) return;

      event.preventDefault();

      const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
      const destinationTop = destination.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: destinationTop,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  });
})();