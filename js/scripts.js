document.addEventListener('DOMContentLoaded', function () {
  // Получаем имя текущего файла (страницы) из URL
  const currentPath = window.location.pathname.split('/').pop();
  const currentPage = currentPath === '' ? 'index.html' : currentPath;

  // Функция для установки активного пункта меню
  function setActiveMenuItem() {
    // Получаем все ссылки в меню
    const menuItems = document.querySelectorAll('.menu__item-link');
    menuItems.forEach((item) => {
      // Если href ссылки содержит имя текущей страницы, добавляем класс 'active'
      if (item.getAttribute('href').includes(currentPage)) {
        item.classList.add('active');
      }
    });
  }

  // Устанавливаем активный элемент меню при загрузке страницы
  setActiveMenuItem();

  // Находим элементы бургер-меню и меню
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  const body = document.querySelector('body');

  // Обработчик клика по бургер-меню
  burger.addEventListener('click', () => {
    // Если меню не активно, активируем его
    if (!menu.classList.contains('active')) {
      menu.classList.add('active');
      burger.classList.add('active-burger');
      body.classList.add('locked');

      // Убираем активный класс у пункта меню при открытии мобильного меню
      const activeMenuItem = document.querySelector('.menu__item-link.active');
      if (activeMenuItem) {
        activeMenuItem.classList.remove('active');
      }
    } else {
      // Если меню уже активно, деактивируем его
      menu.classList.remove('active');
      burger.classList.remove('active-burger');
      body.classList.remove('locked');

      // Восстанавливаем активный класс при закрытии мобильного меню
      setActiveMenuItem();
    }
  });

  // Обработчик изменения размера окна
  window.addEventListener('resize', function () {
    // Если ширина окна больше 768px, скрываем бургер-меню
    if (window.innerWidth > 768) {
      menu.classList.remove('active');
      burger.classList.remove('active-burger');
      body.classList.remove('locked');

      // Восстанавливаем активный класс для пунктов меню
      setActiveMenuItem();
    } else {
      // Если ширина окна меньше 768px, убираем активный класс у пункта меню
      const activeMenuItem = document.querySelector('.menu__item-link.active');
      if (activeMenuItem) {
        activeMenuItem.classList.remove('active');
      }
    }
  });

  // Находим все элементы с классом 'statistic__nubmer'
  const counters = document.querySelectorAll('.statistic__nubmer');

  // Задаем скорость анимации в миллисекундах
  const speed = 496;

  // Функция для анимации счётчика
  function countUp(el) {
    const target = +el.textContent; // Целевая цифра
    let count = 0;
    const increment = target / (speed / 36); // Вычисляем шаг увеличения

    // Запускаем интервал, чтобы обновлять счётчик
    const interval = setInterval(() => {
      count += increment;
      if (count >= target) {
        // Если достигли цели
        count = target;
        clearInterval(interval); // Останавливаем интервал
      }
      el.textContent = Math.floor(count); // Обновляем текст элемента
    }, 100); // Интервал в 100 мс
  }

  // Функция для обработки события прокрутки
  function handleScroll() {
    const triggerPoint = window.innerHeight + window.scrollY; // Расстояние от верхней части окна до низа видимой области
    counters.forEach((counter) => {
      const offset = counter.getBoundingClientRect().top + window.scrollY; // Позиция элемента на странице
      if (triggerPoint > offset) {
        // Если элемент в области видимости
        countUp(counter); // Запускаем анимацию счётчика
        window.removeEventListener('scroll', handleScroll); // Удаляем обработчик после первого запуска
      }
    });
  }

  // Добавляем обработчик события прокрутки
  window.addEventListener('scroll', handleScroll);

  // Запускаем обработчик сразу, если элемент уже видим
  handleScroll();

  // Находим элементы для работы с файлами
  const input = document.getElementById('fileInput');
  const fileListContainer = document.getElementById('fileList');
  const downloadButton = document.getElementById('downloadButton');
  const deleteAllButton = document.getElementById('deleteAllButton');
  const noFilesMessage = document.getElementById('noFilesMessage');
  let files = [];
  let objectURLs = [];

  // Иконки для разных типов файлов
  const icons = {
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'icons/word-icon.png',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'icons/excel-icon.png',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      'icons/ppt-icon.png',
    'application/msword': 'icons/word-icon.png',
    'application/vnd.ms-excel': 'icons/excel-icon.png',
    'application/vnd.ms-powerpoint': 'icons/ppt-icon.png',
    'application/pdf': 'icons/pdf-icon.png',
  };

  // Обработчик изменения файлов
  input.addEventListener('change', function () {
    // Очистка предыдущих данных
    files = [];
    objectURLs.forEach(URL.revokeObjectURL); // Отменяем создание URL для предыдущих файлов
    objectURLs = [];
    fileListContainer.innerHTML = ''; // Очищаем контейнер для файлов
    downloadButton.style.display = 'none'; // Скрываем кнопку загрузки
    deleteAllButton.style.display = 'none'; // Скрываем кнопку удаления всех файлов
    noFilesMessage.style.display = 'none'; // Скрываем сообщение о том, что нет файлов

    const selectedFiles = Array.from(this.files); // Преобразуем выбранные файлы в массив
    const allowedTypes = Object.keys(icons); // Список поддерживаемых типов файлов

    // Если файлов нет, показываем сообщение
    if (selectedFiles.length === 0) {
      noFilesMessage.style.display = 'block';
    }

    // Обрабатываем каждый выбранный файл
    selectedFiles.forEach((file) => {
      if (allowedTypes.includes(file.type)) {
        // Создаем URL для файла
        const objectURL = URL.createObjectURL(file);
        objectURLs.push(objectURL); // Сохраняем URL
        files.push({ name: file.name, url: objectURL, size: file.size, type: file.type }); // Сохраняем информацию о файле

        // Создаем элемент для отображения информации о файле
        const fileInfo = document.createElement('div');
        fileInfo.classList.add('file-info');

        // Создаем элемент изображения для иконки файла
        const icon = document.createElement('img');
        icon.src = icons[file.type] || 'icons/default-icon.png'; // Устанавливаем иконку по типу файла

        // Форматируем размер файла в КБ
        const sizeInKB = (file.size / 1024).toFixed(2);
        fileInfo.innerHTML = `${icon.outerHTML} ${file.name} (${sizeInKB} KB)`;

        // Создаем элемент для иконки удаления
        const deleteIcon = document.createElement('span');
        deleteIcon.style.display = 'flex'; // Делаем иконку флекс-элементом
        deleteIcon.style.alignItems = 'center'; // Выравниваем элементы по центру
        deleteIcon.classList.add('delete-icon');
        deleteIcon.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Иконка удаления из Font Awesome
        deleteIcon.addEventListener('click', () => {
          removeFile(file.name); // При клике вызываем функцию для удаления файла
        });

        fileInfo.appendChild(deleteIcon); // Добавляем иконку удаления к элементу файла
        fileListContainer.appendChild(fileInfo); // Добавляем информацию о файле в контейнер
      } else {
        // Если тип файла не поддерживается, показываем предупреждение
        alert(`File type "${file.type}" is not supported.`);
      }
    });

    // Если есть файлы, показываем кнопки загрузки и удаления всех файлов
    if (files.length > 0) {
      downloadButton.style.display = 'block';
      deleteAllButton.style.display = 'block';
    }
  });

  // Обработчик клика по кнопке загрузки
  downloadButton.addEventListener('click', function () {
    // Для каждого файла создаем ссылку и инициируем загрузку
    files.forEach((file) => {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click(); // Запускаем загрузку файла
    });
  });

  // Обработчик клика по кнопке удаления всех файлов
  deleteAllButton.addEventListener('click', function () {
    files = []; // Очищаем массив файлов
    objectURLs.forEach(URL.revokeObjectURL); // Отменяем создание URL для всех файлов
    objectURLs = [];
    fileListContainer.innerHTML = ''; // Очищаем контейнер для файлов
    downloadButton.style.display = 'none'; // Скрываем кнопку загрузки
    deleteAllButton.style.display = 'none'; // Скрываем кнопку удаления всех файлов
    noFilesMessage.style.display = 'block'; // Показываем сообщение о том, что нет файлов
  });

  // Функция для удаления отдельного файла
  function removeFile(fileName) {
    // Удаляем файл из массива по имени
    files = files.filter((file) => file.name !== fileName);
    // Удаляем URL из массива
    objectURLs = objectURLs.filter((url) => !url.includes(fileName));
    // Находим элемент с информацией о файле
    const fileInfo = Array.from(fileListContainer.children).find((el) =>
      el.textContent.includes(fileName),
    );
    if (fileInfo) {
      fileListContainer.removeChild(fileInfo); // Удаляем элемент из контейнера
    }
    // Если файлов нет, скрываем кнопки и показываем сообщение
    if (files.length === 0) {
      downloadButton.style.display = 'none';
      deleteAllButton.style.display = 'none';
      noFilesMessage.style.display = 'block';
    }
  }
});
