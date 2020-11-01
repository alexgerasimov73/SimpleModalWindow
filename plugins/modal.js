Element.prototype.appendAfter = function (el) {
  el.parentNode.insertBefore(this, el.nextSibling);
};

function noop() {}

function _createModalFooter(buttons = []) {
  if (buttons.length === 0) {
    return document.createElement('div');
  }

  const wrapper = document.createElement('div');
  wrapper.classList.add('modal-footer');

  buttons.forEach((btn) => {
    const $btn = document.createElement('button');
    $btn.textContent = btn.text;
    $btn.classList.add('btn');
    $btn.classList.add(`btn-${btn.type || 'secondary'}`);
    $btn.onclick = btn.handler || noop;

    wrapper.appendChild($btn);
  });

  return wrapper;
}

function _createModal(options) {
  const DEFAULT_WIDTH = 600;
  const modal = document.createElement('div');
  modal.classList.add('modal-block');

  modal.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="modal-overlay" data-close="true">
      <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}px">
        <div class="modal-header">
          <h2 class="modal-title">${options.title || ''}</h2>
          ${options.closable ? '<span class="modal-close" data-close="true">&times;</span>' : ''}
        </div>

        <div class="modal-body" data-content>
          ${options.content || ''}
        </div>
      </div>
    </div>
  `,
  );

  const footer = _createModalFooter(options.footerButtons);
  footer.appendAfter(modal.querySelector('[data-content]'));
  document.body.appendChild(modal);
  return modal;
}

$.modal = function (options) {
  const ANIMATION_SPEED = 350;
  const $modal = _createModal(options);
  let isClosing = false;
  let isDestroyed = false;

  const listener = (e) => e.target.dataset.close && modal.close();

  $modal.addEventListener('click', listener);

  const modal = {
    open() {
      !isDestroyed && !isClosing && $modal.classList.add('open');
    },
    close() {
      isClosing = true;
      $modal.classList.remove('open');
      $modal.classList.add('hide');
      setTimeout(() => {
        $modal.classList.remove('hide');
        isClosing = false;
        if (typeof options.onClose === 'function') {
          options.onClose();
        }
      }, ANIMATION_SPEED);
    },
  };

  return Object.assign(modal, {
    destroy() {
      $modal.parentNode.removeChild($modal);
      isDestroyed = true;
      $modal.removeEventListener('click', listener);
    },
    setContent(html) {
      $modal.querySelector('[data-content]').innerHTML = html;
    },
  });
};
