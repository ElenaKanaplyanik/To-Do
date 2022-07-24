import Utils from './utils.js';
import Drag from './drag.js';

export default class Helper {
  static formHandler(e) {
    e.preventDefault();
    Utils.add();
    Utils.clear();
    Helper.checkHandler();
    Helper.handleFocus();
    Drag.dragFunc();
  }

  static display() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((item) => {
      const { description, index } = item;
      Utils.render(description, index);
      document.querySelector('#todo').focus();
      Helper.checkHandler();
      Helper.handleFocus();
    });
    Utils.load(tasks);
    Utils.edit();
  }

  static focusHandler(e) {
    const item = e.currentTarget;
    const child = item.children;
    const input = child[2].firstElementChild;
    if (document.querySelector('li.list.focus')) {
      const parent = document.querySelector('li.list.focus');
      parent.children[2].firstElementChild.classList.remove('focus');
      parent.children[3].classList.remove('d-none');
      parent.children[4].classList.add('d-none');
      parent.classList.remove('focus');
    }
    input.focus();
    Utils.tog('add', 'focus', input);
    Utils.tog('add', 'd-none', child[3]);
    Utils.tog('rem', 'd-none', child[4]);
    item.classList.add('focus');
    item.querySelector('#delete .far').addEventListener('click', (e) => {
      e.preventDefault();
      Utils.remove(e, e.currentTarget.dataset.id);
    });
    Drag.dragFunc();
  }

  static changeHandler(e) {
    const item = e.target;
    const parent = item.parentElement;
    const child = parent.children;
    document.querySelector('.error').innerHTML = '';
    Utils.help('add', item, child[1], child[2].firstElementChild);
    child[1].addEventListener('click', () => {
      Utils.help('rem', item, child[1], child[2].firstElementChild);
      item.checked = false;
    });
    Drag.dragFunc();
  }

  static handleFocus() {
    document.querySelectorAll('li.list').forEach((item) => item.addEventListener('click', Helper.focusHandler));
  }

  static checkHandler() {
    document.querySelectorAll('input[type="checkbox"]').forEach((item) => item.addEventListener('change', Helper.changeHandler));
  }
}