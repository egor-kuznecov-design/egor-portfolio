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
    { theme: "kvartal", layout: "cover", eyebrow: "Коммерческая концепция · запуск", title: "Кофейня у дома для ежедневного маршрута", intro: "Позиционирование, меню, сервисная модель и план пилотного запуска районного кафе.", image: "quartal-space", alt: "Интерьер районной кофейни с тёплой деревянной отделкой", stamp: "Портфолио · концепция запуска" },
    { theme: "kvartal", layout: "split-right", eyebrow: "01 · Коммерческая задача", title: "Собрать три сценария визита в один формат", intro: "До выбора локации проверяются поводы для визита: они определят посадку, меню и загрузку стойки.", image: "quartal-space", alt: "Зал районной кофейни", items: [{label:"Утренний поток",text:"Кофе и завтрак по пути на работу."},{label:"Дневная пауза",text:"Короткий визит рядом с домом или офисом."},{label:"Встреча",text:"Комфортная посадка для спокойного общения."}] },
    { theme: "kvartal", layout: "statement", eyebrow: "02 · Позиционирование", title: "Соседская кофейня с быстрым сервисом", intro: "Квартал соединяет удобство заказа с собой и желание остаться в знакомом месте.", image: "quartal-touchpoint", alt: "Кофе и выпечка для гостя кофейни", items: [{label:"Ценность для гостя",text:"Понятный выбор, стабильное качество, тёплый приём."},{label:"Характер бренда",text:"Локальный, открытый, без лишней церемонии."}] },
    { theme: "kvartal", layout: "cards", eyebrow: "03 · Архитектура предложения", title: "Меню ведёт от первого выбора к допродаже", intro: "Коммерческая структура помогает быстро выбрать основной продукт и дополнить заказ.", image: "quartal-touchpoint", alt: "Кофе и выпечка на столе", items: [{label:"Входная позиция",text:"Классический кофе и базовая выпечка."},{label:"Основное меню",text:"Напитки и завтраки для повседневного визита."},{label:"Дополнение",text:"Сироп, альтернативное молоко, десерт."},{label:"Сезонный повод",text:"Ограниченная позиция для повторного интереса."}] },
    { theme: "kvartal", layout: "split-left", eyebrow: "04 · Бренд на точке продаж", title: "Айдентика поддерживает выбор и сервис", intro: "Система носителей связывает интерьер, меню и упаковку в единый опыт.", image: "quartal-space", alt: "Интерьер кофейни и стойка обслуживания", items: [{label:"Навигация",text:"Вход, очередь, заказ и выдача считываются без подсказок."},{label:"Меню",text:"Категории и дополнения видны в одном сценарии."},{label:"Упаковка",text:"Стакан и пакет продолжают образ бренда за пределами кафе."}] },
    { theme: "kvartal", layout: "journey", eyebrow: "05 · Сервисный сценарий", title: "Сократить трение на пути к повторному визиту", intro: "Сервисная схема связывает первое касание, заказ и повторное посещение.", image: "quartal-touchpoint", alt: "Кофейный напиток для гостя", items: [{label:"Привлечь",text:"Показать формат, расположение и меню."},{label:"Обслужить",text:"Обеспечить ясный заказ и предсказуемую выдачу."},{label:"Вернуть",text:"Собирать обратную связь и напоминать о сезонном меню."}] },
    { theme: "kvartal", layout: "roadmap", eyebrow: "06 · Пилотный запуск", title: "План на первые 30 дней работы", intro: "Предлагаемый график запуска: подготовка, мягкое открытие, настройка операций.", image: "quartal-space", alt: "Подготовленное пространство кофейни", items: [{label:"До открытия",text:"Утвердить меню, закупки, команду и путь гостя."},{label:"Неделя 1",text:"Провести мягкий запуск и фиксировать вопросы гостей."},{label:"Недели 2–4",text:"Уточнить ассортимент, смены и коммуникацию по наблюдениям."}] },
    { theme: "kvartal", layout: "matrix", eyebrow: "07 · Модель экономики", title: "Четыре параметра для решения об открытии", intro: "Значения не подставлены: модель заполняется после проверки локации, аренды и поставщиков.", image: "quartal-touchpoint", alt: "Кофе и выпечка как ассортимент кофейни", items: [{label:"Средний чек",text:"Состав заказа и доля дополнительных позиций."},{label:"Маржа",text:"Валовая прибыль по категориям меню."},{label:"Безубыточность",text:"Постоянные расходы и вклад с каждого заказа."},{label:"Пропускная способность",text:"Заказы в час, число сотрудников и посадочных мест."}] },
    { theme: "kvartal", layout: "close", eyebrow: "08 · Решение о запуске", title: "Открывать после проверки локации и экономики", intro: "Следующий шаг — подтвердить пешеходный поток, условия аренды, unit-экономику меню и готовность команды.", image: "quartal-space", alt: "Концепция интерьера кофейни", stamp: "Концепт для портфолио · фактических продаж нет" }
  ],
  tishe: [
    { theme: "tishe", layout: "cover", eyebrow: "Продуктовая стратегия · B2B", title: "Акустический светильник для проектных интерьеров", intro: "Концепция продукта и выхода на рынок: от линейки и спецификации до материалов для продаж.", image: "tishe-product", alt: "Подвесной светильник из войлока в современном интерьере", stamp: "Портфолио · концепция запуска" },
    { theme: "tishe", layout: "split-right", eyebrow: "01 · Возможность рынка", title: "Проверить продукт на трёх сценариях применения", intro: "Аудитории и спрос здесь заданы как гипотезы для интервью с бюро и закупщиками.", image: "tishe-product", alt: "Светильник над столом в интерьере", items: [{label:"Интерьерные бюро",text:"Предметный акцент с документированной спецификацией."},{label:"Гостеприимство",text:"Свет для кафе, лобби и общих зон."},{label:"Рабочие пространства",text:"Решение для переговорных и локальных зон."}] },
    { theme: "tishe", layout: "statement", eyebrow: "02 · Ценностное предложение", title: "Свет и акустический материал в одном объекте", intro: "Концепция объединяет визуальный комфорт и потенциал звукопоглощения; акустические свойства подтверждаются только испытаниями.", image: "tishe-material", alt: "Фактура акустического войлока и металлический элемент", items: [{label:"Польза для проекта",text:"Меньше отдельных предметов в спецификации интерьера."},{label:"Основание доверия",text:"Паспорт изделия с проверяемыми характеристиками."}] },
    { theme: "tishe", layout: "cards", eyebrow: "03 · Линейка и SKU", title: "Одна система — несколько коммерческих форматов", intro: "Общая конструкция упрощает подбор, презентацию и комплектование проекта.", image: "tishe-product", alt: "Подвесной светильник в жилом интерьере", items: [{label:"Pendant",text:"Одиночный подвес над столом."},{label:"Cluster",text:"Группа светильников для общей зоны."},{label:"Task",text:"Локальный свет для рабочего места."},{label:"Finish set",text:"Согласованная палитра войлока и металла."}] },
    { theme: "tishe", layout: "split-left", eyebrow: "04 · Конструкция и материалы", title: "Производственная логика заложена в форме", intro: "Для перехода от визуальной идеи к образцу нужно согласовать материал, крепление и обслуживание.", image: "tishe-material", alt: "Деталь войлочной поверхности светильника", items: [{label:"Оболочка",text:"Форма и плотность войлока для серийного изготовления."},{label:"Узел",text:"Подвес, металлическое кольцо и доступ к источнику света."},{label:"Эксплуатация",text:"Очистка, замена компонента и упаковка."}] },
    { theme: "tishe", layout: "matrix", eyebrow: "05 · Спецификация", title: "Технические параметры до коммерческого запуска", intro: "Визуальный концепт не заявляет измеренные показатели; их нужно подтвердить на прототипе.", image: "tishe-material", alt: "Материальная отделка акустического светильника", items: [{label:"Свет",text:"Световой поток, температура и цветопередача."},{label:"Безопасность",text:"Нагрев, электрика, подвес и устойчивость."},{label:"Акустика",text:"Методика и результаты испытаний изделия."},{label:"Сервис",text:"Монтаж, уход, гарантийная схема и упаковка."}] },
    { theme: "tishe", layout: "journey", eyebrow: "06 · Материалы для продаж", title: "Сделать выбор понятным для заказчика и бюро", intro: "B2B-набор должен помогать быстро включить продукт в спецификацию.", image: "tishe-product", alt: "Светильник в проектном интерьере", items: [{label:"Показать",text:"Образцы отделок и визуализация масштаба."},{label:"Согласовать",text:"Технический лист и монтажная схема."},{label:"Заказать",text:"Артикулы, сроки, комплектность и гарантия."}] },
    { theme: "tishe", layout: "roadmap", eyebrow: "07 · Выход на рынок", title: "От прототипа к пилотным проектам", intro: "Коммерческий запуск опирается на подтверждённую конструкцию и понятный пакет продаж.", image: "tishe-product", alt: "Продуктовая концепция акустического светильника", items: [{label:"Разработать",text:"Собрать прототип и зафиксировать конфигурации."},{label:"Проверить",text:"Испытать свет, акустику, безопасность и упаковку."},{label:"Предложить",text:"Подготовить образцы и запустить пилот с проектным бюро."}] },
    { theme: "tishe", layout: "close", eyebrow: "08 · Следующее решение", title: "Перейти к прототипу после проверки спроса", intro: "Для старта нужны интервью с проектными бюро, расчёт себестоимости и согласованный план испытаний.", image: "tishe-material", alt: "Деталь материала акустического светильника", stamp: "Концепт для портфолио · показатели требуют валидации" }
  ],
  sdvig: [
    { theme: "sdvig", layout: "cover", eyebrow: "Коммерческая концепция · событие", title: "Фестиваль графического дизайна как городская платформа", intro: "Партнёрское предложение: аудитория, программа, интеграции и план производства.", image: "sdvig-campaign", alt: "Синие и жёлтые афиши фестиваля в городе", stamp: "Портфолио · концепция запуска" },
    { theme: "sdvig", layout: "split-right", eyebrow: "01 · Цель проекта", title: "Собрать профессиональное сообщество вокруг события", intro: "Формат рассчитан на три группы; состав и масштаб уточняются после подтверждения партнёров и площадки.", image: "sdvig-venue", alt: "Пространство фестиваля дизайна с посетителями", items: [{label:"Практикующие дизайнеры",text:"Обмен опытом и обсуждение профессиональной практики."},{label:"Студенты",text:"Мастерские, портфолио-ревью и доступ к сообществу."},{label:"Партнёры и площадки",text:"Культурная программа и содержательные интеграции."}] },
    { theme: "sdvig", layout: "statement", eyebrow: "02 · Ценность события", title: "Контент, связи и заметность партнёров", intro: "Фестиваль превращает тему графического дизайна в публичную программу с возможностью измерить интерес аудитории.", image: "sdvig-campaign", alt: "Городская афиша фестиваля графического дизайна", items: [{label:"Для аудитории",text:"Практическая программа и новые профессиональные контакты."},{label:"Для партнёров",text:"Тематический контент и заметные точки интеграции."}] },
    { theme: "sdvig", layout: "cards", eyebrow: "03 · Программная сетка", title: "Форматы на весь путь участника", intro: "Сетка сочетает контент, участие и открытый показ работ.", image: "sdvig-venue", alt: "Выставочное пространство с графическими материалами", items: [{label:"Сцена",text:"Лекции и профессиональные дискуссии."},{label:"Практика",text:"Мастерские и портфолио-ревью."},{label:"Экспозиция",text:"Плакаты и цифровые проекты."},{label:"Комьюнити",text:"Зона партнёров и неформального общения."}] },
    { theme: "sdvig", layout: "split-left", eyebrow: "04 · Коммуникационная система", title: "Одна айдентика для кампании и площадки", intro: "Графическая система масштабируется от анонса до навигации и партнёрских носителей.", image: "sdvig-campaign", alt: "Система ярких городских постеров фестиваля", items: [{label:"Анонс",text:"Ключевое сообщение, дата и призыв к регистрации."},{label:"Площадка",text:"Навигация, расписание и обозначение зон."},{label:"Партнёры",text:"Набор носителей с правилами интеграции."}] },
    { theme: "sdvig", layout: "journey", eyebrow: "05 · Путь участника", title: "От первого контакта до отчёта после события", intro: "Коммуникация и операции связываются в одну последовательность.", image: "sdvig-venue", alt: "Посетители фестиваля в выставочном зале", items: [{label:"Привлечь",text:"Показать тему, дату, программу и условия участия."},{label:"Принять",text:"Организовать регистрацию, вход и движение по залу."},{label:"Продолжить",text:"Собрать обратную связь и отправить материалы."}] },
    { theme: "sdvig", layout: "roadmap", eyebrow: "06 · Партнёрские интеграции", title: "Пакеты участия с понятными форматами", intro: "Ни один партнёр не заявлен: ниже — возможная структура коммерческого предложения.", image: "sdvig-venue", alt: "Пространство для проведения дизайн-фестиваля", items: [{label:"Титульный партнёр",text:"Интеграция в ключевые анонсы и приветственную зону."},{label:"Партнёр программы",text:"Поддержка конкретного формата или мастерской."},{label:"Площадка / медиа",text:"Пространство, информационный обмен или публикация."}] },
    { theme: "sdvig", layout: "matrix", eyebrow: "07 · План и измерение", title: "Показатели задаются до старта кампании", intro: "Фактических результатов нет; для пилота предлагается отслеживать путь от интереса до участия.", image: "sdvig-campaign", alt: "Визуальная кампания фестиваля", items: [{label:"Охват",text:"Переходы на страницу программы."},{label:"Регистрация",text:"Завершённые заявки и источники трафика."},{label:"Посещение",text:"Фактическая явка по форматам."},{label:"Партнёры",text:"Выполненные интеграции и отчётность."}] },
    { theme: "sdvig", layout: "close", eyebrow: "08 · Решение о запуске", title: "Подтвердить площадку, команду и бюджет", intro: "После фиксации сметы можно утвердить партнёрские уровни, программу, календарь и план продаж билетов.", image: "sdvig-venue", alt: "Концепция пространства фестиваля", stamp: "Концепт для портфолио · фестиваль не проводился" }
  ]
};

const presentationBrands = {
  kvartal: "КВАРТАЛ · БРЕНД И ЗАПУСК",
  tishe: "ТИШЕ · ПРОДУКТОВАЯ СТРАТЕГИЯ",
  sdvig: "СДВИГ · ПАРТНЁРСКОЕ ПРЕДЛОЖЕНИЕ"
};

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function renderDeckSlide(slide) {
  const gallery = sourceCard.dataset.gallery;
  viewerSlide.replaceChildren();
  viewerSlide.className = `viewer-slide deck-slide deck-${slide.theme} deck-layout-${slide.layout}`;
  viewerSlide.setAttribute("role", "group");
  viewerSlide.setAttribute("aria-label", `${slide.title}. Слайд ${imageIndex + 1} из ${images.length}`);

  const media = createTextElement("figure", "deck-media", "");
  const image = createTextElement("img", "deck-photo", "");
  image.src = `assets/images/${slide.image}.jpg`;
  image.alt = slide.alt;
  image.loading = "eager";
  media.append(image);
  viewerSlide.append(media);

  const content = createTextElement("div", "deck-copy", "");
  content.append(createTextElement("p", "deck-eyebrow", slide.eyebrow));
  content.append(createTextElement("h3", "deck-title", slide.title));
  content.append(createTextElement("p", "deck-intro", slide.intro));
  if (slide.items?.length) {
    const points = createTextElement("div", "deck-points", "");
    slide.items.forEach((item, index) => {
      const point = createTextElement("article", "deck-point", "");
      point.append(createTextElement("span", "deck-point-number", String(index + 1).padStart(2, "0")));
      const text = createTextElement("div", "deck-point-copy", "");
      text.append(createTextElement("h4", "deck-point-label", item.label));
      text.append(createTextElement("p", "", item.text));
      point.append(text);
      points.append(point);
    });
    content.append(points);
  }
  if (slide.stamp) content.append(createTextElement("p", "deck-note", slide.stamp));
  viewerSlide.append(content);

  const footer = createTextElement("footer", "deck-footer", "");
  footer.setAttribute("aria-label", "Информация о слайде");
  footer.append(createTextElement("span", "deck-footer-brand", presentationBrands[gallery]));
  footer.append(createTextElement("span", "deck-footer-note", "Коммерческая концепция · портфолио"));
  footer.append(createTextElement("span", "deck-footer-page", `${String(imageIndex + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`));
  viewerSlide.append(footer);
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
  viewerHint.hidden = isDeck;
  counter.hidden = isDeck;
  viewer.classList.toggle("presentation-open", isDeck);
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
  viewerHint.hidden = false;
  counter.hidden = false;
  viewer.classList.remove("presentation-open");
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

