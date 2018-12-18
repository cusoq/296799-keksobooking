'use strict';
(function () {
  var PRICE = {
    'flat': 1000,
    'bungalo': 0,
    'house': 5000,
    'palace': 10000
  };
  var CAPACITY = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var DEBOUNCE_INTERVAL = 300;

  var priceInput = document.getElementById('price');
  var roomNumberInput = document.getElementById('room_number');
  var adForm = document.querySelector('.ad-form');
  var capacityInput = document.getElementById('capacity');
  var capacityInputOptions = capacityInput.querySelectorAll('option');
  var map = document.querySelector('.map');
  var adFormFieldsets = adForm.querySelectorAll('.ad-form__element');
  var mapFilterItems = document.querySelectorAll('.map__filter');
  var mapPins;
  var presentCard;
  var successWindow;
  var errorWindow;
  // закрывает попап:
  var closePopup = function (popup) {
    if (popup) {
      popup.remove();
    }
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

  // перемешиваем массив:
  var shuffle = function (currentArray) {
    return currentArray.sort(function () {
      return Math.random() - 0.5;
    });
  };

  var debounce = function (fun) {
    var lastTimeout = null;
    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    PRICE: PRICE,
    CAPACITY: CAPACITY,
    // ESC_KEYCODE: ESC_KEYCODE,
    priceInput: priceInput,
    roomNumberInput: roomNumberInput,
    adForm: adForm,
    capacityInput: capacityInput,
    capacityInputOptions: capacityInputOptions,
    map: map,
    mapFilterItems: mapFilterItems,
    mapPins: mapPins,
    presentCard: presentCard,
    adFormFieldsets: adFormFieldsets,
    successWindow: successWindow,
    errorWindow: errorWindow,
    closePopup: closePopup,
    setElementsDisabled: setElementsDisabled,
    setElementsEnabled: setElementsEnabled,
    shuffle: shuffle,
    debounce: debounce
  };
})();
