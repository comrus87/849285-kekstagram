'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var socialItemComments = document.querySelector('.social__comment');
  var cancelBigPicture = document.querySelector('.big-picture__cancel');
  var body = document.querySelector('body');
  var STEP_COMMENTS = 5;
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var socialCommentCount = bigPicture.querySelector('.social__comment-count');
  // var commentsCount = document.querySelector('.comments-count');

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
      if (comments.length >= STEP_COMMENTS) {
        commentsLoader.classList.remove('visually-hidden');
      } else if (comments.length <= STEP_COMMENTS) {
        commentsLoader.classList.add('visually-hidden');
      }
    }
    socialComments.appendChild(fragment);
    showCommentsCount(comments.lenght);
  };


  var showCommentsCount = function (count) {
    var visualComments = bigPicture.querySelectorAll('.social__comment:not(.visually-hidden)').length;
    var commentCount = visualComments + ' из ' + '<span class="comments-count">' + count + '</span>' + ' комментариев';
    socialCommentCount.innerHTML = commentCount;
  };


  var getCommentsListener = function (pictures) {
    return function () {
      STEP_COMMENTS += 5;
      renderAllComments(pictures.comments.slice(0, STEP_COMMENTS));
    };
  };

  var renderBigPicture = function (picture) {
    bigPicture.querySelector('.big-picture__img img').src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
    bigPicture.querySelector('.social__caption').textContent = picture.description;
    renderAllComments(picture.comments.slice(0, STEP_COMMENTS));
    commentsLoader.addEventListener('click', getCommentsListener(picture));
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
    for (var i = 0; i < thumbnails.length; i++) {
      addThumbnailListener(thumbnails[i], photos[i]);
    }
  };

  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEscPress);
    commentsLoader.removeEventListener('click', getCommentsListener);
  };

  window.preview = {
    body: body,
    onEscPress: onEscPress,
    ESC_KEYCODE: ESC_KEYCODE,
    renderAllBigPicture: renderAllBigPicture
  };
})();
