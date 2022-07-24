import Helper from './helpers.js';
import Component from './component.js';
import Drag from './drag.js';

export default class Utils {
  static render(val, id) {
    document.querySelector('.todo-list ul').insertAdjacentHTML('beforeend', Component.list(val, id));
  }

  static add() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const todo = document.querySelector('#todo').value;
    if (todo === '') {
      document.querySelector('.error').innerText = 'Todo can not be empty';
      return;
    }
    document.querySelector('.error').innerHTML = '';
    Utils.pushControl(tasks, todo);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    Utils.render(todo, tasks.length);
    Utils.animate(tasks);
    Utils.edit();
  }

  static remove(e, id) {
    Utils.delete(id);
    e.currentTarget.closest('ul > li').remove();
    document.querySelector('.todo-list ul').innerHTML = '';
    Helper.display();
  }

  static clearAll() {
    Utils.delete(false);
    document.querySelectorAll('li.list input[type="checkbox"]').forEach((item) => {
      if (item.classList.contains('d-none')) {
        item.remove();
      }
    });
    document.querySelector('.todo-list ul').innerHTML = '';
    Helper.display();
    Drag.dragFunc();
  }

  static clear() {
    document.querySelector('#todo').value = '';
  }

  static pushControl(tasks, todo, completed = false) {
    tasks.push({
      description: `${todo}`,
      completed,
      index: tasks.length + 1,
    });
  }

  static change(id, val) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const filtered = tasks.filter((item) => item.index !== parseInt(id, 10));
    const task = tasks.find((item) => item.index === parseInt(id, 10));
    if (typeof val === 'boolean') {
      task.completed = val;
    } else {
      task.description = val;
    }
    filtered.splice(task.index - 1, 0, task);
    localStorage.setItem('tasks', JSON.stringify(filtered));
  }

  static tog(...args) {
    if (args[0] === 'add') return args[2].classList.add(args[1]);
    return args[2].classList.remove(args[1]);
  }

  static help(type, val1, val2, val3) {
    if (type === 'add') {
      Utils.tog('add', 'd-none', val1);
      Utils.tog('rem', 'd-none', val2);
      Utils.tog('add', 'strike', val3);
      Utils.change(val1.dataset.id, true);
    }
    if (type === 'rem') {
      Utils.tog('rem', 'd-none', val1);
      Utils.tog('add', 'd-none', val2);
      Utils.tog('rem', 'strike', val3);
      Utils.change(val1.dataset.id, false);
    }
  }

  static load(tasks) {
    document.querySelectorAll('li.list').forEach((elem) => {
      const task = tasks.find((item) => item.index === parseInt(elem.children[0].dataset.id, 10));
      if (task.completed) {
        const child = elem.children;
        Utils.help('add', child[0], child[1], child[2].firstElementChild);
        child[1].addEventListener('click', () => Utils.help('rem', child[0], child[1], child[2].firstElementChild));
      }
    });
  }

  static edit() {
    document.querySelectorAll('.list form input').forEach((input) => {
      const inputValue = input.value;
      input.addEventListener('change', (e) => {
        e.preventDefault();
        if (e.target.value === '') {
          e.target.value = inputValue;
          return;
        }
        Utils.change(e.target.dataset.id, e.target.value);
        document.querySelector('.todo-list ul').innerHTML = '';
        Helper.display();
      });
    });
    document.querySelectorAll('.list form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    });
  }

  static delete(val) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    let remTasks;
    if (typeof val === 'string') {
      remTasks = tasks.filter((item) => item.index !== parseInt(val, 10));
    } else {
      remTasks = tasks.filter((item) => item.completed === val);
    }
    localStorage.removeItem('tasks');
    const todos = JSON.parse(localStorage.getItem('tasks')) || [];
    remTasks.forEach((item) => {
      const { description, completed } = item;
      if (completed) {
        Utils.pushControl(todos, description, true);
      } else {
        Utils.pushControl(todos, description);
      }
    });
    localStorage.setItem('tasks', JSON.stringify(todos));
  }

  static animate(tasks) {
    document.querySelectorAll('li.list').forEach((item) => {
      if (parseInt(item.dataset.id, 10) === tasks.length) item.classList.add('animate-top');
      setTimeout(() => { item.classList.remove('animate-top'); }, 1400);
    });
  }
}