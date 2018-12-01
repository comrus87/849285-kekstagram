'use strict';

var minPicture = 1;
var maxPicture = 25;
var minLikes = 15;
var maxLikes = 200;
var messages = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var arrayName = ['Артем', 'Алексей', 'Максим', 'Наталья', 'Евгения', 'Жорик'];

// Находим случайное значение для фото и лайков
var getRandomNumber = function (min, max) {
  return Math.random() * (max - min) + min;
};

var randomPicture = Math.floor(getRandomNumber(minPicture, maxPicture));
var randomNumberLikes = Math.floor(getRandomNumber(minLikes, maxLikes));

// Находим  случайное значение для сообщений и имени
var randomMessage = Math.floor(Math.random() * messages.length);
var randomName = Math.floor(Math.random() * arrayName.length);

// создаем объект
var objectComments = {
  avatar: 'img/avatar-' + Math.floor(getRandomNumber(0, 6)) + '.svg',
  message: messages[randomMessage],
  name: arrayName[randomName]
};


var photo = {
  url: 'photos/' + randomPicture + '.jpg',
  likes: randomNumberLikes,
  comments: objectComments
};


// for (var i = 0; i < 25; i++) {

// }
