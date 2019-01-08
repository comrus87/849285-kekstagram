'use strict';

(function () {
  var STEP_COMMENTS = 5;
  var ESC_KEYCODE = 27;
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var socialItemComments = document.querySelector('.social__comment');
  var cancelBigPicture = document.querySelector('.big-picture__cancel');
  var body = document.querySelector('body');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var socialCommentCount = bigPicture.querySelector('.social__comment-count');
  var count = STEP_COMMENTS;
  var commentsListener;

  var renderComment = function (comment) {
    var commentElement = socialItemComments.cloneNode(true);
    commentElement.querySelector('.social__picture').src = comment.avatar;
    commentElement.querySelector('.social__text').textContent = comment.message;
    return commentElement;
  };

  var renderComments = function (comments, total) {
    socialComments.innerHTML = '';
    var fragment = document.createDocumentFragment();
    comments.forEach(function (comment) {
      fragment.appendChild(renderComment(comment));
      commentsLoader.classList.toggle('visually-hidden', comments.length < count);
    });
    socialComments.appendChild(fragment);
    showCommentsCount(comments.length, total);
  };

  var showCommentsCount = function (visualComments, countComment) {
    var commentCount = visualComments + ' из ' + '<span class="comments-count">' + countComment + '</span>' + ' комментариев';
    socialCommentCount.innerHTML = commentCount;
  };


  var getCommentsListener = function (pictures) {
    return function () {
      count += STEP_COMMENTS;
      renderComments(pictures.comments.slice(0, count), pictures.comments.length);
    };
  };

  var renderBigPicture = function (picture) {
    renderComments(picture.comments.slice(0, STEP_COMMENTS), picture.comments.length);
    bigPicture.querySelector('.big-picture__img img').src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
    bigPicture.querySelector('.social__caption').textContent = picture.description;
    commentsListener = getCommentsListener(picture);
    commentsLoader.addEventListener('click', commentsListener);
    cancelBigPicture.addEventListener('click', function () {
      closeBigPicture();
    });
  };

  var onEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeBigPicture();
      window.form.closeUploadFile();
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
    thumbnails.forEach(function (thumbnail, i) {
      addThumbnailListener(thumbnail, photos[i]);
    });
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEscPress);
    commentsLoader.removeEventListener('click', commentsListener);
    count = STEP_COMMENTS;
  };

  window.preview = {
    body: body,
    onEscPress: onEscPress,
    ESC_KEYCODE: ESC_KEYCODE,
    renderAllBigPicture: renderAllBigPicture
  };
})();
