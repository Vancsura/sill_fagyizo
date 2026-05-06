const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 },
);

document
  .querySelectorAll(".fade-in-up, .about-visual, .about-content")
  .forEach((el) => observer.observe(el));

const locationCards = document.querySelectorAll(".location-card");

const locationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.typed) {
        entry.target.dataset.typed = "true";
        const delay = parseInt(entry.target.dataset.delay) || 0;

        setTimeout(() => {
          entry.target.classList.add("visible");
          const targets = entry.target.querySelectorAll(".typing-target");
          targets.forEach((el, i) => {
            setTimeout(() => typeText(el, el.dataset.text), i * 400);
          });
        }, delay);
      }
    });
  },
  { threshold: 0.3 },
);

locationCards.forEach((card) => locationObserver.observe(card));

function typeText(el, text) {
  el.textContent = "";
  el.classList.add("typing-cursor");
  let i = 0;
  const speed = Math.max(25, 60 - text.length * 0.5);
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      el.classList.remove("typing-cursor");
    }
  }, speed);
}

const flavorSlider = document.querySelector(".flavors-slider");
const flavorTrack = document.querySelector(".flavors-track");

let currentTranslate = 0;
let targetTranslate = 0;
let animationFrame = null;

function isMobile() {
  return window.innerWidth <= 768;
}

function clampTranslate(value) {
  const sliderWidth = flavorSlider.offsetWidth;
  const trackWidth = flavorTrack.scrollWidth;

  const minTranslate = Math.min(0, sliderWidth - trackWidth);
  const maxTranslate = 0;

  if (value > maxTranslate) return maxTranslate;
  if (value < minTranslate) return minTranslate;

  return value;
}

function setSliderPosition() {
  flavorTrack.style.transform = `translateX(${currentTranslate}px)`;
}

function animateSlider() {
  const diff = targetTranslate - currentTranslate;

  if (Math.abs(diff) < 0.5) {
    currentTranslate = targetTranslate;
    setSliderPosition();
    animationFrame = null;
    return;
  }

  currentTranslate += diff * 0.08;
  setSliderPosition();

  animationFrame = requestAnimationFrame(animateSlider);
}

if (flavorSlider && flavorTrack) {
  flavorSlider.addEventListener("mousemove", (e) => {
    if (isMobile()) return;

    const rect = flavorSlider.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percent = mouseX / rect.width;

    const sliderWidth = flavorSlider.offsetWidth;
    const trackWidth = flavorTrack.scrollWidth;
    const maxScroll = Math.max(0, trackWidth - sliderWidth);

    targetTranslate = -(maxScroll * percent);
    targetTranslate = clampTranslate(targetTranslate);

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(animateSlider);
    }
  });

  window.addEventListener("resize", () => {
    if (isMobile()) {
      currentTranslate = 0;
      targetTranslate = 0;
      flavorTrack.style.transform = "none";
      return;
    }

    currentTranslate = clampTranslate(currentTranslate);
    targetTranslate = clampTranslate(targetTranslate);
    setSliderPosition();
  });
}

const aboutGrid = document.getElementById("aboutGrid");

function animateNumbers() {
  const numbers = document.querySelectorAll(".stat .n");

  numbers.forEach((el) => {
    const target = +el.dataset.target;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = Math.round(progress * target);

      el.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + (target >= 10 ? "+" : "");
      }
    }

    requestAnimationFrame(update);
  });
}

if (aboutGrid) {
  new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          aboutGrid.classList.add("visible");

          // csak egyszer fusson le
          animateNumbers();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.25 },
  ).observe(aboutGrid);
}

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}
