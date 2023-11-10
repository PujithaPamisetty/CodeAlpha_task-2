const taskInput = document.getElementById('task-input');
const deadlineInput = document.getElementById('deadline-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const achievementList = document.getElementById('achievement-list');
const progressBar = document.getElementById('progress-bar-inner');
const resetPageButton = document.getElementById('reset-page-button');

addButton.addEventListener('click', addTask);
resetPageButton.addEventListener('click', resetPage);

function createTaskElement(taskText, deadline) {
    const task = document.createElement('li');
    task.textContent = taskText;
    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete-button');
    completeButton.addEventListener('click', moveToAchievements);
    task.appendChild(completeButton);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', deleteTask);
    task.appendChild(deleteButton);
    if (deadline) {
        const taskDeadline = document.createElement('span');
        taskDeadline.classList.add('task-deadline');
        taskDeadline.textContent = deadline;
        task.appendChild(taskDeadline);
    }
    return task;
}

function addTask() {
    const taskText = taskInput.value.trim();
    const deadline = deadlineInput.value.trim();
    const currentDate = new Date();
    const datePattern = /^(\d{1,2})-(\d{1,2})-(\d{2})$/;
    if (taskText !== '') {
        const dateMatch = deadline.match(datePattern);
        if (!dateMatch) {
            alert('Please enter a valid date (dd-mm-yy).');
            return;
        }
        const day = parseInt(dateMatch[1], 10);
        const month = parseInt(dateMatch[2], 10) - 1;
        const year = 2000 + parseInt(dateMatch[3], 10);
        const enteredDate = new Date(year, month, day);
        console.log(enteredDate);
        if (isNaN(enteredDate.getTime()) || enteredDate < currentDate) {
            alert('Please enter a valid date (dd-mm-yy) that is not before the current date.');
            return;
        }
        if (month > 12) {
            alert('Enter a valid month');
            return;
        }
        if (month === 2 && day > 28) {
            alert('Enter a valid date');
            return;
        }
        if (
            (month === 1 ||
                month === 3 ||
                month === 5 ||
                month === 7 ||
                month === 8 ||
                month === 10 ||
                month === 12) &&
            day > 31
        ) {
            alert('Enter valid date2');
            return;
        }
        if (
            (month === 2 || month === 4 || month === 6 || month === 9 || month === 11) &&
            day > 30
        ) {
            alert('Enter valid date3');
            return;
        }
        const task = createTaskElement(taskText, deadline);
        taskList.appendChild(task);
        taskInput.value = '';
        deadlineInput.value = '';
        sortTasks();
        updateProgressBar();
    }
}

function deleteTask(e) {
    const task = e.target.closest('li');
    task.parentElement.removeChild(task);
    updateProgressBar();
}

function moveToAchievements(e) {
    const task = e.target.closest('li');
    achievementList.appendChild(task);
    updateProgressBar();
}

function resetPage() {
    window.location.reload();
}

function updateProgressBar() {
    const totalTasks = taskList.children.length + achievementList.children.length;
    const completedTasks = achievementList.children.length;
    const progressPercentage = (completedTasks/totalTasks) * 100 || 0;
    progressBar.style.width= `${progressPercentage}%`;
}

function sortTasks() {
    const tasks =Array.from(taskList.children);
    const sortedTasks = tasks.sort((a, b) => {
    const aDeadline = a.querySelector('.task-deadline')?.textContent || '';
    const bDeadline = b.querySelector('.task-deadline')?.textContent || '';
    if (aDeadline && bDeadline) {
        const [aDay, aMonth, aYear] = aDeadline.split('-');
        const [bDay, bMonth, bYear] = bDeadline.split('-');
        const aDate = new Date(parseInt(aYear), parseInt(aMonth) - 1, parseInt(aDay));
        const bDate = new Date(parseInt(bYear), parseInt(bMonth) - 1, parseInt(bDay));
        return aDate - bDate;
    }
    else if (!aDeadline && bDeadline) {
        return 1;
    }
    else if (aDeadline && !bDeadline) {
        return -1;
    }
    return 0;
    });
    taskList.innerHTML='';
    sortedTasks.forEach((task) => {
        taskList.appendChild(task);
    });
}