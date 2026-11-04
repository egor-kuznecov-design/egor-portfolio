"use strict";

// Год обновляется автоматически. В HTML есть запасное значение без JavaScript.
document.querySelectorAll("[data-year]").forEach(element => {
  element.textContent = new Date().getFullYear();
});

// Мобильная навигация остаётся открытой, если JavaScript отключён.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const mobileScreen = window.matchMedia("(max-width: 640px)");

function closeMenu(returnFocus = false) {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.querySelector("span").textContent = "+";
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  navigation.classList.toggle("is-open", !isOpen);
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.querySelector("span").textContent = isOpen ? "+" : "−";
});
navigation.addEventListener("click", event => {
  const link = event.target.closest("a");
  if (!link) return;
  closeMenu();
  // После перехода фокус находится в выбранном разделе, а не в скрытом меню.
  if (mobileScreen.matches) {
    const section = document.querySelector(link.getAttribute("href"));
    section.setAttribute("tabindex", "-1");
    section.focus({ preventScroll: true });
  }
});
document.addEventListener("click", event => {
  if (!event.target.closest(".header")) closeMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") closeMenu(true);
});
mobileScreen.addEventListener("change", () => closeMenu());
document.documentElement.classList.add("menu-ready");

// Ссылки на реальные изображения работают и без модального окна / JavaScript.
const viewer = document.querySelector("#viewer");
const viewerImage = document.querySelector("#viewer-image");
const viewerTitle = document.querySelector("#viewer-title");
const counter = document.querySelector("#image-counter");
const previousButton = document.querySelector("#previous-image");
const nextButton = document.querySelector("#next-image");
const closeButton = document.querySelector("#close-viewer");
const viewerHint = document.querySelector("#viewer-hint");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mouseDescriptions = [
  "Чёрная PRO X Superlight 2 — главная карточка",
  "Чёрная мышь — оптический сенсор и точность",
  "Белая PRO X Superlight 2 — главная карточка",
  "Белая мышь — беспроводная работа и зарядка",
  "Белая мышь — переключатели и скольжение",
  "Белая мышь — оптический сенсор и точность",
  "Чёрная мышь — беспроводная работа и зарядка",
  "Чёрная мышь — переключатели и скольжение"
];
// Каждая презентация — отдельный проект. Слайды сохранены локально в WebP.
const presentationSlides = {
  kvartal: ["Обложка: районная кофейня", "Позиционирование кофейни", "Гость и его день", "Продуктовая архитектура", "Экономика заказа", "Повторные визиты", "План развития", "Условия масштабирования", "Решение к старту"],
  tishe: ["Обложка: акустический свет", "Два слоя комфорта", "Архитектура предмета", "Материал крупным планом", "Линейка светильников", "Проектная спецификация", "Подбор для интерьера", "Материальная палитра", "Коллекция акустического света"],
  sdvig: ["Обложка: фестиваль графического дизайна", "Кураторская идея", "Программа фестиваля", "Ритм события", "Визуальный код", "Типографическая система", "Городская кампания", "Носители", "Дизайн меняет точку зрения"]
};
let images = [];
let imageIndex = 0;
let sourceCard = null;
let pointerStartedOnBackdrop = false;
let imageAnimation = null;

function showImage() {
  const image = images[imageIndex];
  viewerImage.alt = image.alt;
  viewerImage.src = image.src;
  viewerImage.classList.toggle("portrait", sourceCard.dataset.gallery === "mouse");
  viewerImage.classList.toggle("slide", Object.hasOwn(presentationSlides, sourceCard.dataset.gallery));
  counter.textContent = images.length > 1 ? `${imageIndex + 1} / ${images.length}` : "";
  previousButton.hidden = nextButton.hidden = images.length < 2;
  viewer.scrollTop = 0;
}
function changeImage(step) {
  imageIndex = (imageIndex + step + images.length) % images.length;
  showImage();
}

if (typeof viewer.showModal === "function") {
  document.querySelectorAll("[data-gallery]").forEach(card => {
    card.addEventListener("click", event => {
      // Сохраняем обычное поведение Ctrl / Cmd + клик по ссылке.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      sourceCard = card;
      imageIndex = 0;
      const gallery = card.dataset.gallery;
      if (gallery === "mouse") {
        images = mouseDescriptions.map((alt, index) => ({ src: `assets/images/mouse-${index + 1}.${index === 2 ? "png" : "jpg"}`, alt }));
      } else if (Object.hasOwn(presentationSlides, gallery)) {
        images = presentationSlides[gallery].map((alt, index) => ({ src: `assets/images/${gallery}-${index + 1}.webp`, alt: `${card.dataset.title}. Слайд ${index + 1}: ${alt}` }));
      } else {
        images = [{ src: card.getAttribute("href"), alt: `Полный макет. ${card.querySelector("img").alt}` }];
      }
      viewerHint.textContent = images.length > 1
        ? "Перелистывайте кнопками или стрелками клавиатуры. Escape — закрыть."
        : "Прокрутите, чтобы увидеть изображение целиком. Escape — закрыть.";
      viewerTitle.textContent = card.dataset.title;
      showImage();
      viewer.showModal();
      document.body.classList.add("viewer-open");
      closeButton.focus();
    });
  });
}
previousButton.addEventListener("click", () => changeImage(-1));
nextButton.addEventListener("click", () => changeImage(1));
closeButton.addEventListener("click", () => viewer.close());
viewer.addEventListener("keydown", event => {
  // Замыкаем Tab на кнопках окна, включая случай с одной кнопкой закрытия.
  if (event.key === "Tab") {
    const controls = [...viewer.querySelectorAll("button:not([hidden])")];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  if (images.length > 1 && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
    changeImage(event.key === "ArrowRight" ? 1 : -1);
  }
  // Escape обрабатывается самим элементом dialog.
});
viewer.addEventListener("pointerdown", event => {
  pointerStartedOnBackdrop = event.target === viewer;
});
viewer.addEventListener("click", event => {
  if (event.target === viewer && pointerStartedOnBackdrop) viewer.close();
});
viewer.addEventListener("close", () => {
  imageAnimation?.cancel();
  document.body.classList.remove("viewer-open");
  sourceCard?.focus({ preventScroll: true });
  viewerImage.removeAttribute("src");
});
viewerImage.addEventListener("load", () => {
  imageAnimation?.cancel();
  if (viewer.open && !reducedMotion.matches && typeof viewerImage.animate === "function") {
    imageAnimation = viewerImage.animate([{ opacity: .65 }, { opacity: 1 }], { duration: 220, easing: "ease-out" });
  }
});

// Системная настройка отключает движение, даже если её изменили при открытом сайте.
function updateMotionPreference() {
  document.documentElement.classList.toggle("motion-ready", !reducedMotion.matches);
  if (reducedMotion.matches) imageAnimation?.cancel();
}
updateMotionPreference();
reducedMotion.addEventListener("change", updateMotionPreference);

// Небольшое появление секций. При отключённой анимации всё сразу видно.
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll("[data-reveal]").forEach(section => {
    observer.observe(section);
    section.classList.add("reveal-pending");
  });
}

