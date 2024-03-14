'use strict'
const html = document.documentElement.innerHTML;
html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

const forms = document.querySelectorAll('form');

const todoListHigh = document.querySelector('#todo__list--high');
const todoListLow = document.querySelector('#todo__list--low');
const todoLists = document.querySelectorAll('.todo__list');

const todoItems = document.querySelectorAll('.todo__item'); // li

const inputHigh = document.querySelector('[data-input-high]');
const inputlow = document.querySelector('[data-input-low]');

const data = {
    high: [],
    low: [],
}

const PRIORITY = {
    HIGH: "high",
    LOW: "low",
}

const STATUS = {
    IN_PROGRESS: "В работе",
    DONE: "Выполнено",
}

function addNewTask(list, data, priority, status = STATUS.IN_PROGRESS) {
    data[priority].push({
        text: inputHigh.value || inputlow.value,
        id: Math.floor(Math.random() * (10000000000 - 1) + 1), //Генерит случайное число от 1 до 10000000000
        status,
    },);
    renderHistory(list, data, priority);

    forms.forEach(form => {
        form.reset();
    });
    console.log(data);
}

function deleteTask(list, data, priority) {
    const target = event.target;

    if (target.classList.contains('todo__item-btn')) {
        const elemId = Number(target.closest('li').getAttribute('id'));
        const findElemId = data[priority].findIndex(elem => elem.id === elemId);
        const numberOfItems = 1;
        data[priority].splice(findElemId, numberOfItems);

        renderHistory(list, data, priority);
        console.log(data);
    }
}

function changeStatusAndRender(list, data, priority) {
    const target = event.target.closest('li');
    const targetForChecked = event.target.previousElementSibling; //костыль? другого способа я что-то не нашёл, чтобы найти чекбокс

    if (target.hasAttribute('data-status') && targetForChecked) {
        target.classList.toggle('active');
        const elemId = Number(target.getAttribute('id'));
        const findElemId = data[priority].findIndex(elem => elem.id === elemId);
        const checkStatus = data[priority][findElemId].status === STATUS.DONE;

        if (checkStatus) {
            data[priority][findElemId].status = STATUS.IN_PROGRESS;
            targetForChecked.checked = true;
        } else {
            data[priority][findElemId].status = STATUS.DONE;
            targetForChecked.checked = false;
        }
        renderHistory(list, data, priority);
    }
}

function renderHistory(list, data, priority) {
    list.innerHTML = '';

    data[priority].forEach(task => {
        let newElemList = document.createElement('li');
        newElemList.classList.add('todo__list-item', 'todo__item');
        list.appendChild(newElemList);
        newElemList.id = task.id;
        newElemList.style.opacity = 0;
        newElemList.setAttribute('data-status', task.status);

        setTimeout(() => {
            newElemList.style.opacity = 1
        }, 100); //плавное появление таски

        newElemList.innerHTML = `
            <label data-status="${task.status}" class="custom-checkbox">
                <input type="checkbox" id="toggle" class="custom-checkbox__field">
                <span class="custom-checkbox__content">${task.text} <p class="task-status">[${task.status}]</p></span>
            </label>
            <button class="todo__item-btn btn">✕</button>
        `;

        const checkbox = document.querySelectorAll('#toggle');
        checkbox.forEach(elem => {
            const label = elem.closest('label');
            const checkLabelForStatusDone = label.getAttribute(`data-status`) === STATUS.DONE
            if (checkLabelForStatusDone) {
                elem.checked = true; //подсвечивает чекбоксы
            } else {
                elem.checked = false; 
            }
        });

    })
}

todoLists.forEach(list => {
    list.addEventListener('click', (event) => {
        const checkListPriority = list.hasAttribute('data-list-high');

        if (checkListPriority) {
            changeStatusAndRender(todoListHigh, data, PRIORITY.HIGH);
            deleteTask(todoListHigh, data, PRIORITY.HIGH);

        } else {
            changeStatusAndRender(todoListLow, data, PRIORITY.LOW);
            deleteTask(todoListLow, data, PRIORITY.LOW);
        }

    });
});

forms.forEach(form => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const checkFormPriority = form.hasAttribute('data-form-high');

        if (checkFormPriority) {
            addNewTask(todoListHigh, data, PRIORITY.HIGH);
        } else {
            addNewTask(todoListLow, data, PRIORITY.LOW);
        }
    });
});





