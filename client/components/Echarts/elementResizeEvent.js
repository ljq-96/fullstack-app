import { isIE } from 'utils';

function resizeListener(e) {
  var win = e.target || e.srcElement;
  if (win.__resizeRAF__) {
    cancelAnimationFrame(win.__resizeRAF__);
  }
  win.__resizeRAF__ = requestAnimationFrame(function () {
    var trigger = win.__resizeTrigger__;
    var listeners = trigger && trigger.__resizeListeners__;
    if (listeners) {
      listeners.forEach(function (fn) {
        fn.call(trigger, e);
      });
    }
  });
}

export default function elementResizeEvent(element, fn) {
  var document = window.document;

  var attachEvent = document['attachEvent'];

  function objectLoad() {
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
  }

  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    if (attachEvent) {
      element.__resizeTrigger__ = element;
      element.attachEvent('onresize', resizeListener);
    } else {
      if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
      }
      var obj = (element.__resizeTrigger__ = document.createElement('object'));
      obj.setAttribute(
        'style',
        'position: absolute; top: 0; left: 0; height: 100%; width: 100%; pointer-events: none; z-index: -1; opacity: 0;',
      );
      obj.setAttribute('class', 'resize-sensor');

      // prevent <object> from stealing keyboard focus
      obj.setAttribute('tabindex', '-1');

      obj['__resizeElement__'] = element;
      obj.onload = objectLoad;
      obj.type = 'text/html';
      if (isIE) {
        element.appendChild(obj);
      }
      obj.data = 'about:blank';
      if (!isIE) {
        element.appendChild(obj);
      }
    }
  }
  element.__resizeListeners__.push(fn);
}

export function unbind(element, fn) {
  var addEventListener = document.addEventListener;
  var listeners = element.__resizeListeners__ || [];
  if (fn) {
    var index = listeners.indexOf(fn);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  } else {
    listeners = element.__resizeListeners__ = [];
  }
  if (!listeners.length) {
    if (addEventListener) {
      element.addEventListener('onresize', resizeListener);
    } else if (element.__resizeTrigger__) {
      var contentDocument = element.__resizeTrigger__.contentDocument;
      var defaultView = contentDocument && contentDocument.defaultView;
      if (defaultView) {
        defaultView.removeEventListener('resize', resizeListener);
        delete defaultView.__resizeTrigger__;
      }
      element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
    }
    delete element.__resizeListeners__;
  }
}
