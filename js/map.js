'use strict';
var CARDS_QUANTITY = 8;
var MAX_ROOMS_QUANTITY = 5;
var MAX_GUESTS_QUANTITY = 10;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_LEFT = 350;
var MAX_LEFT = 900;
var MIN_TOP = 130;
var MAX_TOP = 630;
var ESC_KEYCODE = 27;
var PIN_POINTER_HEIGHT = 17; // высота псевдоэлемента-указателя за вычетом толщины рамки пина, взята из разметки
var START_X = 570; // начальные координаты главного пина
var START_Y = 375; // начальные координаты главного пина
var CHECKINS = ['12:00', '13:00', '14:00'];
var FLAT_DESCRIPTIONS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PRICE = {
  'flat': 1000,
  'bungalo': 0,
  'house': 5000,
  'palace': 10000
};
// пределы перемещения главного пина:
var DRAG_STOP = {
  X: {
    MIN: 0,
    MAX: 1200
  },
  Y: {
    MIN: 130,
    MAX: 630
  }
};
var CAPACITY = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};
var cards = [];
var mapPinContainer = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var mapPinMain = document.querySelector('.map__pin--main');
var mapFilters = document.querySelector('.map__filters-container');
var mapFilterItems = document.querySelectorAll('.map__filter');
var card = document.querySelector('#card').content.querySelector('.map__card');
var pin = document.querySelector('#pin').content.querySelector('.map__pin');
var photosListItem = document.querySelector('#card').content.querySelector('.popup__photo');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('.ad-form__element');
var success = document.querySelector('#success').content.querySelector('.success');
var titleInput = document.getElementById('title');
var typeInput = document.getElementById('type');
var priceInput = document.getElementById('price');
var timeInInput = document.getElementById('timein');
var timeOutInput = document.getElementById('timeout');
var capacityInput = document.getElementById('capacity');
var roomNumberInput = document.getElementById('room_number');
var capacityInputOptions = capacityInput.querySelectorAll('option');
var resetButton = document.querySelector('.ad-form__reset');
var mapPins;
var presentCard;
var successWindow;

// получение координат главного пина:
var getMainPinPosition = function () {
  var position = {
    x: Math.round((mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2)),
    y: Math.round((mapPinMain.offsetTop + mapPinMain.offsetHeight + PIN_POINTER_HEIGHT))
  };
  return position;
};
// заполнение поля адреса главного пина:
var fillAddress = function () {
  var location = getMainPinPosition();
  document.getElementById('address').value = location.x + ', ' + location.y;
};

// генерируем целые случайные числа:
var calculateRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};
// перемешиваем массив:
var shuffle = function (currentArray) {
  return currentArray.sort(function () {
    return Math.random() - 0.5;
  });
};
// получаем случайное описание жилища:
var getTitle = function () {
  shuffle(FLAT_DESCRIPTIONS);
  for (var i = 0; i < FLAT_DESCRIPTIONS.length; i++) {
    var description = FLAT_DESCRIPTIONS[i];
  }
  return description;
};
// генерируем случайную цену в указанном диапазоне:
var getPrice = function (min, max) {
  return (calculateRandomInt(min, max) + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + ' ₽/ночь';
};
// генерируем случайный тип жилья и переводим на русский::
var getType = function () {
  var currentType = TYPES[calculateRandomInt(0, TYPES.length - 1)];
  switch (currentType) {
    case 'flat':
      currentType = 'Квартира';
      break;
    case 'bungalo':
      currentType = 'Бунгало';
      break;
    case 'house':
      currentType = 'Дом';
      break;
    case 'palace':
      currentType = 'Дворец';
      break;
  }
  return currentType;
};
// генерируем случайное число комнат:
var getRooms = function () {
  return calculateRandomInt(1, MAX_ROOMS_QUANTITY);
};
// генерируем случайное число гостей:
var getGuests = function () {
  return calculateRandomInt(1, MAX_GUESTS_QUANTITY);
};
// генерируем случайное время приезда:
var getCheckins = function () {
  return CHECKINS[calculateRandomInt(0, CHECKINS.length - 1)];
};
// генерируем случайное время отъезда:
var getCheckouts = function () {
  return CHECKINS[calculateRandomInt(0, CHECKINS.length - 1)];
};
// генерируем случайное количество фич:
var getFeatures = function () {
  FEATURES = shuffle(FEATURES);
  return FEATURES.slice(0, calculateRandomInt(0, FEATURES.length));
};
// получаем перемешанный массив фото:
var getPhotos = function () {
  return shuffle(PHOTOS);
};
// генерируем случайные координаты:
var getLocationX = function () {
  return calculateRandomInt(MIN_LEFT, MAX_LEFT);
};
var getLocationY = function () {
  return calculateRandomInt(MIN_TOP, MAX_TOP);
};
// адрес, представленный координатами:
var getAddress = function (x, y) {
  return x + ', ' + y;
};
// формируем строку адреса для разметки html:
var getLocationXY = function (currentCard) {
  return 'left: ' + currentCard.location.x + 'px; ' + 'top: ' + currentCard.location.y + 'px;';
};
// переводить на русскай языка:
var getCapacity = function (currentCard) {
  var capacityTextRooms = (currentCard.offer.rooms === 1) ? currentCard.offer.rooms + ' комната для ' : capacityTextRooms = (currentCard.offer.rooms === 5) ? currentCard.offer.rooms + ' комнат для ' : currentCard.offer.rooms + ' комнаты для ';
  var capacityTextGuests = (currentCard.offer.guests === 1) ? currentCard.offer.guests + ' гостя' : currentCard.offer.guests + ' гостей';
  return capacityTextRooms + capacityTextGuests;
};
// сообщение о въезде - выезде:
var getCheckTime = function (currentCard) {
  return 'Заезд после ' + currentCard.offer.checkin + ', выезд до ' + currentCard.offer.checkout;
};
// деактивируем элементы форм:
var setElementsDisabled = function (elements) {
  elements.forEach(function (item) {
    item.disabled = true;
  });
};
// активируем элементы форм::
var setElementsEnabled = function (elements) {
  elements.forEach(function (item) {
    item.disabled = false;
  });
};
// закрывает попап:
var closePopup = function (popup) {
  // var popup = map.querySelector('.popup');
  if (popup) {
    popup.remove();
  }
};
// структура объявления:
for (var i = 0; i < CARDS_QUANTITY; i++) {
  cards[i] = {
    author: {
      avatar: 'img/avatars/user' + '0' + (i + 1) + '.png'
    },
    offer: {
      title: getTitle(getType()),
      address: getAddress(getLocationX(), getLocationY()),
      price: getPrice(MIN_PRICE, MAX_PRICE),
      type: getType(),
      rooms: getRooms(),
      guests: getGuests(),
      checkin: getCheckins(),
      checkout: getCheckouts(),
      features: getFeatures(),
      description: '',
      photos: getPhotos()
    },
    location: {
      x: getLocationX(),
      y: getLocationY()
    }
  };
}

// создание фрагмента для добавления пина в разметку:
var getPinFragment = function (array, createdomfunction) {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < array.length; j++) {
    fragment.appendChild(createdomfunction(array[j]));
  }
  return fragment;
};
// создание фрагмента для добавления карточки в разметку:
var getCardFragment = function (currentCard, createdomfunction) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(createdomfunction(currentCard));
  return fragment;
};
// создание фрагмента с новым списком фоток для добавления в разметку:
var getPhotosFragment = function (currentCard) {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < currentCard.offer.photos.length; j++) {
    var newPhoto = photosListItem.cloneNode(true);
    newPhoto.src = currentCard.offer.photos[j];
    fragment.appendChild(newPhoto);
  }
  return fragment;
};
// создание фрагмента с сообщением об успешнлй отправке формы:
var getSuccessFragment = function () {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderSuccess());
  return fragment;
};
//  формируем список опций:
var showFeatures = function (cardElement, currentCard) {
  var featureItems = cardElement.querySelectorAll('.popup__feature');
  for (var j = 0; j < featureItems.length; j++) {
    featureItems[j].classList.add('visually-hidden');
  }
  for (var t = 0; t < currentCard.offer.features.length; t++) {
    var firstElement = cardElement.querySelector('.' + 'popup__feature--' + currentCard.offer.features[t]);
    firstElement.classList.remove('visually-hidden');
  }
};
// формируем DOM элемент метки:
var renderPins = function (currentCard) {
  var pinElement = pin.cloneNode(true);
  var pinElementClass = pinElement.querySelector('img');
  pinElementClass.src = currentCard.author.avatar;
  pinElementClass.alt = currentCard.offer.title;
  pin.style = getLocationXY(currentCard);
  // клик на метку показывает карточку:
  pinElement.addEventListener('click', function () {
    closePopup(presentCard);
    insertFragmentCard(currentCard);
    document.addEventListener('keydown', onEscClose);
  });
  return pinElement;
};

// формируем DOM элемент карточки:
var renderCard = function (currentCard) {
  var cardElement = card.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = currentCard.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = currentCard.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = currentCard.offer.price;
  cardElement.querySelector('.popup__type').textContent = currentCard.offer.type;
  cardElement.querySelector('.popup__text--capacity').textContent = getCapacity(currentCard);
  cardElement.querySelector('.popup__text--time').textContent = getCheckTime(currentCard);
  cardElement.querySelector('.popup__description').textContent = currentCard.offer.description;
  cardElement.querySelector('.popup__avatar').src = currentCard.author.avatar;
  cardElement.querySelector('.popup__photos').removeChild(cardElement.querySelector('.popup__photo'));
  cardElement.querySelector('.popup__photos').appendChild(getPhotosFragment(currentCard));
  showFeatures(cardElement, currentCard);
  // обработчики закрытия текущей карточки:
  cardElement.querySelector('.popup__close').addEventListener('click', function () {
    cardElement.remove();
  });
  return cardElement;
};
// формируем DOM элемент сообщения об успехе:
var renderSuccess = function () {
  document.addEventListener('keydown', onEscClose);
  document.addEventListener('click', onClickClose);
  return success.cloneNode(true);
};
// добавляем метку в разметку:
var insertFragmentPin = function () {
  mapPinContainer.appendChild(getPinFragment(cards, renderPins));
  mapPins = document.querySelectorAll('.map__pin');
};
// добавляем карточку в разметку:
var insertFragmentCard = function (currentCard) {
  map.insertBefore(getCardFragment(currentCard, renderCard), mapFilters);
  presentCard = document.querySelector('.map__card');
};
// добавляем сообщениe об успехе в разметку:
var insertFragmentSuccess = function () {
  document.querySelector('main').appendChild(getSuccessFragment(renderSuccess));
  successWindow = document.querySelector('.success');
};
// ХЭНДЛЕРЫ:
// при нажатии на главную метку активируется квартира:
var onMainPinMousedown = function () {
  event.preventDefault();
  map.classList.remove('map--faded');
  mapPinMain.addEventListener('mouseup', onMainPinMouseup);
  mapPinMain.removeEventListener('mousedown', onMainPinMousedown);
};
// что происходит при отпускании главной метки: активируются карты и формы, отображается адрес в соотв. поле формы:
var onMainPinMouseup = function () {
  event.preventDefault();
  adForm.classList.remove('ad-form--disabled');
  setElementsEnabled(adFormFieldsets);
  setElementsEnabled(mapFilterItems);
  fillAddress();
  capacityInput.value = '1';
  priceInput.min = PRICE['flat'];
  for (var t = 0; t < capacityInputOptions.length; t++) {
    capacityInputOptions[t].disabled = !CAPACITY[roomNumberInput.value].includes(capacityInputOptions[t].value);
  }
  insertFragmentPin();
  mapPinMain.removeEventListener('mouseup', onMainPinMouseup);
};
// что происходит при нажатии Esc:
var onEscClose = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    closePopup(presentCard);
    closePopup(successWindow);
    document.removeEventListener('keydown', onEscClose);
  }
};
// что происходит при клике на сообщении об успехе:
var onClickClose = function () {
  closePopup(successWindow);
  setElementsEnabled(adFormFieldsets);
  document.removeEventListener('click', onClickClose);
};
// что происходит при отправке данных:
var onSubmit = function (event) {
  event.preventDefault();
  insertFragmentSuccess();
  setElementsDisabled(adFormFieldsets);
  adForm.reset();
  closePopup(presentCard);
  mapPins.forEach(function (item) {
    if (!item.classList.contains('map__pin--main')) {
      item.remove();
    }
  });
  fillAddress();
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  mapPinMain.addEventListener('mousedown', onMainPinMousedown);
};

// назначение соответствия количества гостей количеству комнат по событию 'change'::
var onChangeRoomsGuestsSync = function () {
  for (var t = 0; t < capacityInputOptions.length; t++) {
    capacityInputOptions[t].disabled = !CAPACITY[roomNumberInput.value].includes(capacityInputOptions[t].value);
  }
  if (roomNumberInput.value === '100') {
    capacityInput.value = '0';
  } else {
    capacityInput.value = roomNumberInput.value;
  }
};

// назначение соответствия цены типу жилья по событию 'change':
var onChangePriceFlatSync = function (event) {
  priceInput.min = PRICE[event.target.value];
  priceInput.placeholder = PRICE[event.target.value];
};

// назначение соответствия времени въезда-выезда по событию 'change':
var onChangeCheckInSync = function () {
  timeInInput.value = timeOutInput.value;
};
var onChangeCheckOutSync = function () {
  timeOutInput.value = timeInInput.value;
};
// действия при клике на ресет:
var onClickReset = function () {
  event.preventDefault();
  closePopup(presentCard);
  mapPinMain.style.top = START_Y + 'px';
  mapPinMain.style.left = START_X + 'px';
  fillAddress();
  mapPins.forEach(function (item) {
    if (!item.classList.contains('map__pin--main')) {
      item.remove();
    }
  });
  map.classList.add('map--faded');
  mapPinMain.addEventListener('mousedown', onMainPinMousedown);
};
// действия при перемещении главного пина:
var onMainPinDrag = function () {
  event.preventDefault();
  var startCoords = {
    x: event.clientX,
    y: event.clientY
  };
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };
    var currentPinMainPosition = {
      x: mapPinMain.offsetLeft - shift.x,
      y: mapPinMain.offsetTop - shift.y
    };

    var dragStopBorder = {
      TOP: DRAG_STOP.Y.MIN - mapPinMain.offsetHeight + PIN_POINTER_HEIGHT,
      BOTTOM: DRAG_STOP.Y.MAX - mapPinMain.offsetHeight + PIN_POINTER_HEIGHT,
      LEFT: DRAG_STOP.X.MIN,
      RIGHT: DRAG_STOP.X.MAX - mapPinMain.offsetWidth
    };
    if (currentPinMainPosition.x >= dragStopBorder.LEFT && currentPinMainPosition.x <= dragStopBorder.RIGHT) {
      mapPinMain.style.left = currentPinMainPosition.x + 'px';
    }
    if (currentPinMainPosition.y >= dragStopBorder.TOP && currentPinMainPosition.y <= dragStopBorder.BOTTOM) {
      mapPinMain.style.top = currentPinMainPosition.y + 'px';
    }
  };
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    fillAddress();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

// ОБРАБОТЧИКИ:
// обработчик перетаскивания гланого пина:
mapPinMain.addEventListener('mousedown', onMainPinDrag);
// ообработчик нажатия сброса:
resetButton.addEventListener('click', onClickReset);
// ообработчик нажатия главной метки:
mapPinMain.addEventListener('mousedown', onMainPinMousedown);
// обработчик события успешной отправки формы:
adForm.addEventListener('submit', onSubmit);
// обработчик синхронизации цены и типа жилья:
typeInput.addEventListener('change', onChangePriceFlatSync);
// обработчик синхронизации количества гостей и комнат:
roomNumberInput.addEventListener('change', onChangeRoomsGuestsSync);
// обработчики синхронизации времени въезда-выезда:
timeInInput.addEventListener('change', onChangeCheckOutSync);
timeOutInput.addEventListener('change', onChangeCheckInSync);
// валидация форм:
titleInput.addEventListener('input', function () {
  if (titleInput.validity.tooShort) {
    titleInput.setCustomValidity('Текст должен содержать минимум 30 символов');
    titleInput.classList.add('invalid');
  } else if (titleInput.validity.tooLong) {
    titleInput.setCustomValidity('Текст должен содержать максимум 100 символов');
    titleInput.classList.add('invalid');
  } else if (titleInput.validity.valueMissing) {
    titleInput.setCustomValidity('Обязательное поле');
    titleInput.classList.add('invalid');
  } else {
    titleInput.setCustomValidity('');
    titleInput.classList.remove('invalid');
  }
});

priceInput.addEventListener('input', function () {
  if (priceInput.validity.rangeUnderflow) {
    priceInput.setCustomValidity('Этот тип жилья по такой цене недоступен');
    priceInput.classList.add('invalid');
  } else if (priceInput.validity.rangeOverflow) {
    priceInput.setCustomValidity('Опомнитесь!');
    priceInput.classList.add('invalid');
  } else if (priceInput.validity.valueMissing) {
    priceInput.setCustomValidity('Обязательное поле');
    priceInput.classList.add('invalid');
  } else {
    priceInput.setCustomValidity('');
    priceInput.classList.remove('invalid');
  }
});
// все поля форм по умолчанию неактивны:
setElementsDisabled(adFormFieldsets);
setElementsDisabled(mapFilterItems);
