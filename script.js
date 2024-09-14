
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'employee', password: 'employee123', role: 'employee' }
];

function promptLogin() {
    const username = prompt("Enter username:");
    const password = prompt("Enter password:");
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        if (user.role === 'admin') {
            document.getElementById('admin-dashboard').style.display = 'block';
            document.getElementById('employee-dashboard').style.display = 'none';
            renderTasks();
        } else {
            document.getElementById('admin-dashboard').style.display = 'none';
            document.getElementById('employee-dashboard').style.display = 'block';
            renderEmployeeTasks(user.username);
        }
    } else {
        alert('Invalid credentials!');
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    location.reload();
}

function assignTask() {
    const task = document.getElementById('task').value;
    const employee = document.getElementById('employee').value;

    if (task && employee) {
        tasks.push({ task, employee, status: 'Pending', progress: 0 });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach((t, index) => {
        const taskBox = document.createElement('div');
        taskBox.className = 'task-box';
        taskBox.innerHTML = `
            <strong>${t.task}</strong><br>
            Assigned to: ${t.employee}<br>
            Status: ${t.status}
            <div class="status-bar">
                <div class="progress-bar-status" style="width: ${t.progress}%"></div>
            </div>
            <div class="task-actions">
                <input type="number" min="0" max="100" value="${t.progress}" onchange="updateProgress(${index}, this.value)" style="width: 80px;">
                <button class="btn-success" onclick="updateTaskStatus(${index}, 'Completed')">Mark as Completed</button>
                <button class="btn-danger" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskBox);
    });
}

function renderEmployeeTasks(employeeName) {
    const employeeTasks = document.getElementById('employee-tasks');
    employeeTasks.innerHTML = '';
    tasks.filter(t => t.employee === employeeName).forEach((t, index) => {
        const taskBox = document.createElement('div');
        taskBox.className = 'task-box';
        taskBox.innerHTML = `
            <strong>${t.task}</strong><br>
            Status: ${t.status}
            <div class="status-bar">
                <div class="progress-bar-status" style="width: ${t.progress}%"></div>
            </div>
            <div class="task-actions">
                <input type="number" min="0" max="100" value="${t.progress}" onchange="updateProgress(${index}, this.value)" style="width: 80px;">
                <button class="btn-success" onclick="updateTaskStatus(${index}, 'In Progress')">Mark as In Progress</button>
                <button class="btn-success" onclick="updateTaskStatus(${index}, 'Completed')">Mark as Completed</button>
            </div>
        `;
        employeeTasks.appendChild(taskBox);
    });
}

function updateProgress(index, progress) {
    tasks[index].progress = parseInt(progress, 10);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function updateTaskStatus(index, status) {
    tasks[index].status = status;
    tasks[index].progress = status === 'Completed' ? 100 : tasks[index].progress;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function filterTasks() {
    const filter = document.getElementById('task-filter').value;
    if (filter === 'all') {
        renderTasks();
    } else {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.filter(t => t.status === filter).forEach((t, index) => {
            const taskBox = document.createElement('div');
            taskBox.className = 'task-box';
            taskBox.innerHTML = `
                <strong>${t.task}</strong><br>
                Assigned to: ${t.employee}<br>
                Status: ${t.status}
                <div class="status-bar">
                    <div class="progress-bar-status" style="width: ${t.progress}%"></div>
                </div>
                <div class="task-actions">
                    <input type="number" min="0" max="100" value="${t.progress}" onchange="updateProgress(${index}, this.value)" style="width: 80px;">
                    <button class="btn-success" onclick="updateTaskStatus(${index}, 'Completed')">Mark as Completed</button>
                    <button class="btn-danger" onclick="deleteTask(${index})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskBox);
        });
    }
}

window.onload = promptLogin;