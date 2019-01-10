'use strict';
(function () {
  var NEW_PICTURES = 10;
  var photoTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var photoContainer = document.querySelector('.pictures');
  var imageFilters = document.querySelector('.img-filters');
  var filterPopular = imageFilters.querySelector('#filter-popular');
  var filterNew = imageFilters.querySelector('#filter-new');
  var filterDiscussed = imageFilters.querySelector('#filter-discussed');
  var checkedFilter = imageFilters.querySelector('.img-filters__button--active');
  var imgFiltersForm = document.querySelector('.img-filters__form');
  var thumbnails = [];

  var renderPhoto = function (photo) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
    return photoElement;
  };

  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();
    thumbnails = photos.map(function (photo) {
      return fragment.appendChild(renderPhoto(photo));
    });
    photoContainer.appendChild(fragment);
    window.preview.renderBigPictures(thumbnails, photos);
  };

  var onSuccessLoad = function (photos) {
    window.gallery.photos = photos;
    renderPhotos(window.gallery.photos);
    imageFilters.classList.remove('img-filters--inactive');
  };

  window.backend.getData(onSuccessLoad, window.onErrorLoad);

  var changeActiveFilter = function (filter) {
    checkedFilter.classList.remove('img-filters__button--active');
    filter.classList.add('img-filters__button--active');
    checkedFilter = filter;
  };

  var removePictures = function () {
    thumbnails.forEach(function (elem) {
      photoContainer.removeChild(elem);
    });
  };

  var updatePictures = function (pictures) {
    removePictures();
    renderPhotos(pictures);
  };

  var onFilterPopular = function () {
    changeActiveFilter(filterPopular);
    var copyPhotos = window.gallery.photos;
    updatePictures(copyPhotos);
  };

  var getRandomArray = function (shuffleArray) {
    shuffleArray.forEach(function (photo, i) {
      var randomIndex = Math.round(Math.random() * (shuffleArray.length - 1));
      var element = shuffleArray[i];
      shuffleArray[i] = shuffleArray[randomIndex];
      shuffleArray[randomIndex] = element;
    });
    return shuffleArray;
  };

  var onFilterNew = function () {
    changeActiveFilter(filterNew);
    var copyPhotos = window.gallery.photos.slice();
    var randomCopyPhotos = getRandomArray(copyPhotos).slice(0, NEW_PICTURES);
    updatePictures(randomCopyPhotos);
  };

  var onFilterDiscussed = function () {
    changeActiveFilter(filterDiscussed);
    var copyPhotos = window.gallery.photos.slice();
    copyPhotos.sort(function (a, b) {
      return (b.comments.length - a.comments.length);
    });
    updatePictures(copyPhotos);
  };

  imgFiltersForm.addEventListener('click', function (evt) {
    var target = evt.target;
    if (filterPopular === target) {
      window.debounce(onFilterPopular);
    } else if (filterNew === target) {
      window.debounce(onFilterNew);
    } else if (filterDiscussed === target) {
      window.debounce(onFilterDiscussed);
    }
  });

  window.gallery = {
    photos: []
  };
})();
