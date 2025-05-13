let tasks = [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const data = localStorage.getItem('tasks');
    tasks = data ? JSON.parse(data) : [];
}

function renderTasks() {
    const container = document.querySelector('.tasks');
    container.innerHTML = '';
    tasks.forEach((task, idx) => {
        const taskHTML = `<div class="task__item" data-index="${idx}">
                <p class="task__name">${task.text} (Сделать до: ${task.date} ${task.time})</p>
                <div class="button_group">
                    <button class="btn done">Done</button>
                    <button class="btn delete">Delete</button>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', taskHTML);

        const taskElement = container.lastElementChild;
        if (task.completed) {
            taskElement.classList.add("done__green");
        } else {
            checkOverdue(task.date, task.time, taskElement);
        }
    });
}
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

function removeItem(taskItem) {
    const idx = taskItem.dataset.index;
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks();
}

function toggleDone(taskItem) {
    const idx = taskItem.dataset.index;
    tasks[idx].completed = !tasks[idx].completed;
    saveTasks();
    renderTasks();
}

function checkInterval() {
    function checkTasks() {
        const taskElements = document.querySelectorAll(".task__item");
        taskElements.forEach((taskEl) => {
            const idx = taskEl.dataset.index;
            const task = tasks[idx];
            if (task) {
                checkOverdue(task.date, task.time, taskEl);
            }
        });
    }
    checkTasks();
    const now = new Date();
    const secNextMinute = 60 - now.getSeconds();
    const delayNextMinute = secNextMinute * 1000;
    setTimeout(() => {
        checkTasks();
        setTimeout(checkTasks, 60000);
    }, delayNextMinute);
}

function checkOverdue(date, time, taskItem) {
    const idx = taskItem.dataset.index;
    const task = tasks[idx];
    if (task.completed) return;
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

document.addEventListener("DOMContentLoaded", function () {
    loadTasksFromStorage();
    renderTasks();
    addItem();
    checkInterval();

    document.querySelector(".tasks").addEventListener("click", function (e) {
        const taskItem = e.target.closest(".task__item");
        if (!taskItem) return;

        if (e.target.classList.contains("delete")) {
            removeItem(taskItem);
        } else if (e.target.classList.contains("done")) {
            toggleDone(taskItem);
        }
    });
});
