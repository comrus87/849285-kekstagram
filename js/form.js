'use strict';
(function () {
  var CONTROL_STEP = 25;
  var MAX_CONTROL = 100;
  var DEFAULT = 'none';

  var imgPreview = document.querySelector('.img-upload__preview img');
  var imgUploadPreview = document.querySelector('.img-upload__preview');
  var pinEffectLevel = document.querySelector('.effect-level__pin');
  var effectLine = document.querySelector('.effect-level__line');
  var filterChecked = document.querySelector('.effects__list input:checked');
  var effectLevel = document.querySelector('.effect-level');
  var effectDepth = document.querySelector('.effect-level__depth');
  var effectLevelvalue = document.querySelector('.effect-level__value');

  var controlSmaller = document.querySelector('.scale__control--smaller');
  var controlBigger = document.querySelector('.scale__control--bigger');
  var controlValuePercent = document.querySelector('.scale__control--value');
  var controlValue = parseInt(controlValuePercent.value, 10);

  var addDefaultValue = function () {
    pinEffectLevel.style.left = MAX_CONTROL + '%';
    effectDepth.style.width = pinEffectLevel.style.left;
  };

  addDefaultValue();

  var Effect = {
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
    imgPreview.style.filter = Effect[filterChecked.value].filter + '(' + value + Effect[filterChecked.value].unit + ')';
  };

  var addPictureFilter = function (evt) {
    imgPreview.classList.remove('effects__preview--' + filterChecked.value);
    addDefaultValue();
    imgPreview.classList.add('effects__preview--' + evt.target.value);
    filterChecked = evt.target;
    if (Effect[filterChecked.value].filter === DEFAULT) {
      imgPreview.style.filter = '';
      effectLevel.classList.add('hidden');
    } else {
      setFilterValue(Effect[filterChecked.value].MAX_VALUE);
      effectLevel.classList.remove('hidden');
    }
  };

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

      var relationLevelDepth = Math.round(pinEffectLevel.offsetLeft * 100 / effectLine.clientWidth);

      var percentDepth = Effect[filterChecked.value].MIN_VALUE + (Effect[filterChecked.value].MAX_VALUE - Effect[filterChecked.value].MIN_VALUE) * relationLevelDepth / 100;
      setFilterValue(percentDepth);
      effectDepth.style.width = relationLevelDepth + '%';
      effectLevelvalue.value = relationLevelDepth;
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
  var changeScale = function (evt) {
    if (controlValue > CONTROL_STEP && evt.target === controlSmaller) {
      controlValue -= CONTROL_STEP;
    } else if (controlValue < MAX_CONTROL && evt.target === controlBigger) {
      controlValue += CONTROL_STEP;
    }
    controlValuePercent.value = controlValue + '%';
    imgUploadPreview.style.transform = 'scale(' + controlValue / 100 + ')';
  };
  window.form = {
    addPictureFilter: addPictureFilter,
    changeScale: changeScale,
    MAX_CONTROL: MAX_CONTROL,
    effectLevel: effectLevel,
    imgPreview: imgPreview,
    imgUploadPreview: imgUploadPreview,
    controlValue: controlValue,
    filterChecked: filterChecked,
    addDefaultValue: addDefaultValue
  };
})();

