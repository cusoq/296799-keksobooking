'use strict';
var CARDS_QUANTITY = 8;
var MAX_ROOMS_QUANTITY = 5;
var MAX_GUESTS_QUANTITY = 10;
var CHECKINS = ['12:00', '13:00', '14:00'];
var FLAT_DESCRIPTIONS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_LEFT = 50;
var MAX_LEFT = 1150;
var MIN_TOP = 130;
var MAX_TOP = 630;
var cards = [];
var mapPinContainer = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var mapFilters = document.querySelector('.map__filters-container');
var card = document.querySelector('#card').content.querySelector('.map__card');
var pin = document.querySelector('#pin').content.querySelector('.map__pin');
var photosListItem = document.querySelector('#card').content.querySelector('.popup__photo');

// генерируем целые случайные числа
var calculateRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};
// перемешиваем массив
var shuffle = function (currentArray) {
  return currentArray.sort(function () {
    return Math.random() - 0.5;
  });
};
// получаем случайное описание жилища
var getTitle = function () {
  shuffle(FLAT_DESCRIPTIONS);
  for (var i = 0; i < FLAT_DESCRIPTIONS.length; i++) {
    var description = FLAT_DESCRIPTIONS[i];
  }
  return description;
};
// генерируем случайную цену в указанном диапазоне
var getPrice = function (min, max) {
  return (calculateRandomInt(min, max) + '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '₽/ночь';
};
// генерируем случайный тип жилья и переводим на русский
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
// генерируем случайное число комнат
var getRooms = function () {
  return calculateRandomInt(1, MAX_ROOMS_QUANTITY);
};
// генерируем случайное число гостей
var getGuests = function () {
  return calculateRandomInt(1, MAX_GUESTS_QUANTITY);
};
// генерируем случайное время приезда
var getCheckins = function () {
  return CHECKINS[calculateRandomInt(0, CHECKINS.length - 1)];
};
// генерируем случайное время отъезда
var getCheckouts = function () {
  return CHECKINS[calculateRandomInt(0, CHECKINS.length - 1)];
};
// генерируем случайное количество фич
var getFeatures = function () {
  FEATURES = shuffle(FEATURES);
  return FEATURES.slice(0, calculateRandomInt(0, FEATURES.length));
};
// получаем перемешанный массив фото
var getPhotos = function () {
  return shuffle(PHOTOS);
};
// генерируем случайные координаты
var getLocationX = function () {
  return calculateRandomInt(MIN_LEFT, MAX_LEFT);
};
var getLocationY = function () {
  return calculateRandomInt(MIN_TOP, MAX_TOP);
};
// адрес, представленный координатами
var getAddress = function () {
  return getLocationX() + ', ' + getLocationY();
};
// формируем строку адреса для разметки html
var getLocationXY = function (currentCard) {
  return 'left: ' + currentCard.location.x + 'px; ' + 'top: ' + currentCard.location.y + 'px;';
};
// переводить на русскай языка
var getCapacity = function (currentCard) {
  var capacityTextRooms = (currentCard.offer.rooms === 1) ? currentCard.offer.rooms + ' комната для ' : capacityTextRooms = (currentCard.offer.rooms === 5) ? currentCard.offer.rooms + ' комнат для ' : currentCard.offer.rooms + ' комнаты для ';
  var capacityTextGuests = (currentCard.offer.guests === 1) ? currentCard.offer.guests + ' гостя' : currentCard.offer.guests + ' гостей';
  return capacityTextRooms + capacityTextGuests;
};
// сообщение о въезде - выезде
var getCheckTime = function (currentCard) {
  return 'Заезд после ' + currentCard.offer.checkin + ', выезд до ' + currentCard.offer.checkout;
};
// структура объявления
for (var i = 0; i < CARDS_QUANTITY; i++) {
  cards[i] = {
    author: {
      avatar: 'img/avatars/user' + '0' + (i + 1) + '.png'
    },
    offer: {
      title: getTitle(getType()),
      address: getAddress(),
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

document.querySelector('.map').classList.remove('map--faded');

// создание фрагмента для добавления пина в разметку
var getPinFragment = function (array, createdomfunction) {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < array.length; j++) {
    fragment.appendChild(createdomfunction(array[j]));
  }
  return fragment;
};
// создание фрагмента для добавления карточки в разметку
var getCardFragment = function (array, createdomfunction) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(createdomfunction(array[0]));
  return fragment;
};
// создание фрагмента с новым списком фоток для добавления в разметку
var getPhotosFragment = function (currentCard) {
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < currentCard.offer.photos.length; j++) {
    var newPhoto = photosListItem.cloneNode(true);
    newPhoto.src = currentCard.offer.photos[j];
    fragment.appendChild(newPhoto);
  }
  return fragment;
};
//  формируем список опций
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
// формируем DOM элемент метки
var renderPins = function (currentCard) {
  var pinElement = pin.cloneNode(true);
  var pinElementClass = pinElement.querySelector('img');
  pinElementClass.src = currentCard.author.avatar;
  pinElementClass.alt = currentCard.offer.title;
  pin.style = getLocationXY(currentCard);
  return pinElement;
};
// формируем DOM элемент карточки
var renderCard = function (currentCard) {
  var cardElement = card.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = currentCard.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = getAddress(currentCard);
  cardElement.querySelector('.popup__text--price').textContent = currentCard.offer.price;
  cardElement.querySelector('.popup__type').textContent = currentCard.offer.type;
  cardElement.querySelector('.popup__text--capacity').textContent = getCapacity(currentCard);
  cardElement.querySelector('.popup__text--time').textContent = getCheckTime(currentCard);
  cardElement.querySelector('.popup__description').textContent = currentCard.offer.description;
  cardElement.querySelector('.popup__avatar').src = currentCard.author.avatar;
  cardElement.querySelector('.popup__photos').removeChild(cardElement.querySelector('.popup__photo'));
  cardElement.querySelector('.popup__photos').appendChild(getPhotosFragment(currentCard));
  showFeatures(cardElement, currentCard);
  return cardElement;
};
// добавляем метку в разметку
var insertFragmentPin = function () {
  mapPinContainer.appendChild(getPinFragment(cards, renderPins));
};
insertFragmentPin();
// добавляем карточку в разметку
var insertFragmentCard = function () {
  map.insertBefore(getCardFragment(cards, renderCard), mapFilters);
};
insertFragmentCard();
