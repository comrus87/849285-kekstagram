'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var uploadImage = function (onSuccess, onError) {
    var file = window.form.uploadFile.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        onSuccess(reader.result);
      });
      reader.readAsDataURL(file);
    } else {
      onError('Неверный формат изображения');
      window.form.closeUploadFile();
    }
  };
  window.uploadImage = uploadImage;
})();

