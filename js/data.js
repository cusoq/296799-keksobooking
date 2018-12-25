'use strict';

(function () {
  var CARDS_QUANTITY = 8;
  var MAX_ROOMS_QUANTITY = 5;
  var MAX_GUESTS_QUANTITY = 10;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_LEFT = 350;
  var MAX_LEFT = 900;
  var MIN_TOP = 130;
  var MAX_TOP = 630;
  var CHECKINS = ['12:00', '13:00', '14:00'];
  var FLAT_DESCRIPTIONS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  // адрес, представленный координатами:
  var getAddress = function (x, y) {
    return x + ', ' + y;
  };

  // формируем строку адреса для разметки html:
  var getLocationXY = function (currentCard) {
    return 'left: ' + currentCard.location.x + 'px; ' + 'top: ' + currentCard.location.y + 'px;';
  };

  // получаем случайное описание жилища:
  var getTitle = function () {
    var flatDescriptions = FLAT_DESCRIPTIONS;
    window.util.shuffle(flatDescriptions);
    for (var i = 0; i < 1; i++) {
      var description = flatDescriptions[i];
    }
    return description;
  };

  // генерируем целые случайные числа:
  var calculateRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
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
    var features = FEATURES;
    var randomFeatures = window.util.shuffle(features);
    return randomFeatures.slice(0, calculateRandomInt(0, features.length));
  };

  // получаем перемешанный массив фото:
  var getPhotos = function () {
    var photos = PHOTOS;
    return window.util.shuffle(photos);
  };
  // генерируем случайные координаты:
  var getLocationX = function () {
    return calculateRandomInt(MIN_LEFT, MAX_LEFT);
  };
  var getLocationY = function () {
    return calculateRandomInt(MIN_TOP, MAX_TOP);
  };

  // структура объявления:
  var cards = [];
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

  window.data = {
    getLocationXY: getLocationXY,
    cards: cards
  };
})();
