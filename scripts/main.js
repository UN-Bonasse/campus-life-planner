// ====== STATE ======
let tasks = [];

// ====== DOM REFERENCES ======
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const dueDateInput = document.getElementById("dueDate");
const durationInput = document.getElementById("duration");
const tagInput = document.getElementById("tag");

const titleError = document.getElementById("title-error");
const dateError = document.getElementById("date-error");
const durationError = document.getElementById("duration-error");
const tagError = document.getElementById("tag-error");

const tableBody = document.getElementById("task-table-body");

const totalTasksEl = document.getElementById("total-tasks");
const totalDurationEl = document.getElementById("total-duration");
const topTagEl = document.getElementById("top-tag");

const searchInput = document.getElementById("search");
const capMessageEl = document.getElementById("cap-message");
const weeklyCapInput = document.getElementById("weekly-cap");
const unitSelect = document.getElementById("unit");

// ====== VALIDATION FUNCTION ======
function validateForm() {
    let isValid = true;

    // Clear old errors
    titleError.textContent = "";
    dateError.textContent = "";
    durationError.textContent = "";
    tagError.textContent = "";

    // Title: letters, numbers, spaces (3–50 chars)
    const titleRegex = /^[a-zA-Z0-9 ]{3,50}$/;
    if (!titleRegex.test(titleInput.value.trim())) {
        titleError.textContent = "Title must be 3–50 characters (letters & numbers only).";
        isValid = false;
    }

    // Date required
    if (!dueDateInput.value) {
        dateError.textContent = "Please select a date.";
        isValid = false;
    }

    // Duration: positive number
    const durationRegex = /^[1-9][0-9]*$/;
    if (!durationRegex.test(durationInput.value)) {
        durationError.textContent = "Duration must be a positive number.";
        isValid = false;
    }

    // Tag: letters only (2–20 chars)
    const tagRegex = /^[a-zA-Z]{2,20}$/;
    if (!tagRegex.test(tagInput.value.trim())) {
        tagError.textContent = "Tag must be 2–20 letters only.";
        isValid = false;
    }

    return isValid;
}

// ====== FORM SUBMIT ======
form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const newTask = {
        id: Date.now(),
        title: titleInput.value.trim(),
        dueDate: dueDateInput.value,
        duration: Number(durationInput.value),
        tag: tagInput.value.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);

    renderTasks();
    updateStats();
    form.reset();
});

// ====== RENDER TASKS ======
function renderTasks(filteredTasks = tasks) {
    tableBody.innerHTML = "";

    filteredTasks.forEach(task => {
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

    let totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
    let displayDuration = totalDuration;
    if (unitSelect.value === "hours") {
        displayDuration = (totalDuration / 60).toFixed(2);
    }

    totalDurationEl.textContent = displayDuration + " " + unitSelect.value;

    // Calculate top tag
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

    // Weekly cap message
    const cap = Number(weeklyCapInput.value);
    if (cap > 0) {
        if (totalDuration <= cap) {
            capMessageEl.textContent = `You have ${cap - totalDuration} minutes remaining this week.`;
            capMessageEl.setAttribute("aria-live", "polite");
        } else {
            capMessageEl.textContent = `You exceeded your weekly cap by ${totalDuration - cap} minutes!`;
            capMessageEl.setAttribute("aria-live", "assertive");
        }
    } else {
        capMessageEl.textContent = "";
    }
}

// ====== LIVE REGEX SEARCH ======
searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim();

    if (!query) {
        renderTasks(); // show all if search empty
        return;
    }

    try {
        const regex = new RegExp(query, "i"); // case-insensitive
        const filtered = tasks.filter(task =>
            regex.test(task.title) ||
            regex.test(task.tag) ||
            regex.test(task.dueDate)
        );
        renderTasks(filtered);
    } catch (error) {
        renderTasks();
    }
});

// ====== UNIT & CAP CHANGES ======
unitSelect.addEventListener("change", updateStats);
weeklyCapInput.addEventListener("input", updateStats);

// ====== SORTING WITH VISUAL INDICATOR ======
const headers = document.querySelectorAll("th[data-sort]");
let sortDirection = {}; // tracks asc/desc per column

headers.forEach(header => {
    sortDirection[header.dataset.sort] = "asc";

    header.addEventListener("click", () => {
        const key = header.dataset.sort;
        const direction = sortDirection[key];

        // Reset indicator arrows
        headers.forEach(h => {
            h.textContent = h.textContent.replace(/ ⬆| ⬇/g, "");
        });

        // Sort tasks
        tasks.sort((a, b) => {
            if (key === "duration") {
                return direction === "asc" ? a.duration - b.duration : b.duration - a.duration;
            } else if (key === "dueDate") {
                return direction === "asc"
                    ? new Date(a.dueDate) - new Date(b.dueDate)
                    : new Date(b.dueDate) - new Date(a.dueDate);
            } else { // title
                if (a[key].toLowerCase() < b[key].toLowerCase()) return direction === "asc" ? -1 : 1;
                if (a[key].toLowerCase() > b[key].toLowerCase()) return direction === "asc" ? 1 : -1;
                return 0;
            }
        });

        // Update header arrow
        header.textContent += direction === "asc" ? " ⬆" : " ⬇";

        // Toggle direction
        sortDirection[key] = direction === "asc" ? "desc" : "asc";

        renderTasks();
    });
});
