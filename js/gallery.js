'use strict';
(function () {
  // Отрисовываем миниаютюры
  var MAX_COUNT = 25;

  var photos = window.generatePhotos(MAX_COUNT);

  var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var photoContainer = document.querySelector('.pictures');

  var renderPhoto = function (photo) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
    return photoElement;
  };

  var renderAllPhoto = function () {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(renderPhoto(photos[i]));
    }
    photoContainer.appendChild(fragment);
  };

  renderAllPhoto();
  window.photos = photos;
})();
