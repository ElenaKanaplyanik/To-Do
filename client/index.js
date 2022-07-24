import './style.css';
import Helper from './helpers.js';
import Utils from './utils.js';
import Drag from './drag.js';


window.addEventListener('DOMContentLoaded', () => {
  Helper.display();
  Drag.dragFunc();
  document.querySelector('form').addEventListener('submit', (e) => Helper.formHandler(e));
  document.querySelector('.enter').addEventListener('click', (e) => Helper.formHandler(e));
  document.querySelector('.clear a').addEventListener('click', () => Utils.clearAll());
});

