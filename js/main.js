'use strict';

var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 5;
var MAX_COMMENTS = 10;
var MAX_COUNT = 25;
var CONTROL_STEP = 25;
var MAX_CONTROL = 100;
var MAX_LENGTH_TAG = 20;
var MAX_COUNT_TAG = 5;
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
var thumbnails = document.querySelectorAll('.picture');
var body = document.querySelector('body');

var onEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeBigPicture();
    closeUploadFile();
  }
};

var addThumbnailListener = function (i, photo) {
  thumbnails[i].addEventListener('click', function () {
    bigPicture.classList.remove('hidden');
    renderBigPicture(photo);
    body.classList.add('modal-open');
    document.addEventListener('keydown', onEscPress);
  });
};

var renderAllBigPicture = function () {
  for (var i = 0; i < thumbnails.length; i++) {
    addThumbnailListener(i, photos[i]);
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
  effectLevel.classList.add('hidden');
  buttonsEffectsList.addEventListener('change', addPictureFilter);
  hashTagInput.addEventListener('input', validationHashTag);
});

var closeUploadFile = function () {
  uploadImage.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscPress);
  imgPreview.style.filter = '';
  imgUploadPreview.style.transform = '';
  controlValue = MAX_CONTROL;
  form.reset();
  hashTagInput.style.outline = '';
  if (filterChecked) {
    imgPreview.classList.remove('effects__preview--' + filterChecked.value);
  }
  buttonsEffectsList.removeEventListener('change', addPictureFilter);
  hashTagInput.removeEventListener('input', validationHashTag);
  pinEffectLevel.style.left = MAX_CONTROL + '%';
  effectDepth.style.width = pinEffectLevel.style.left;
  // scale.removeEventListener('click', changeScale);
};

cancelUploadFile.addEventListener('click', function () {
  closeUploadFile();
});

// НАЛОЖЕНИЕ ЭФФЕКТОВ НА ИЗОБРАЖЕНИЕ

var imgPreview = document.querySelector('.img-upload__preview img');
var imgUploadPreview = document.querySelector('.img-upload__preview');
var buttonsEffectsList = document.querySelector('.effects__list');

var pinEffectLevel = document.querySelector('.effect-level__pin');
var effectLine = document.querySelector('.effect-level__line');
var filterChecked = document.querySelector('.effects__list input:checked');
var effectLevel = document.querySelector('.effect-level');
var effectDepth = document.querySelector('.effect-level__depth');

pinEffectLevel.style.left = MAX_CONTROL + '%';
effectDepth.style.width = pinEffectLevel.style.left;

var effect = {
  none: {
    filter: 'none',
  },
  chrome: {
    filter: 'grayscale',
    MIN_VALUE: 0,
    MAX_VALUE: 1,
    unit: ''
  },
  sepia: {
    filter: 'sepia',
    MIN_VALUE: 0,
    MAX_VALUE: 1,
    unit: ''
  },
  marvin: {
    filter: 'invert',
    MIN_VALUE: 0,
    MAX_VALUE: 100,
    unit: '%'
  },
  phobos: {
    filter: 'blur',
    MIN_VALUE: 0,
    MAX_VALUE: 3,
    unit: 'px'
  },
  heat: {
    filter: 'brightness',
    MIN_VALUE: 1,
    MAX_VALUE: 3,
    unit: ''
  }
};

var setFilterValue = function (value) {
  imgPreview.style.filter = effect[filterChecked.value].filter + '(' + value + effect[filterChecked.value].unit + ')';
};

var addPictureFilter = function (evt) {
  if (filterChecked) {
    imgPreview.classList.remove('effects__preview--' + filterChecked.value);
  }
  imgPreview.classList.add('effects__preview--' + evt.target.value);
  filterChecked = evt.target;
  setFilterValue(effect[filterChecked.value].MAX_VALUE);
  if (effect[filterChecked.value].filter === 'none') {
    imgPreview.style.filter = '';
    effectLevel.classList.add('hidden');
  } else {
    effectLevel.classList.remove('hidden');
  }
};

//  Перемещаем пин по слайдеру

pinEffectLevel.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
    };

    startCoords = {
      x: moveEvt.clientX,
    };

    pinEffectLevel.style.left = (pinEffectLevel.offsetLeft - shift.x) + 'px';

    if (pinEffectLevel.offsetLeft < 0) {
      pinEffectLevel.style.left = 0;
    } else if (pinEffectLevel.offsetLeft > effectLine.offsetWidth) {
      pinEffectLevel.style.left = effectLine.offsetWidth + 'px';
    }

    // находим текущее положение пина в процентах
    var relationLevelDepth = Math.round(pinEffectLevel.offsetLeft * 100 / effectLine.clientWidth);

    // находим текущее положение пина относительно полосы в значениях фильтра
    var percentDepth = effect[filterChecked.value].MIN_VALUE + (effect[filterChecked.value].MAX_VALUE - effect[filterChecked.value].MIN_VALUE) * relationLevelDepth / 100;
    setFilterValue(percentDepth);
    effectDepth.style.width = pinEffectLevel.offsetLeft * 100 / effectLine.offsetWidth + '%';
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});


// Изменение масштаба изображения
var controlSmaller = document.querySelector('.scale__control--smaller');
var controlBigger = document.querySelector('.scale__control--bigger');
var controlValuePercent = document.querySelector('.scale__control--value');
var controlValue = parseInt(controlValuePercent.value, 10);
var scale = document.querySelector('.scale');


var changeScale = function (evt) {
  if (controlValue > CONTROL_STEP && evt.target === controlSmaller) {
    controlValue -= CONTROL_STEP;
  } else if (controlValue < MAX_CONTROL && evt.target === controlBigger) {
    controlValue += CONTROL_STEP;
  }
  controlValuePercent.value = controlValue + '%';
  imgUploadPreview.style.transform = 'scale(' + controlValue / 100 + ')';
};

scale.addEventListener('click', changeScale);

// Валидация хэш-тегов

var hashTagInput = document.querySelector('.text__hashtags');
var commentField = document.querySelector('.text__description');

var validationHashTag = function (evt) {
  var tagsArray = evt.target.value.toLowerCase().split(' ');
  var validityMessage = '';
  var tagList = {};
  if (tagsArray.length > MAX_COUNT_TAG) {
    validityMessage = 'Нельзя указать больше пяти хэш-тегов';
  }
  for (var i = 0; i < tagsArray.length; i++) {
    var tag = tagsArray[i];
    if (tag[0] !== '#') {
      validityMessage = 'Хэш-тег начинается с символа # (решётка)';
    } else if (tag.length === 1) {
      validityMessage = 'хеш-тег не может состоять только из одной решётки';
    } else if (tag.length > MAX_LENGTH_TAG) {
      validityMessage = 'Максимальная длина одного хэш-тега 20 символов, включая решётку';
    } else if (tag.indexOf('#', 1) > 0) {
      validityMessage = 'Хэш-теги разделяются пробелами';
    } else if (tagList[tag]) {
      validityMessage = 'Один и тот же хэш-тег не может быть использован дважды';
    }
    tagList[tag] = true;
    if (validityMessage) {
      break;
    }
  }
  hashTagInput.style.outline = validityMessage ? '3px solid red' : '';
  hashTagInput.setCustomValidity(validityMessage);
  if (!evt.target.value) {
    hashTagInput.setCustomValidity('');
  }
};

hashTagInput.addEventListener('focus', function () {
  document.removeEventListener('keydown', onEscPress);
});

hashTagInput.addEventListener('blur', function () {
  document.addEventListener('keydown', onEscPress);
});

commentField.addEventListener('focus', function () {
  document.removeEventListener('keydown', onEscPress);
});

commentField.addEventListener('blur', function () {
  document.addEventListener('keydown', onEscPress);
});

// Отправка формы
var form = document.querySelector('.img-upload__form');
// var buttonSubmit = document.querySelector('.img-upload__submit');


