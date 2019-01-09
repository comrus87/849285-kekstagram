'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var effectPreviews = document.querySelectorAll('.effects__preview');

  window.form.uploadFile.addEventListener('change', function () {
    var file = window.form.uploadFile.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        window.form.imgPreview.src = reader.result;
        addFilterImages();
      });
      var addFilterImages = function () {
        effectPreviews.forEach(function (element) {
          element.style.backgroundImage = 'url(' + reader.result + ')';
        });
      };
      reader.readAsDataURL(file);
    } else {
      window.gallery.onErrorLoad('Неверный формат изображения');
      window.form.closeUploadFile();
    }
  });

})();
