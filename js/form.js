'use strict';
(function () {
  var Effect = {
    chrome: {
      FILTER: 'grayscale',
      MIN_VALUE: 0,
      MAX_VALUE: 1,
      UNIT: ''
    },
    sepia: {
      FILTER: 'sepia',
      MIN_VALUE: 0,
      MAX_VALUE: 1,
      UNIT: ''
    },
    marvin: {
      FILTER: 'invert',
      MIN_VALUE: 0,
      MAX_VALUE: 100,
      UNIT: '%'
    },
    phobos: {
      FILTER: 'blur',
      MIN_VALUE: 0,
      MAX_VALUE: 3,
      UNIT: 'px'
    },
    heat: {
      FILTER: 'brightness',
      MIN_VALUE: 1,
      MAX_VALUE: 3,
      UNIT: ''
    }
  };
  var CONTROL_STEP = 25;
  var MAX_CONTROL = 100;
  var DEFAULT = 'none';
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var main = document.querySelector('main');
  var imgPreview = document.querySelector('.img-upload__preview img');
  var imgUploadPreview = document.querySelector('.img-upload__preview');
  var pinEffectLevel = document.querySelector('.effect-level__pin');
  var effectLine = document.querySelector('.effect-level__line');
  var filterChecked = document.querySelector('.effects__list input:checked');
  var effectLevel = document.querySelector('.effect-level');
  var effectDepth = document.querySelector('.effect-level__depth');
  var effectLevelvalue = document.querySelector('.effect-level__value');
  var effectPreviews = document.querySelectorAll('.effects__preview');
  var controlSmaller = document.querySelector('.scale__control--smaller');
  var controlBigger = document.querySelector('.scale__control--bigger');
  var controlValuePercent = document.querySelector('.scale__control--value');
  var controlValue = parseInt(controlValuePercent.value, 10);
  var cancelUploadFile = document.querySelector('.img-upload__cancel');
  var form = document.querySelector('.img-upload__form');
  var uploadFile = document.querySelector('#upload-file');
  var uploadImage = document.querySelector('.img-upload__overlay');
  var scale = document.querySelector('.scale');
  var buttonsEffectsList = document.querySelector('.effects__list');

  var addDefaultValue = function (value) {
    pinEffectLevel.style.left = value + '%';
    effectDepth.style.width = pinEffectLevel.style.left;
  };

  var setFilterValue = function (value) {
    imgPreview.style.filter = Effect[filterChecked.value].FILTER + '(' + value + Effect[filterChecked.value].UNIT + ')';
  };

  var onFilterChange = function (evt) {
    imgPreview.classList.remove('effects__preview--' + filterChecked.value);
    addDefaultValue(MAX_CONTROL);
    imgPreview.classList.add('effects__preview--' + evt.target.value);
    filterChecked = evt.target;
    if (filterChecked.value === DEFAULT) {
      imgPreview.style.filter = '';
      effectLevel.classList.add('hidden');
    } else {
      setFilterValue(Effect[filterChecked.value].MAX_VALUE);
      effectLevel.classList.remove('hidden');
    }
  };

  var onSliderMouseDown = function (evt) {
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
      var valueFilterChecked = Effect[filterChecked.value];
      var percentDepth = valueFilterChecked.MIN_VALUE + (valueFilterChecked.MAX_VALUE - valueFilterChecked.MIN_VALUE) * relationLevelDepth / 100;
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
  };

  var onScaleClick = function (evt) {
    if (controlValue > CONTROL_STEP && evt.target === controlSmaller) {
      controlValue -= CONTROL_STEP;
    } else if (controlValue < MAX_CONTROL && evt.target === controlBigger) {
      controlValue += CONTROL_STEP;
    }
    controlValuePercent.value = controlValue + '%';
    imgUploadPreview.style.transform = 'scale(' + controlValue / 100 + ')';
  };

  uploadFile.addEventListener('change', function () {
    uploadImage.classList.remove('hidden');
    window.preview.body.classList.add('modal-open');
    document.addEventListener('keydown', onUnploadEscPress);
    effectLevel.classList.add('hidden');
    buttonsEffectsList.addEventListener('change', onFilterChange);
    window.validity.hashTagInput.addEventListener('input', window.validity.validateHashTag);
    scale.addEventListener('click', onScaleClick);
    pinEffectLevel.addEventListener('mousedown', onSliderMouseDown);
    window.uploadImage(onSuccessUpload, window.onErrorLoad);
  });

  var closeUploadFile = function () {
    uploadImage.classList.add('hidden');
    window.preview.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onUnploadEscPress);
    imgPreview.style.filter = '';
    imgUploadPreview.style.transform = '';
    controlValue = MAX_CONTROL;
    form.reset();
    window.validity.hashTagInput.style.outline = '';
    imgPreview.classList.remove('effects__preview--' + filterChecked.value);
    buttonsEffectsList.removeEventListener('change', onFilterChange);
    window.validity.hashTagInput.removeEventListener('input', window.validity.validateHashTag);
    addDefaultValue(MAX_CONTROL);
    scale.removeEventListener('click', onScaleClick);
    window.validity.hashTagInput.setCustomValidity('');
    pinEffectLevel.removeEventListener('mousedown', onSliderMouseDown);
  };

  var onUnploadEscPress = function (evt) {
    if (evt.keyCode === window.preview.ESC_KEYCODE) {
      closeUploadFile();
    }
  };

  cancelUploadFile.addEventListener('click', function () {
    closeUploadFile();
  });

  var onSuccessUpload = function (result) {
    imgPreview.src = result;
    effectPreviews.forEach(function (element) {
      element.style.backgroundImage = 'url(' + result + ')';
    });
  };

  var onLoadSuccess = function () {
    var success = successTemplate.cloneNode(true);
    main.appendChild(success);
    var successButton = success.querySelector('.success__button');
    successButton.addEventListener('click', onSuccessCLose);
    document.addEventListener('keydown', onEscCloseSuccess);
    document.addEventListener('click', onSuccessCLose);
  };

  var closeModal = function (modal) {
    main.removeChild(document.querySelector(modal));
  };

  var onSuccessCLose = function () {
    closeModal('.success');
    document.removeEventListener('keydown', onEscCloseSuccess);
    document.removeEventListener('click', onSuccessCLose);
  };

  var onEscCloseSuccess = function (evt) {
    if (evt.keyCode === window.preview.ESC_KEYCODE) {
      onSuccessCLose();
    }
  };

  var onLoadError = function () {
    var error = errorTemplate.cloneNode(true);
    main.appendChild(error);
    var errorButton = error.querySelector('.error__button');
    errorButton.addEventListener('click', onErrorClose);
    document.addEventListener('keydown', onEscCloseError);
    document.addEventListener('click', onErrorClose);
  };

  var onErrorClose = function () {
    closeModal('.error');
    document.removeEventListener('keydown', onEscCloseError);
    document.removeEventListener('click', onErrorClose);
  };

  var onEscCloseError = function (evt) {
    if (evt.keyCode === window.preview.ESC_KEYCODE) {
      onErrorClose();
    }
  };

  var onSubmitUpload = function (evt) {
    window.backend.postData(new FormData(form), onLoadSuccess, onLoadError);
    evt.preventDefault();
    closeUploadFile();
  };

  form.addEventListener('submit', onSubmitUpload);

  window.form = {
    closeUploadFile: closeUploadFile,
    uploadFile: uploadFile
  };
})();
