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
const viewerSlide = document.querySelector("#viewer-slide");
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
// Три самостоятельных концепта для портфолио. Формулировки не выдают их за реальные клиентские запуски.
const presentationDecks = {
  kvartal: [
    { theme: "kvartal", layout: "cover", eyebrow: "Бренд-платформа · запуск", title: "Кофейня, в которую удобно возвращаться", intro: "Квартал — концепция районного места на стыке быстрого кофе и спокойной паузы.", image: "quartal-space", alt: "Светлый интерьер небольшой районной кофейни", stamp: "Авторский концепт · 2026" },
    { theme: "kvartal", layout: "split-right", eyebrow: "01 · Задача", title: "Стать частью повседневного маршрута", intro: "Один формат должен работать в разном ритме дня: быстро утром, спокойно днём, привычно после работы.", image: "quartal-space", alt: "Зал районной кофейни с тёплой деревянной отделкой", items: [{label:"Утро",text:"Короткий заказ по пути и понятная выдача."},{label:"День",text:"Удобная пауза рядом с домом или работой."},{label:"Вечер",text:"Неформальная встреча в знакомом месте."}] },
    { theme: "kvartal", layout: "statement", eyebrow: "02 · Позиционирование", title: "Место между домом и маршрутом", intro: "Не просто точка с кофе, а локальный ритуал: легко зайти, легко выбрать, приятно задержаться.", image: "quartal-touchpoint", alt: "Кофейный напиток и выпечка для гостя кофейни", items: [{label:"Обещание",text:"Хороший кофе и тёплый приём без лишнего церемониала."},{label:"Характер",text:"Соседский, спокойный, открытый."}] },
    { theme: "kvartal", layout: "cards", eyebrow: "03 · Предложение", title: "Меню строится вокруг повода визита", intro: "Архитектура предложения помогает быстро сориентироваться и собрать заказ под разный темп.", image: "quartal-touchpoint", alt: "Кофе и выпечка на столе в кафе", items: [{label:"Кофе",text:"Эспрессо-классика и альтернативные способы."},{label:"Еда",text:"Компактная линейка завтраков и выпечки."},{label:"С собой",text:"Упаковка и комбо для маршрута."},{label:"На месте",text:"Позиции для неспешной паузы."}] },
    { theme: "kvartal", layout: "split-left", eyebrow: "04 · Визуальная система", title: "Тепло в деталях, ясность в навигации", intro: "Айдентика опирается на спокойную типографику, натуральные материалы и заметные акценты на носителях.", image: "quartal-space", alt: "Тёплая деревянная стойка и мебель кофейни", items: [{label:"Среда",text:"Дерево, матовые поверхности и локальные источники света."},{label:"Носители",text:"Меню, стакан, упаковка и таблички."},{label:"Принцип",text:"Сначала читаемость и порядок выбора."}] },
    { theme: "kvartal", layout: "journey", eyebrow: "05 · Путь гостя", title: "Каждый шаг снимает одно сомнение", intro: "Сценарий посещения связывает коммуникацию, меню и обслуживание.", image: "quartal-touchpoint", alt: "Кофейный напиток как часть гостевого сценария", items: [{label:"До визита",text:"Понятно, где вход и что есть в меню."},{label:"Заказ",text:"Короткие названия и ясные варианты."},{label:"После",text:"Повод вернуться и простой способ оставить отзыв."}] },
    { theme: "kvartal", layout: "roadmap", eyebrow: "06 · План запуска", title: "Сначала подготовить, затем открыться, потом улучшать", intro: "Коммуникационный план привязан к реальным операционным шагам.", image: "quartal-space", alt: "Подготовленный зал небольшой кофейни", items: [{label:"До открытия",text:"Показать место, меню и команду."},{label:"Первая неделя",text:"Объяснить формат и собрать обратную связь."},{label:"Первый месяц",text:"Уточнить меню и сервис по наблюдениям."}] },
    { theme: "kvartal", layout: "split-right", eyebrow: "07 · Операционная готовность", title: "Обещание бренда должно выдерживать смену", intro: "Дизайн сервиса начинается с того, что команда может поддерживать каждый день.", image: "quartal-touchpoint", alt: "Готовый напиток и выпечка на столе", items: [{label:"Проверить",text:"Скорость выдачи в часы пик."},{label:"Согласовать",text:"Рецептуры, наличие и замену позиций."},{label:"Подготовить",text:"Сценарии приветствия, вопросов и обратной связи."}] },
    { theme: "kvartal", layout: "close", eyebrow: "08 · Следующий шаг", title: "Проверить гипотезу до масштабирования", intro: "Перед открытием нужно подтвердить локацию, экономику меню, пропускную способность и спрос на тестовом формате.", image: "quartal-space", alt: "Уютный зал районной кофейни", stamp: "Самостоятельный концепт · без клиентских метрик" }
  ],
  tishe: [
    { theme: "tishe", layout: "cover", eyebrow: "Продуктовая концепция · свет", title: "Свет, который помогает настроить тишину", intro: "Тише — направление коллекции светильников с мягким светом и акустической оболочкой.", image: "tishe-product", alt: "Подвесной светильник из акустического войлока в интерьере", stamp: "Авторский концепт · 2026" },
    { theme: "tishe", layout: "split-right", eyebrow: "01 · Задача продукта", title: "Соединить визуальный комфорт и акустику", intro: "Предмет должен выглядеть естественно в интерьере и давать проверяемую акустическую функцию.", image: "tishe-product", alt: "Войлочный подвесной светильник над столом", items: [{label:"Свет",text:"Мягкое распределение без резкого блика."},{label:"Материал",text:"Фактурная оболочка из акустического войлока."},{label:"Проверка",text:"Световые и акустические свойства подтверждаются испытаниями."}] },
    { theme: "tishe", layout: "statement", eyebrow: "02 · Принципы дизайна", title: "Тихая форма. Точная функция.", intro: "Силуэт не спорит с пространством, материалы остаются тактильными, а технические решения видны в спецификации.", image: "tishe-material", alt: "Крупный план войлочной поверхности светильника", items: [{label:"Пропорции",text:"Компактный объём с мягким контуром."},{label:"Свет",text:"Направленный вниз поток для рабочей поверхности."}] },
    { theme: "tishe", layout: "cards", eyebrow: "03 · Архитектура линейки", title: "Одна система — разные сценарии", intro: "Линейка концептуально собрана вокруг общей оболочки, креплений и отделок.", image: "tishe-product", alt: "Подвесной светильник в современной комнате", items: [{label:"Pendant",text:"Подвес над столом или островом."},{label:"Task",text:"Локальный свет для рабочего места."},{label:"Cluster",text:"Группа подвесов для общей зоны."},{label:"Finish",text:"Несколько оттенков войлока и металла."}] },
    { theme: "tishe", layout: "split-left", eyebrow: "04 · Материал и сборка", title: "Материал задаёт характер предмета", intro: "Сочетание войлока и металлических деталей должно быть убедительным и вблизи, и в спецификации.", image: "tishe-material", alt: "Фактура акустического войлока и металлический узел", items: [{label:"Оболочка",text:"Формованная войлочная деталь."},{label:"Каркас",text:"Тонкий металлический обод и подвес."},{label:"Уход",text:"Инструкция по очистке и замене компонентов."}] },
    { theme: "tishe", layout: "roadmap", eyebrow: "05 · Спецификация", title: "Технические вопросы до серийного образца", intro: "Значения в этой концепции не заявлены: их нужно получить на прототипе и зафиксировать в документации.", image: "tishe-product", alt: "Концепт подвесного светильника над столом", items: [{label:"Свет",text:"Поток, цветовая температура, индекс цветопередачи."},{label:"Безопасность",text:"Тепловой режим, драйвер, крепление и подвес."},{label:"Акустика",text:"Измерения эффективности оболочки в заданной конфигурации."}] },
    { theme: "tishe", layout: "journey", eyebrow: "06 · Сценарии применения", title: "Подбирать по задаче пространства", intro: "Подбор начинается не с цвета, а с функции зоны и условий монтажа.", image: "tishe-material", alt: "Материальная отделка светильника", items: [{label:"Дом",text:"Стол, кухня, место для чтения."},{label:"Работа",text:"Небольшие переговорные и индивидуальные зоны."},{label:"Гостеприимство",text:"Кафе и лаунж-зоны с проверкой требований проекта."}] },
    { theme: "tishe", layout: "split-right", eyebrow: "07 · Выход на рынок", title: "Помочь представить продукт до покупки", intro: "Запуск строится вокруг образцов, точной спецификации и визуализации в реальном масштабе.", image: "tishe-product", alt: "Светильник в интерьере для продуктовой презентации", items: [{label:"Сайт",text:"Конфигуратор отделки и понятный лист характеристик."},{label:"Продажи",text:"Образцы материалов и монтажная схема."},{label:"Контент",text:"Сценарии света без неподтверждённых обещаний."}] },
    { theme: "tishe", layout: "close", eyebrow: "08 · План разработки", title: "Прототипировать. Измерить. Уточнить.", intro: "Следующий этап: проверить свет, тепло, крепление, акустику и упаковку на физических образцах.", image: "tishe-material", alt: "Деталь поверхности акустического светильника", stamp: "Самостоятельный концепт · параметры требуют валидации" }
  ],
  sdvig: [
    { theme: "sdvig", layout: "cover", eyebrow: "Событие · визуальная система", title: "Фестиваль, который меняет угол зрения", intro: "Сдвиг — концепция фестиваля графического дизайна о том, как визуальная среда влияет на повседневность.", image: "sdvig-campaign", alt: "Синие и жёлтые афиши графического фестиваля в городском пространстве", stamp: "Авторский концепт · 2026" },
    { theme: "sdvig", layout: "split-right", eyebrow: "01 · Задача", title: "Собрать профессиональный разговор в открытое событие", intro: "Фестиваль должен быть полезен специалистам и понятен горожанам без специальной подготовки.", image: "sdvig-venue", alt: "Пространство дизайн-фестиваля с посетителями и графикой", items: [{label:"Для дизайнеров",text:"Разборы, новые подходы и разговор о практике."},{label:"Для студентов",text:"Доступ к портфолио-ревью и мастерским."},{label:"Для города",text:"Повод замечать графику вокруг себя."}] },
    { theme: "sdvig", layout: "statement", eyebrow: "02 · Кураторская идея", title: "Графика меняет привычное", intro: "Сдвиг показывает дизайн как инструмент наблюдения: от вывески и навигации до плаката и цифрового интерфейса.", image: "sdvig-campaign", alt: "Яркая городская афиша с геометрической графикой", items: [{label:"Тема",text:"Визуальная среда и её влияние на поведение."},{label:"Тон",text:"Любопытный, точный, доступный."}] },
    { theme: "sdvig", layout: "cards", eyebrow: "03 · Программа", title: "Форматы, в которых можно участвовать", intro: "Программа сочетает просмотр, практику и обмен опытом.", image: "sdvig-venue", alt: "Выставочное пространство с графическими материалами", items: [{label:"Лекции",text:"Идеи и профессиональные кейсы."},{label:"Мастерские",text:"Практическая работа с формой и сообщением."},{label:"Выставка",text:"Плакаты, навигация и цифровые проекты."},{label:"Портфолио-ревью",text:"Обратная связь для начинающих специалистов."}] },
    { theme: "sdvig", layout: "split-left", eyebrow: "04 · Визуальный код", title: "Сдвиг заметен с первого контакта", intro: "Контрастная типографика и крупные цветовые плоскости связывают городскую кампанию, площадку и digital.", image: "sdvig-campaign", alt: "Городская кампания фестиваля в синем и жёлтом цвете", items: [{label:"Палитра",text:"Синий, жёлтый, чёрный и нейтральная подложка."},{label:"Типографика",text:"Крупный заголовок и короткое сообщение."},{label:"Графика",text:"Модули, которые работают в серии носителей."}] },
    { theme: "sdvig", layout: "journey", eyebrow: "05 · Путь гостя", title: "От афиши до разговора после события", intro: "Коммуникация сопровождает человека до, во время и после фестиваля.", image: "sdvig-venue", alt: "Посетители знакомятся с фестивальной экспозицией", items: [{label:"Узнать",text:"Понять тему, дату, место и стоимость участия."},{label:"Прийти",text:"Найти вход, регистрацию и нужную зону."},{label:"Продолжить",text:"Получить материалы и контакты программы."}] },
    { theme: "sdvig", layout: "roadmap", eyebrow: "06 · Навигация и доступность", title: "Пространство должно быть понятно без подсказок", intro: "План площадки разрабатывается после выбора места и проверки доступности маршрутов.", image: "sdvig-venue", alt: "Зал мероприятия с посетителями и указателями", items: [{label:"Маршрут",text:"Вход, стойка, сцена, выставка и санитарные зоны."},{label:"Читаемость",text:"Контраст, крупный кегль и единые обозначения."},{label:"Доступность",text:"Проверить безбарьерный путь и место для отдыха."}] },
    { theme: "sdvig", layout: "split-right", eyebrow: "07 · Кампания", title: "Разложить одно сообщение по разным каналам", intro: "Медиаплан концепта опирается на партнёрские сообщества и городские точки контакта.", image: "sdvig-campaign", alt: "Постеры фестиваля на городской стене", items: [{label:"Город",text:"Афиши и площадки культурных партнёров."},{label:"Digital",text:"Анонсы, программа и напоминания."},{label:"Партнёры",text:"Пакет материалов для студий и учебных сообществ."}] },
    { theme: "sdvig", layout: "close", eyebrow: "08 · Производственный план", title: "Сначала площадка и программа, затем тираж", intro: "До анонса нужно подтвердить команду, права на работы, смету, расписание и требования доступности.", image: "sdvig-venue", alt: "Концепт пространства фестиваля графического дизайна", stamp: "Самостоятельный концепт · не проведённое событие" }
  ]
};

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}
function renderDeckSlide(slide) {
  viewerSlide.className = `viewer-slide deck-slide deck-${slide.theme} deck-layout-${slide.layout}`;
  const image = createTextElement("img", "deck-photo", "");
  image.src = `assets/images/${slide.image}.jpg`;
  image.alt = slide.alt;
  image.loading = "eager";
  if (slide.layout === "cover" || slide.layout === "close") {
    viewerSlide.append(image);
  } else {
    const media = createTextElement("figure", "deck-media", "");
    media.append(image);
    viewerSlide.append(media);
  }

  const content = createTextElement("div", "deck-copy", "");
  content.append(createTextElement("p", "deck-eyebrow", slide.eyebrow));
  content.append(createTextElement("h3", "deck-title", slide.title));
  content.append(createTextElement("p", "deck-intro", slide.intro));
  if (slide.items?.length) {
    const points = createTextElement("div", "deck-points", "");
    slide.items.forEach(item => {
      const point = createTextElement("article", "deck-point", "");
      point.append(createTextElement("h4", "deck-point-label", item.label));
      point.append(createTextElement("p", "", item.text));
      points.append(point);
    });
    content.append(points);
  }
  content.append(createTextElement("p", "deck-stamp", slide.stamp || "Самостоятельный концепт · 2026"));
  viewerSlide.append(content);
}

let images = [];
let imageIndex = 0;
let sourceCard = null;
let pointerStartedOnBackdrop = false;
let imageAnimation = null;

function showImage() {
  const gallery = sourceCard.dataset.gallery;
  const isDeck = Object.hasOwn(presentationDecks, gallery);
  const image = images[imageIndex];
  viewerImage.hidden = isDeck;
  viewerSlide.hidden = !isDeck;
  viewerImage.classList.toggle("portrait", gallery === "mouse");
  viewerImage.classList.toggle("slide", false);
  if (isDeck) {
    viewerImage.removeAttribute("src");
    renderDeckSlide(image);
  } else {
    viewerSlide.replaceChildren();
    viewerImage.alt = image.alt;
    viewerImage.src = image.src;
  }
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
      } else if (Object.hasOwn(presentationDecks, gallery)) {
        images = presentationDecks[gallery];
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
  viewerImage.hidden = false;
  viewerSlide.hidden = true;
  viewerSlide.replaceChildren();
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

