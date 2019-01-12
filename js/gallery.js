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
    window.debounce(function () {
      removePictures();
      renderPhotos(pictures);
    });
  };


  var setFilterPopular = function () {
    changeActiveFilter(filterPopular);
    var copyPhotos = window.gallery.photos;
    updatePictures(copyPhotos);
  };

  var shuffleArray = function (photos) {
    photos.forEach(function (photo, i) {
      var randomIndex = Math.round(Math.random() * (photos.length - 1));
      var element = photos[i];
      photos[i] = photos[randomIndex];
      photos[randomIndex] = element;
    });
    return photos;
  };

  var setFilterNew = function () {
    changeActiveFilter(filterNew);
    var copyPhotos = window.gallery.photos.slice();
    var randomCopyPhotos = shuffleArray(copyPhotos).slice(0, NEW_PICTURES);
    updatePictures(randomCopyPhotos);
  };

  var setFilterDiscussed = function () {
    changeActiveFilter(filterDiscussed);
    var copyPhotos = window.gallery.photos.slice();
    copyPhotos.sort(function (a, b) {
      return (b.comments.length - a.comments.length);
    });
    updatePictures(copyPhotos);
  };

  var onFilterSelect = function (evt) {
    var target = evt.target;
    if (filterPopular === target) {
      setFilterPopular();
    } else if (filterNew === target) {
      setFilterNew();
    } else if (filterDiscussed === target) {
      setFilterDiscussed();
    }
  };

  imgFiltersForm.addEventListener('click', onFilterSelect);

  window.gallery = {
    photos: []
  };
})();
