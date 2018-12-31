'use strict';

(function () {
  var uploadFile = document.querySelector('#upload-file');
  var uploadImage = document.querySelector('.img-upload__overlay');
  var cancelUploadFile = document.querySelector('.img-upload__cancel');
  var scale = document.querySelector('.scale');
  var buttonsEffectsList = document.querySelector('.effects__list');
  var form = document.querySelector('.img-upload__form');

  uploadFile.addEventListener('change', function () {
    uploadImage.classList.remove('hidden');
    window.preview.body.classList.add('modal-open');
    document.addEventListener('keydown', window.preview.onEscPress);
    window.form.effectLevel.classList.add('hidden');
    buttonsEffectsList.addEventListener('change', window.form.addPictureFilter);
    window.validity.hashTagInput.addEventListener('input', window.validity.validationHashTag);
    scale.addEventListener('click', window.form.changeScale);
  });

  var closeUploadFile = function () {
    uploadImage.classList.add('hidden');
    window.preview.body.classList.remove('modal-open');
    document.removeEventListener('keydown', window.preview.onEscPress);
    window.form.imgPreview.style.filter = '';
    window.form.imgUploadPreview.style.transform = '';
    window.form.controlValue = window.form.MAX_CONTROL;
    form.reset();
    window.validity.hashTagInput.style.outline = '';
    if (window.form.filterChecked) {
      window.form.imgPreview.classList.remove('effects__preview--' + window.form.filterChecked.value);
    }
    buttonsEffectsList.removeEventListener('change', window.form.addPictureFilter);
    window.validity.hashTagInput.removeEventListener('input', window.validity.validationHashTag);
    window.form.addDefaultValue();
    scale.removeEventListener('click', window.form.changeScale);
    window.validity.hashTagInput.setCustomValidity('');
  };

  cancelUploadFile.addEventListener('click', function () {
    closeUploadFile();
  });
  window.closeUploadFile = closeUploadFile;
})();
