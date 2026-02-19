// ====== STATE ======
let tasks = [];

// ====== DOM REFERENCES ======
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const dueDateInput = document.getElementById("dueDate");
const durationInput = document.getElementById("duration");
const tagInput = document.getElementById("tag");

const tableBody = document.getElementById("task-table-body");

const totalTasksEl = document.getElementById("total-tasks");
const totalDurationEl = document.getElementById("total-duration");
const topTagEl = document.getElementById("top-tag");


// ====== FORM SUBMIT ======
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const newTask = {
        id: Date.now(),
        title: titleInput.value.trim(),
        dueDate: dueDateInput.value,
        duration: Number(durationInput.value),
        tag: tagInput.value.trim()
    };

    tasks.push(newTask);

    renderTasks();
    updateStats();

    form.reset();
});


// ====== RENDER TASKS ======
function renderTasks() {
    tableBody.innerHTML = "";

    tasks.forEach(task => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.dueDate}</td>
            <td>${task.duration}</td>
            <td>${task.tag}</td>
            <td>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


// ====== DELETE TASK ======
window.deleteTask = function (id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    updateStats();
};


// ====== UPDATE STATS ======
function updateStats() {
    totalTasksEl.textContent = tasks.length;

    const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
    totalDurationEl.textContent = totalDuration + " minutes";

    // calculate top tag
    const tagCount = {};
    tasks.forEach(task => {
        tagCount[task.tag] = (tagCount[task.tag] || 0) + 1;
    });

    let topTag = "-";
    let max = 0;

    for (let tag in tagCount) {
        if (tagCount[tag] > max) {
            max = tagCount[tag];
            topTag = tag;
        }
    }

    topTagEl.textContent = topTag;
}
