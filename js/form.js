'use strict';
(function () {
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

  var addDefaultValue = function () {
    pinEffectLevel.style.left = MAX_CONTROL + '%';
    effectDepth.style.width = pinEffectLevel.style.left;
  };

  var Effect = {
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
    if (filterChecked.value === DEFAULT) {
      imgPreview.style.filter = '';
      effectLevel.classList.add('hidden');
    } else {
      setFilterValue(Effect[filterChecked.value].MAX_VALUE);
      effectLevel.classList.remove('hidden');
    }
  };

  var moveSlider = function (evt) {
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

  var changeScale = function (evt) {
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
    document.addEventListener('keydown', window.preview.onEscPress);
    effectLevel.classList.add('hidden');
    buttonsEffectsList.addEventListener('change', addPictureFilter);
    window.validity.hashTagInput.addEventListener('input', window.validity.validateHashTag);
    scale.addEventListener('click', changeScale);
    pinEffectLevel.addEventListener('mousedown', moveSlider);
    window.uploadImage(onSuccessUpload, window.onErrorLoad);
  });

  var closeUploadFile = function () {
    uploadImage.classList.add('hidden');
    window.preview.body.classList.remove('modal-open');
    document.removeEventListener('keydown', window.preview.onEscPress);
    imgPreview.style.filter = '';
    imgUploadPreview.style.transform = '';
    controlValue = MAX_CONTROL;
    form.reset();
    window.validity.hashTagInput.style.outline = '';
    imgPreview.classList.remove('effects__preview--' + filterChecked.value);
    buttonsEffectsList.removeEventListener('change', addPictureFilter);
    window.validity.hashTagInput.removeEventListener('input', window.validity.validateHashTag);
    addDefaultValue();
    scale.removeEventListener('click', changeScale);
    window.validity.hashTagInput.setCustomValidity('');
    pinEffectLevel.removeEventListener('mousedown', moveSlider);
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

  var addSuccessModal = function () {
    var success = successTemplate.cloneNode(true);
    main.appendChild(success);
    var successButton = success.querySelector('.success__button');
    successButton.addEventListener('click', closeSuccessModal);
    document.addEventListener('keydown', onEscCloseSuccess);
    document.addEventListener('click', closeSuccessModal);
  };

  var closeModal = function (modal) {
    main.removeChild(document.querySelector(modal));
  };

  var closeSuccessModal = function () {
    closeModal('.success');
    document.removeEventListener('keydown', onEscCloseSuccess);
    document.removeEventListener('click', closeSuccessModal);
  };

  var onEscCloseSuccess = function (evt) {
    if (evt.keyCode === window.preview.ESC_KEYCODE) {
      closeSuccessModal();
    }
  };

  var addErrorModal = function () {
    var error = errorTemplate.cloneNode(true);
    main.appendChild(error);
    var errorButton = error.querySelector('.error__button');
    errorButton.addEventListener('click', closeErrorModal);
    document.addEventListener('keydown', onEscCloseError);
    document.addEventListener('click', closeErrorModal);
  };

  var closeErrorModal = function () {
    closeModal('.error');
    document.removeEventListener('keydown', onEscCloseError);
    document.removeEventListener('click', closeErrorModal);
  };

  var onEscCloseError = function (evt) {
    if (evt.keyCode === window.preview.ESC_KEYCODE) {
      closeErrorModal();
    }
  };

  var uploadOnSubmit = function (evt) {
    window.backend.postData(new FormData(form), addSuccessModal, addErrorModal);
    evt.preventDefault();
    closeUploadFile();
  };

  form.addEventListener('submit', uploadOnSubmit);

  window.form = {
    closeUploadFile: closeUploadFile,
    uploadFile: uploadFile
  };
})();
