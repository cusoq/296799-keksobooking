'use strict';

window.backend = (function () {
  var URL_DATA = 'https://js.dump.academy/keksobooking/data';
  var URL_ONLOAD = 'https://js.dump.academy/keksobooking';

  var checkError = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 1500; // ms

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + '' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  // Загружаем объявления по сети
  var load = function (onLoad, onError) {
    var xhr = checkError(onLoad, onError);

    xhr.open('GET', URL_DATA);
    xhr.send();
  };

  // Отправляем данные формы на сервер
  var save = function (data, onLoad, onError) {
    var xhr = checkError(onLoad, onError);

    xhr.open('POST', URL_ONLOAD);
    xhr.send(data);
  };

  return {
    load: load,
    save: save
  };

})();
