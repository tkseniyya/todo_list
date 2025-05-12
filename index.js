let tasks = [];

// Сохраняем задачи в localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Загружаем задачи из localStorage
function loadTasksFromStorage() {
    const data = localStorage.getItem('tasks');
    tasks = data ? JSON.parse(data) : [];
}

// Отрисовка задач
function renderTasks() {
    const container = document.querySelector('.tasks');
    container.innerHTML = '';
    tasks.forEach((task, idx) => {
        const taskHTML = `<div class="task__item" data-index="${idx}">
                <p class="task__name">${task.text} (Сделать до: ${task.date} ${task.time})</p>
                <div class="button_group">
                    <button class="check">Check</button>
                    <button class="done">Done</button>
                    <button class="delete">Delete</button>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', taskHTML);

        const taskElement = container.lastElementChild;
        checkOverdue(task.date, task.time, taskElement);
        if (task.completed) {
            taskElement.classList.add("done__green");
        }
    });
}

// Добавление задачи
function addItem() {
    const input = document.querySelector(".text");
    const btn = document.querySelector(".accept");
    const date = document.querySelector(".datepicker");
    const time = document.querySelector(".timepicker");

    btn.addEventListener("click", function (e) {
        e.preventDefault();
        const text = input.value.trim();
        const taskDate = date.value;
        const taskTime = time.value;
        if (!text || !taskDate || !taskTime) return;

        const newTask = {
            text: text,
            date: taskDate,
            time: taskTime,
            completed: false,
        };
        tasks.unshift(newTask);
        saveTasks();
        renderTasks();

        input.value = "";
        date.value = "";
        time.value = "";
    });
}

// Удаление задачи
function removeItem(taskItem) {
    const idx = taskItem.dataset.index;
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks();
}

// Переключение статуса "выполнено"
function toggleDone(taskItem) {
    const idx = taskItem.dataset.index;
    tasks[idx].completed = !tasks[idx].completed;
    saveTasks();
    renderTasks();
}

// Проверка просроченности задачи
function checkOverdue(date, time, taskItem) {
    const today = new Date();
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    const deadline = new Date(year, month - 1, day, hours, minutes);
    if (today > deadline) {
        taskItem.classList.add("overdue");
    } else {
        taskItem.classList.remove("overdue");
    }
}

// Инициализация после загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
    loadTasksFromStorage();
    renderTasks();
    addItem();

    document.querySelector(".tasks").addEventListener("click", function (e) {
        const taskItem = e.target.closest(".task__item");
        if (!taskItem) return;

        if (e.target.classList.contains("delete")) {
            removeItem(taskItem);
        } else if (e.target.classList.contains("done")) {
            toggleDone(taskItem);
        } else if (e.target.classList.contains("check")) {
            const taskText = taskItem.querySelector('.task__name').textContent;
            const match = taskText.match(/Сделать до: (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/);
            if (match) {
                checkOverdue(match[1], match[2], taskItem);
            }
        }
    });
});
