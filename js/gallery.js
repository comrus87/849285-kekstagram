'use strict';
(function () {
  // Отрисовываем миниаютюры
  var MAX_COUNT = 25;

  // var photos = window.generatePhotos(MAX_COUNT);
  var photos = [];
  var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var photoContainer = document.querySelector('.pictures');

  var renderPhoto = function (photo) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
    return photoElement;
  };

  var renderAllPhoto = function (photosArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < MAX_COUNT; i++) {
      fragment.appendChild(renderPhoto(photosArray[i]));
    }
    photoContainer.appendChild(fragment);
  };

  var onSuccessLoad = function (photosArray) {
    photos = photosArray;
    renderAllPhoto(photos);
    return photos;
  };

  var onErrorLoad = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.getData(onSuccessLoad, onErrorLoad);
  window.photos = photos;
})();