export default class Drag {
  static dragStartEnd() {
    document.querySelectorAll('li.list').forEach((item) => {
      item.addEventListener('dragstart', () => {
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
      });
    });
  }

  static getDragElem(container, vertical) {
    const dragElems = [...container.querySelectorAll('li.list:not(.dragging)')];
    return dragElems.reduce((closest, elemChild) => {
      const box = elemChild.getBoundingClientRect();
      const offset = vertical - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return {
          offset,
          element: elemChild,
        };
      }

      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  static dragFunc() {
    Drag.dragStartEnd();
    const container = document.querySelector('.todo-list ul');
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElem = Drag.getDragElem(container, e.clientY);
      const draggable = document.querySelector('.dragging');
      if (afterElem === undefined || draggable === null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElem);
      }
    });
  }
}