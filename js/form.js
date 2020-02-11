'use strict';

(function () {
  var MAX_CAPACITY = '100';
  var MIN_CAPACITY = '0';
  var typeInput = document.getElementById('type');
  var titleInput = document.getElementById('title');
  var timeInInput = document.getElementById('timein');
  var timeOutInput = document.getElementById('timeout');

  // назначение соответствия количества гостей количеству комнат по событию 'change'::
  var onChangeRoomsGuestsSync = function () {
    for (var t = 0; t < window.util.capacityInputOptions.length; t++) {
      window.util.capacityInputOptions[t].disabled = !window.util.CAPACITY[window.util.roomNumberInput.value].includes(window.util.capacityInputOptions[t].value);
    }
    return (window.util.roomNumberInput.value === MAX_CAPACITY) ? (window.util.capacityInput.value = MIN_CAPACITY) : (window.util.capacityInput.value = window.util.roomNumberInput.value);
  };

  // назначение соответствия цены типу жилья по событию 'change':
  var onChangePriceFlatSync = function (evt) {
    window.util.priceInput.min = window.util.PRICE[evt.target.value];
    window.util.priceInput.placeholder = window.util.PRICE[evt.target.value];
  };
  // назначение соответствия времени въезда-выезда по событию 'change':
  var onChangeCheckInSync = function () {
    timeInInput.value = timeOutInput.value;
  };
  var onChangeCheckOutSync = function () {
    timeOutInput.value = timeInInput.value;
  };
  // что происходит при отправке данных:
  // в случае исключения
  var onErrorSave = function () {
    window.pins.insertFragmentError();
  };
  // в штатном режиме
  var onSubmit = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(window.util.adForm), function () {
      window.util.closePopup(window.util.presentCard);
      window.pins.insertFragmentSuccess();
      window.util.setElementsDisabled(window.util.adFormFieldsets);
      window.util.adForm.reset();
      window.util.mapPins.forEach(function (item) {
        if (!item.classList.contains('map__pin--main')) {
          item.remove();
        }
      });
      window.map.fillAddress();
      window.util.map.classList.add('map--faded');
      window.util.adForm.classList.add('ad-form--disabled');
      window.map.mapPinMain.addEventListener('mousedown', window.map.onMainPinMousedown);
    }, onErrorSave);
    window.filter.deactivate();
  };

  // ОБРАБОТЧИКИ:

  // обработчик синхронизации цены и типа жилья:
  typeInput.addEventListener('change', onChangePriceFlatSync);
  // обработчик синхронизации количества гостей и комнат:
  window.util.roomNumberInput.addEventListener('change', onChangeRoomsGuestsSync);
  // обработчики синхронизации времени въезда-выезда:
  timeInInput.addEventListener('change', onChangeCheckOutSync);
  timeOutInput.addEventListener('change', onChangeCheckInSync);
  // обработчик события отправки формы:
  window.util.adForm.addEventListener('submit', onSubmit, onErrorSave);

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

  window.util.priceInput.addEventListener('input', function () {
    if (window.util.priceInput.validity.rangeUnderflow) {
      window.util.priceInput.setCustomValidity('Этот тип жилья по такой цене недоступен');
      window.util.priceInput.classList.add('invalid');
    } else if (window.util.priceInput.validity.rangeOverflow) {
      window.util.priceInput.setCustomValidity('Опомнитесь!');
      window.util.priceInput.classList.add('invalid');
    } else if (window.util.priceInput.validity.valueMissing) {
      window.util.priceInput.setCustomValidity('Обязательное поле');
      window.util.priceInput.classList.add('invalid');
    } else {
      window.util.priceInput.setCustomValidity('');
      window.util.priceInput.classList.remove('invalid');
    }
  });

  // все поля форм по умолчанию неактивны:
  window.util.setElementsDisabled(window.util.adFormFieldsets);
  window.util.setElementsDisabled(window.util.mapFilterItems);
})();
