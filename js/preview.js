'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var socialItemComments = document.querySelector('.social__comment');
  var cancelBigPicture = document.querySelector('.big-picture__cancel');
  // var thumbnails = document.querySelectorAll('.picture');
  var body = document.querySelector('body');

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
    cancelBigPicture.addEventListener('click', function () {
      closeBigPicture();
    });
  };

  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.comments-loader').classList.add('visually-hidden');

  var onEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeBigPicture();
      window.form.closeUploadFile();
      // window.form.closeSuccessModal();
      // window.form.closeErrorModal();
    }
  };

  var addThumbnailListener = function (thumbnail, photo) {
    thumbnail.addEventListener('click', function () {
      bigPicture.classList.remove('hidden');
      renderBigPicture(photo);
      body.classList.add('modal-open');
      document.addEventListener('keydown', onEscPress);
    });
  };

  var renderAllBigPicture = function (thumbnails, photos) {
    for (var i = 0; i < thumbnails.length; i++) {
      addThumbnailListener(thumbnails[i], photos[i]);
    }
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEscPress);
  };


  window.preview = {
    body: body,
    onEscPress: onEscPress,
    renderAllBigPicture: renderAllBigPicture
  };
})();
