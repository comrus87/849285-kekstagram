'use strict';

(function () {
  // Валидация хэш-тегов
  var MAX_LENGTH_TAG = 20;
  var MAX_COUNT_TAG = 5;
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
    document.removeEventListener('keydown', window.preview.onEscPress);
  });

  hashTagInput.addEventListener('blur', function () {
    document.addEventListener('keydown', window.preview.onEscPress);
  });

  commentField.addEventListener('focus', function () {
    document.removeEventListener('keydown', window.preview.onEscPress);
  });

  commentField.addEventListener('blur', function () {
    document.addEventListener('keydown', window.preview.onEscPress);
  });
  window.validity = {
    validationHashTag: validationHashTag,
    hashTagInput: hashTagInput
  };
})();
