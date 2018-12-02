'use strict';

var minLikes = 15;
var maxLikes = 200;
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

var arrayName = ['Артем', 'Алексей', 'Максим', 'Наталья', 'Евгения', 'Жорик'];

// Находим случайное значение
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};


var getRandomArray = function (array) {
  var rand = Math.random() * array.length;
  rand = Math.floor(rand);
  return array[rand];
};


var getComments = function () {
  var comments = [];
  var commentsNumbe = getRandomNumber(MIN_COMMENTS, MAX_COMMENTS);
  for (var i = 0; i < commentsNumbe; i++) {
    comments[i] = {
      avatar: 'img/avatar-' + (getRandomNumber(0, 6)) + '.svg',
      message: getRandomArray(messages),
      name: getRandomArray(arrayName)
    };
  }
  return comments;
};


var generationPhotos = function (count) {
  var arrPhotos = [];
  for (var i = 0; i < count; i++) {
    arrPhotos[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(minLikes, maxLikes),
      comments: getComments(),
      descriptions: getRandomArray(descriptions)
    };
  }
  return arrPhotos;
};

var photos = generationPhotos(MAX_COUNT);

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

