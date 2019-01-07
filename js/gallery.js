'use strict';
(function () {
  var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var photoContainer = document.querySelector('.pictures');
  var imageFilters = document.querySelector('.img-filters');
  var filterPopular = imageFilters.querySelector('#filter-popular');
  var filterNew = imageFilters.querySelector('#filter-new');
  var filterDiscussed = imageFilters.querySelector('#filter-discussed');
  var NEW_PICTURES = 10;

  var renderPhoto = function (photo) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
    return photoElement;
  };

  var renderAllPhoto = function (photosArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photosArray.length; i++) {
      fragment.appendChild(renderPhoto(photosArray[i]));
    }
    photoContainer.appendChild(fragment);
    var thumbnails = document.querySelectorAll('.picture');
    window.preview.renderAllBigPicture(thumbnails, photosArray);
  };

  var onSuccessLoad = function (photosArray) {
    window.photos = photosArray;
    renderAllPhoto(window.photos);
    imageFilters.classList.remove('img-filters--inactive');
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

  // функция переключения кнопок
  var checkActiveFilter = function (filter) {
    var checkedFilter = imageFilters.querySelector('.img-filters__button--active');
    if (checkedFilter) {
      checkedFilter.classList.remove('img-filters__button--active');
    }
    filter.classList.add('img-filters__button--active');
  };

  // функция для удаления
  var removePictures = function () {
    var pictures = photoContainer.querySelectorAll('.picture');
    pictures.forEach(function (elem) {
      photoContainer.removeChild(elem);
    });
  };

  var updatePictures = function (newArray) {
    removePictures();
    renderAllPhoto(newArray);
  };

  var onfilterPopular = function () {
    checkActiveFilter(filterPopular);
    var copyPhotos = window.photos;
    updatePictures(copyPhotos);
  };

  var getRandomArray = function (array) {
    for (var i = 0; i < array.length; i++) {
      var randomIndex = Math.round(Math.random() * (array.length - 1));
      var element = array[i];
      array[i] = array[randomIndex];
      array[randomIndex] = element;
    }
    return array;
  };

  var onfilterNew = function () {
    checkActiveFilter(filterNew);
    var copyPhotos = window.photos.slice();
    var randomCopyPhotos = getRandomArray(copyPhotos).slice(0, NEW_PICTURES);
    updatePictures(randomCopyPhotos);
  };

  var onfilterDiscussed = function () {
    checkActiveFilter(filterDiscussed);
    var copyPhotos = window.photos.slice();
    copyPhotos.sort(function (a, b) {
      return (b.comments.length - a.comments.length);
    });
    updatePictures(copyPhotos);
  };

  filterPopular.addEventListener('click', function () {
    window.debounce(onfilterPopular);
  });
  filterNew.addEventListener('click', function () {
    window.debounce(onfilterNew);
  });
  filterDiscussed.addEventListener('click', function () {
    window.debounce(onfilterDiscussed);
  });
})();
