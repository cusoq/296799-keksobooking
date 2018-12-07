'use strict';

(function () {
  var URL_DATA = 'https://js.dump.academy/keksobooking/data';
  var URL_ONLOAD = 'https://js.dump.academy/keksobooking';
  // Загрузка данных с сетевого ресурса
  var load = function (onDataLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onDataLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open('GET', URL_DATA);
    xhr.send();
  };
  // Отпрвка данных формы на сервер
  var save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.open('POST', URL_ONLOAD);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
