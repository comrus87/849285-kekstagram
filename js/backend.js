'use strict';
(function () {
  var STATUS_OK = 200;
  var TIME = 10000;
  var URL_GET = 'https://js.dump.academy/kekstagram/data';
  var URL_POST = 'https://js.dump.academy/kekstagram';
  var getRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onLoad(xhr.response);
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

    xhr.timeout = TIME;
    return xhr;
  };

  var getData = function (onLoad, onError) {
    var get = getRequest(onLoad, onError);
    get.open('GET', URL_GET);
    get.send();
  };

  var postData = function (data, onLoad, onError) {
    var post = getRequest(onLoad, onError);
    post.open('POST', URL_POST);
    post.send(data);
  };

  window.backend = {
    getData: getData,
    postData: postData
  };
})();
