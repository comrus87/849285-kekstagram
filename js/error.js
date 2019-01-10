'use strict';
(function () {
  var createErrorNode = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-message');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
    return node;
  };
  var onErrorLoad = function (errorMessage) {
    var node = createErrorNode(errorMessage);
    var onErrorRemove = function () {
      window.preview.body.removeChild(node);
      document.removeEventListener('click', onErrorRemove);
      document.removeEventListener('keydown', onErrorEsc);
    };
    var onErrorEsc = function (evt) {
      if (evt.keyCode === window.preview.ESC_KEYCODE) {
        onErrorRemove();
      }
    };
    document.addEventListener('click', onErrorRemove);
    document.addEventListener('keydown', onErrorEsc);
  };
  window.onErrorLoad = onErrorLoad;
})();
