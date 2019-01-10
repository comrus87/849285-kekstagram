'use strict';
(function () {
  var NEW_PICTURES = 10;
  var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var photoContainer = document.querySelector('.pictures');
  var imageFilters = document.querySelector('.img-filters');
  var filterPopular = imageFilters.querySelector('#filter-popular');
  var filterNew = imageFilters.querySelector('#filter-new');
  var filterDiscussed = imageFilters.querySelector('#filter-discussed');

  var renderPhoto = function (photo) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
    return photoElement;
  };

  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();
    photos.forEach(function (photo) {
      fragment.appendChild(renderPhoto(photo));
    });
    photoContainer.appendChild(fragment);
    var thumbnails = document.querySelectorAll('.picture');
    window.preview.renderAllBigPicture(thumbnails, photos);
  };

  var onSuccessLoad = function (photos) {
    window.gallery.photos = photos;
    renderPhotos(window.gallery.photos);
    imageFilters.classList.remove('img-filters--inactive');
  };

  window.backend.getData(onSuccessLoad, window.onErrorLoad);

  var checkActiveFilter = function (filter) {
    var checkedFilter = imageFilters.querySelector('.img-filters__button--active');
    if (checkedFilter) {
      checkedFilter.classList.remove('img-filters__button--active');
    }
    filter.classList.add('img-filters__button--active');
  };

  var removePictures = function () {
    var pictures = photoContainer.querySelectorAll('.picture');
    pictures.forEach(function (elem) {
      photoContainer.removeChild(elem);
    });
  };

  var updatePictures = function (newArray) {
    removePictures();
    renderPhotos(newArray);
  };

  var onFilterPopular = function () {
    checkActiveFilter(filterPopular);
    var copyPhotos = window.gallery.photos;
    updatePictures(copyPhotos);
  };

  var getRandomArray = function (array) {
    array.forEach(function (photo, i) {
      var randomIndex = Math.round(Math.random() * (array.length - 1));
      var element = array[i];
      array[i] = array[randomIndex];
      array[randomIndex] = element;
    });
    return array;
  };

  var onFilterNew = function () {
    checkActiveFilter(filterNew);
    var copyPhotos = window.gallery.photos.slice();
    var randomCopyPhotos = getRandomArray(copyPhotos).slice(0, NEW_PICTURES);
    updatePictures(randomCopyPhotos);
  };

  var onFilterDiscussed = function () {
    checkActiveFilter(filterDiscussed);
    var copyPhotos = window.gallery.photos.slice();
    copyPhotos.sort(function (a, b) {
      return (b.comments.length - a.comments.length);
    });
    updatePictures(copyPhotos);
  };

  filterPopular.addEventListener('click', function () {
    window.debounce(onFilterPopular);
  });
  filterNew.addEventListener('click', function () {
    window.debounce(onFilterNew);
  });
  filterDiscussed.addEventListener('click', function () {
    window.debounce(onFilterDiscussed);
  });
  window.gallery = {
    photos: []
  };
})();
