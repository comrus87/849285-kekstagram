'use strict';

var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 5;
var MAX_COMMENTS = 10;
var MAX_COUNT = 25;
var messages = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var descriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var names = ['Артем', 'Алексей', 'Максим', 'Наталья', 'Евгения', 'Жорик'];

var ESC_KEYCODE = 27;
// var ENTER_KEYCODE = 13;

// Находим случайное значение
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};


var getRandomElement = function (elements) {
  var rand = Math.floor(Math.random() * elements.length);
  return elements[rand];
};


var getComments = function () {
  var comments = [];
  var commentsNumber = getRandomNumber(MIN_COMMENTS, MAX_COMMENTS);
  for (var i = 0; i < commentsNumber; i++) {
    comments[i] = {
      avatar: 'img/avatar-' + (getRandomNumber(1, 6)) + '.svg',
      message: getRandomElement(messages),
      name: getRandomElement(names)
    };
  }
  return comments;
};


var generatePhotos = function (count) {
  var arrPhotos = [];
  for (var i = 0; i < count; i++) {
    arrPhotos[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
      comments: getComments(),
      descriptions: getRandomElement(descriptions)
    };
  }
  return arrPhotos;
};

var photos = generatePhotos(MAX_COUNT);

// Начинаем работать с DOM-деревом
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

var bigPicture = document.querySelector('.big-picture');

var socialComments = document.querySelector('.social__comments');
var socialItemComments = document.querySelector('.social__comment');


var renderComment = function (comment) {
  var commentElement = socialItemComments.cloneNode(true);
  commentElement.querySelector('.social__picture').src = comment.avatar;
  commentElement.querySelector('.social__text').textContent = comment.message;
  return commentElement;
};

var renderAllComments = function (comments) {
  socialComments.innerHTML = '';
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < comments.length; i++) {
    fragment.appendChild(renderComment(comments[i]));
  }
  socialComments.appendChild(fragment);
};

var renderBigPicture = function (picture) {
  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.descriptions;
  renderAllComments(picture.comments);
};

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');


var templateListComment = document.querySelector('.social__comments');
var templateComment = document.querySelectorAll('.social__comment');
templateListComment.removeChild(templateComment[0]);
templateListComment.removeChild(templateComment[1]);

var cancelBigPicture = document.querySelector('.big-picture__cancel');
var thumbnails = document.querySelectorAll('.picture__img');
var body = document.querySelector('body');

var onEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeBigPicture();
    closeUploadFile();
  }
};

var openBigPicture = function (i, photo) {
  thumbnails[i].addEventListener('click', function () {
    bigPicture.classList.remove('hidden');
    renderBigPicture(photo);
    body.classList.add('modal-open');
    document.addEventListener('keydown', onEscPress);
  });
};

var renderAllBigPicture = function () {
  for (var i = 0; i < thumbnails.length; i++) {
    openBigPicture(i, photos[i]);
  }
};

renderAllBigPicture();

var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscPress);
};

cancelBigPicture.addEventListener('click', function () {
  closeBigPicture();
});

// ЗАГРУЗАКА ИЗОБРАЖЕНИЯ
var uploadFile = document.querySelector('#upload-file');
var uploadImage = document.querySelector('.img-upload__overlay');
var cancelUploadFile = document.querySelector('.img-upload__cancel');


uploadFile.addEventListener('change', function () {
  uploadImage.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onEscPress);
});

var closeUploadFile = function () {
  uploadImage.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscPress);
  uploadFile.value = '';
};

cancelUploadFile.addEventListener('click', function () {
  closeUploadFile();
});

// НАЛОЖЕНИЕ ЭФФЕКТОВ НА ИЗОБРАЖЕНИЕ

var imgPreview = document.querySelector('.img-upload__preview img');
var buttonsEffectsList = document.querySelector('.effects__list');

// ПРИСВАИВАЕМ ГЛАВНОЙ ФОТО КЛАССЫ ЧЕКНУТЫХ РАДИОБАТОНОВ
buttonsEffectsList.addEventListener('change', function () {
  var filterChecked = buttonsEffectsList.querySelector('input:checked');
  imgPreview.className = 'effects__preview--' + filterChecked.value;
});
