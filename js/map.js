'use strict';

(function () {

  var PIN_POINTER_HEIGHT = 17; // высота псевдоэлемента-указателя за вычетом толщины рамки пина, взята из разметки
  var START_X = 570; // начальные координаты главного пина
  var START_Y = 375; // начальные координаты главного пина

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

  var mapPinMain = document.querySelector('.map__pin--main');
  var resetButton = document.querySelector('.ad-form__reset');

  // получение координат главного пина:
  var getMainPinPosition = function () {
    return {
      x: Math.round((mapPinMain.offsetLeft + mapPinMain.offsetWidth / 2)),
      y: Math.round((mapPinMain.offsetTop + mapPinMain.offsetHeight + PIN_POINTER_HEIGHT))
    };
  };

  // заполнение поля адреса главного пина:
  var fillAddress = function () {
    var location = getMainPinPosition();
    document.getElementById('address').value = location.x + ', ' + location.y;
  };

  // при нажатии на главную метку:
  var onMainPinMousedown = function () {
    event.preventDefault();
    mapPinMain.addEventListener('mouseup', onMainPinMouseup);
    mapPinMain.removeEventListener('mousedown', onMainPinMousedown);
  };

  // что происходит при отпускании главной метки: активируются карты и формы, отображается адрес в соотв. поле формы:
  var onMainPinMouseup = function () {
    event.preventDefault();
    window.util.adForm.classList.remove('ad-form--disabled');
    window.util.setElementsEnabled(window.util.adFormFieldsets);
    window.util.setElementsEnabled(window.util.mapFilterItems);
    fillAddress();
    window.util.capacityInput.value = '1';
    window.util.priceInput.min = window.util.PRICE['flat'];
    for (var t = 0; t < window.util.capacityInputOptions.length; t++) {
      window.util.capacityInputOptions[t].disabled = !window.util.CAPACITY[window.util.roomNumberInput.value].includes(window.util.capacityInputOptions[t].value);
    }
    window.pins.insertFragmentPin();
    mapPinMain.removeEventListener('mouseup', onMainPinMouseup);
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
      window.util.map.classList.remove('map--faded');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Удаляет пины с карты
  var removePins = function () {
    var mapPinsItems = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var m = 0; m < mapPinsItems.length; m++) {
      mapPinsItems[m].remove();
    }
  };

  // Удаляет объявление с карты
  var removeMapCard = function () {
    window.util.closePopup(window.util.presentCard);
  };

  // действия при клике на ресет:
  var onClickReset = function () {
    event.preventDefault();
    window.filter.deactivateFilters();
    removeMapCard();
    mapPinMain.style.top = START_Y + 'px';
    mapPinMain.style.left = START_X + 'px';
    fillAddress();
    removePins();
    window.util.map.classList.add('map--faded');
    mapPinMain.addEventListener('mousedown', onMainPinMousedown);
  };

  // ОБРАБОТЧИКИ:

  // обработчик перетаскивания гланого пина:
  mapPinMain.addEventListener('mousedown', onMainPinDrag);
  // ообработчик нажатия сброса:
  resetButton.addEventListener('click', onClickReset);
  // ообработчик нажатия главной метки:
  mapPinMain.addEventListener('mousedown', onMainPinMousedown);
  window.map = {
    mapPinMain: mapPinMain,
    removePins: removePins,
    removeMapCard: removeMapCard,
    fillAddress: fillAddress,
    onMainPinMousedown: onMainPinMousedown
  };
})();
