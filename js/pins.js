'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var card = document.querySelector('#card').content.querySelector('.map__card');
  var pin = document.querySelector('#pin').content.querySelector('.map__pin');
  var success = document.querySelector('#success').content.querySelector('.success');
  var error = document.querySelector('#error').content.querySelector('.error');
  var mapFilters = document.querySelector('.map__filters-container');
  var mapPinContainer = document.querySelector('.map__pins');
  var photosListItem = document.querySelector('#card').content.querySelector('.popup__photo');
  // переводить на русскай языка:
  var getCapacity = function (currentCard) {
    var capacityTextRooms;
    var capacityTextGuests;
    if (currentCard.offer.rooms === 1) {
      capacityTextRooms = currentCard.offer.rooms + ' комната для ';
    } else if (currentCard.offer.rooms === 5) {
      capacityTextRooms = currentCard.offer.rooms + ' комнат для ';
    } else {
      capacityTextRooms = currentCard.offer.rooms + ' комнаты для ';
    }
    if (currentCard.offer.guests === 1) {
      capacityTextGuests = currentCard.offer.guests + ' гостя';
    } else {
      capacityTextGuests = currentCard.offer.guests + ' гостей';
    }
    return capacityTextRooms + capacityTextGuests;
  };
  // сообщение о въезде - выезде:
  var getCheckTime = function (currentCard) {
    return 'Заезд после ' + currentCard.offer.checkin + ', выезд до ' + currentCard.offer.checkout;
  };
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
  // создание фрагмента с сообщением о неуспешнлй отправке формы:
  var getErrorFragment = function () {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(renderError());
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
    pin.style = window.data.getLocationXY(currentCard);
    // клик на метку показывает карточку:
    pinElement.addEventListener('click', function () {
      window.util.closePopup(window.util.presentCard);
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
  // формируем DOM элемент сообщения об ошибке отправки формы:
  var renderError = function () {
    document.addEventListener('keydown', onEscClose);
    document.addEventListener('click', onClickClose);
    return error.cloneNode(true);
  };

  // добавляем метку в разметку:
  var insertFragmentPin = function () {
    mapPinContainer.appendChild(getPinFragment(window.data.cards, renderPins));
    window.util.mapPins = document.querySelectorAll('.map__pin');
  };
  // добавляем карточку в разметку:
  var insertFragmentCard = function (currentCard) {
    window.util.map.insertBefore(getCardFragment(currentCard, renderCard), mapFilters);
    window.util.presentCard = document.querySelector('.map__card');
  };
  // добавляем сообщениe об успехе в разметку:
  var insertFragmentSuccess = function () {
    document.querySelector('main').appendChild(getSuccessFragment(renderSuccess));
    window.util.successWindow = document.querySelector('.success');
  };
  // добавляем сообщениe об ошибке отправки формы в разметку:
  var insertFragmentError = function () {
    document.querySelector('main').appendChild(getErrorFragment(renderError));
    window.util.errorWindow = document.querySelector('.error');
  };

  // что происходит при нажатии Esc:
  var onEscClose = function (event) {
    if (event.keyCode === ESC_KEYCODE) {
      window.util.closePopup(window.util.presentCard);
      window.util.closePopup(window.util.successWindow);
      window.util.closePopup(window.util.errorWindow);
      document.removeEventListener('keydown', onEscClose);
    }
  };

  // что происходит при клике на сообщении об успехе:
  var onClickClose = function () {
    window.util.closePopup(window.util.successWindow);
    window.util.closePopup(window.util.errorWindow);
    window.util.setElementsEnabled(window.util.adFormFieldsets);
    document.removeEventListener('click', onClickClose);
  };
  window.pins = {
    insertFragmentPin: insertFragmentPin,
    insertFragmentSuccess: insertFragmentSuccess,
    insertFragmentError: insertFragmentError
  };
})();
