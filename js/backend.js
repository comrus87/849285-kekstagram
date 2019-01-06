'use strict';
(function () {
  var URL_GET = 'https://js.dump.academy/kekstagram/data';
  var URL_POST = 'https://js.dump.academy/kekstagram';
  var sendRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      // console.log(xhr.response);
      if (xhr.status === 200) {
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

    xhr.timeout = 10000; // 10s
    return xhr;
  };

  var getData = function (onLoad, onError) {
    var get = sendRequest(onLoad, onError);
    get.open('GET', URL_GET);
    get.send();
  };

  var postData = function (data, onLoad, onError) {
    var post = sendRequest(onLoad, onError);
    post.open('POST', URL_POST);
    post.send(data);
  };

  window.backend = {
    getData: getData,
    postData: postData
  };
})();
