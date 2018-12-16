'use strict';

(function () {
  var filtered;
  var filtersForm = document.querySelector('.map__filters');
  var houseField = filtersForm.querySelector('#housing-type');
  // var priceField = filtersForm.querySelector('#housing-price');
  // var roomsField = filtersForm.querySelector('#housing-rooms');
  // var guestsField = filtersForm.querySelector('#housing-guests');
  // var featuresSet = filtersForm.querySelectorAll('.map__features input');
  /**
 * Обновляет количество пинов на карте
 * @param {Array.<Ad>} adverts
 */
  var updatePins = function () {
    // window.card.close();
    var pins = document.querySelectorAll('.map__pin');
    var oldPins = window.util.mapPins;
    oldPins.forEach(function (pin) {
      pin.parentElement.removeChild(pin);
    });
    window.util.mapPins.appendChild(pins);
  };

  /**
   * Фильтрует пины по типу жилья
   * @param {Ad} ad
   * @return {Boolean}
   */
  var isTypeMatch = function (ad) {
    return houseField.value === 'any' ?
      true :
      ad.offer.type === houseField.value;
  };

  var fnFilters = [isTypeMatch];
  filtersForm.addEventListener('change', function () {
    filtered = window.data.cards.filter(function (ad) {
      return fnFilters.every(function (fn) {
        return fn(ad);
      });
    });
    // refreshPins();
  });

  window.filter = {
    filtered: filtered,
    updatePins: updatePins
  };
})();
