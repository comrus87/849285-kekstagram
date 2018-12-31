'use strict';
(function () {
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var MIN_COMMENTS = 5;
  var MAX_COMMENTS = 10;

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
  window.generatePhotos = generatePhotos;
})();
