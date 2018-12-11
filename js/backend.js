'use strict';

// (function () {
//   var URL_DATA = 'https://js.dump.academy/keksobooking/data';
//   var URL_ONLOAD = 'https://js.dump.academy/keksobookingq';
//   // Загрузка данных с сетевого ресурса
//   var load = function (onDataLoad, onError) {
//     var xhr = new XMLHttpRequest();
//     xhr.responseType = 'json';
//
//     xhr.addEventListener('load', function () {
//       if (xhr.status === 200) {
//         onDataLoad(xhr.response);
//       } else {
//         onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
//       }
//     });
//     xhr.addEventListener('error', function () {
//       onError('Произошла ошибка соединения');
//     });
//     xhr.addEventListener('timeout', function () {
//       onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
//     });
//
//     xhr.timeout = 10000;
//
//     xhr.open('GET', URL_DATA);
//     xhr.send();
//   };
//   // Отпрвка данных формы на сервер
//   var save = function (data, onLoad, onError) {
//     var xhr = new XMLHttpRequest();
//     xhr.responseType = 'json';
//     // xhr.addEventListener('load', function () {
//     //   if (xhr.status === 200) {
//     //     onLoad(xhr.response);
//     //   } else {
//     //     onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
//     //   }
//     // });
//     xhr.addEventListener('load', function () {
//       onLoad(xhr.response);
//     }, onError);
//
//     xhr.open('POST', URL_ONLOAD);
//     xhr.send(data);
//   };
//
//   window.backend = {
//     load: load,
//     save: save
//   };
// })();

window.backend = (function () {
  var URL_DATA = 'https://js.dump.academy/keksobooking/data';
  var URL_ONLOAD = 'https://js.dump.academy/keksobookingq';

  // /**
  //  * Возвращает объект XMLHttpRequest
  //  * @param {Function} onLoad
  //  * @param {Function} onError
  //  * @return {XMLHttpRequest}
  //  */
  var checkError = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

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

  // /**
  //  * Загружает данные
  //  * @param {Function} onLoad
  //  * @param {Function} onError
  //  */
  var load = function (onLoad, onError) {
    var xhr = checkError(onLoad, onError);

    xhr.open('GET', URL_DATA);
    xhr.send();
  };

  // ///////////////////////////////////////////////////// //

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
