const state = {
    projects: JSON.parse(localStorage.getItem('projects')) || [
        { id: 1, name: 'Personal', tasks: [] },
        { id: 2, name: 'Trabajo', tasks: [] }
    ],
    currentProjectId: null
};

const elements = {
    projectList: document.getElementById('projectList'),
    taskList: document.getElementById('taskList'),
    currentProjectTitle: document.getElementById('currentProjectTitle'),
    addProjectBtn: document.getElementById('addProjectBtn'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    projectModal: document.getElementById('projectModal'),
    projectNameInput: document.getElementById('projectNameInput'),
    cancelProjectBtn: document.getElementById('cancelProjectBtn'),
    saveProjectBtn: document.getElementById('saveProjectBtn'),
    taskModal: document.getElementById('taskModal'),
    taskTitleInput: document.getElementById('taskTitleInput'),
    taskDescInput: document.getElementById('taskDescInput'),
    cancelTaskBtn: document.getElementById('cancelTaskBtn'),
    saveTaskBtn: document.getElementById('saveTaskBtn'),
    emptyState: document.getElementById('emptyState'),
    exportBtn: document.getElementById('exportBtn'),
    importBtn: document.getElementById('importBtn'),
    fileInput: document.getElementById('fileInput'),
    welcomeImage: document.getElementById('welcomeImage')
};

function saveState() {
    localStorage.setItem('projects', JSON.stringify(state.projects));
}

function generateId() {
    return Date.now();
}

function renderProjects() {
    elements.projectList.innerHTML = '';
    
    state.projects.forEach(project => {
        const li = document.createElement('li');
        li.className = `project-item ${project.id === state.currentProjectId ? 'active' : ''}`;
        li.innerHTML = `
            <span>${project.name}</span>
            <button class="delete-project" data-id="${project.id}">&times;</button>
        `;
        li.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-project')) {
                selectProject(project.id);
            }
        });
        elements.projectList.appendChild(li);
    });
}

let draggedTaskId = null;

function renderTasks() {
    const project = state.projects.find(p => p.id === state.currentProjectId);
    
    if (!project) {
        elements.taskList.innerHTML = '';
        elements.currentProjectTitle.textContent = 'Selecciona un proyecto';
        elements.addTaskBtn.disabled = true;
        elements.emptyState.style.display = 'block';
        return;
    }

    elements.currentProjectTitle.textContent = project.name;
    elements.addTaskBtn.disabled = false;
    elements.emptyState.style.display = 'none';
    
    elements.taskList.innerHTML = '';
    
    project.tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.draggable = true;
        li.dataset.taskId = task.id;
        li.dataset.index = index;
        li.innerHTML = `
            <span class="drag-handle">⋮⋮</span>
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                ${task.description ? `<span class="task-description">${task.description}</span>` : ''}
            </div>
            <button class="delete-task" data-id="${task.id}">&times;</button>
        `;
        
        li.querySelector('.task-checkbox').addEventListener('change', () => {
            toggleTask(task.id);
        });
        
        li.querySelector('.delete-task').addEventListener('click', () => {
            deleteTask(task.id);
        });

        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragend', handleDragEnd);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('dragenter', handleDragEnter);
        li.addEventListener('dragleave', handleDragLeave);
        li.addEventListener('drop', handleDrop);
        
        elements.taskList.appendChild(li);
    });
}

function handleDragStart(e) {
    draggedTaskId = parseInt(e.target.dataset.taskId);
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedTaskId);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.task-item').forEach(item => {
        item.classList.remove('drag-over', 'drag-placeholder');
    });
    draggedTaskId = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    const item = e.target.closest('.task-item');
    if (item && parseInt(item.dataset.taskId) !== draggedTaskId) {
        item.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const item = e.target.closest('.task-item');
    if (item && !item.contains(e.relatedTarget)) {
        item.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const targetItem = e.target.closest('.task-item');
    if (!targetItem || !draggedTaskId) return;

    const targetTaskId = parseInt(targetItem.dataset.taskId);
    if (targetTaskId === draggedTaskId) return;

    const project = state.projects.find(p => p.id === state.currentProjectId);
    if (!project) return;

    const draggedIndex = project.tasks.findIndex(t => t.id === draggedTaskId);
    const targetIndex = project.tasks.findIndex(t => t.id === targetTaskId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedTask] = project.tasks.splice(draggedIndex, 1);
    project.tasks.splice(targetIndex, 0, draggedTask);

    saveState();
    renderTasks();
}

function selectProject(projectId) {
    state.currentProjectId = projectId;
    renderProjects();
    renderTasks();
}

function addProject(name) {
    const project = {
        id: generateId(),
        name: name,
        tasks: []
    };
    state.projects.push(project);
    saveState();
    selectProject(project.id);
}

function deleteProject(id) {
    state.projects = state.projects.filter(p => p.id !== id);
    if (state.currentProjectId === id) {
        state.currentProjectId = null;
    }
    saveState();
    renderProjects();
    renderTasks();
}

function addTask(text, description) {
    const project = state.projects.find(p => p.id === state.currentProjectId);
    if (!project) return;
    
    const task = {
        id: generateId(),
        text: text,
        description: description || '',
        completed: false
    };
    project.tasks.push(task);
    saveState();
    renderTasks();
}

function toggleTask(taskId) {
    const project = state.projects.find(p => p.id === state.currentProjectId);
    if (!project) return;
    
    const task = project.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveState();
        renderTasks();
    }
}

function deleteTask(taskId) {
    const project = state.projects.find(p => p.id === state.currentProjectId);
    if (!project) return;
    
    project.tasks = project.tasks.filter(t => t.id !== taskId);
    saveState();
    renderTasks();
}

function openProjectModal() {
    elements.projectModal.classList.add('active');
    elements.projectNameInput.value = '';
    elements.projectNameInput.focus();
}

function closeProjectModal() {
    elements.projectModal.classList.remove('active');
}

function openTaskModal() {
    elements.taskModal.classList.add('active');
    elements.taskTitleInput.value = '';
    elements.taskDescInput.value = '';
    elements.taskTitleInput.focus();
    if (elements.welcomeImage) {
        elements.welcomeImage.style.display = 'flex';
    }
}

function closeTaskModal() {
    elements.taskModal.classList.remove('active');
    if (elements.welcomeImage) {
        elements.welcomeImage.style.display = 'none';
    }
}

elements.addProjectBtn.addEventListener('click', openProjectModal);
elements.cancelProjectBtn.addEventListener('click', closeProjectModal);
elements.saveProjectBtn.addEventListener('click', () => {
    const name = elements.projectNameInput.value.trim();
    if (name) {
        addProject(name);
        closeProjectModal();
    }
});

elements.projectNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const name = elements.projectNameInput.value.trim();
        if (name) {
            addProject(name);
            closeProjectModal();
        }
    }
});

elements.addTaskBtn.addEventListener('click', openTaskModal);

elements.cancelTaskBtn.addEventListener('click', closeTaskModal);
elements.saveTaskBtn.addEventListener('click', () => {
    const title = elements.taskTitleInput.value.trim();
    const desc = elements.taskDescInput.value.trim();
    if (desc) {
        addTask(title, desc);
        closeTaskModal();
    } else {
        alert('Debes incluir una descripción');
    }
});

elements.taskTitleInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.taskDescInput.focus();
    }
});

elements.taskDescInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const title = elements.taskTitleInput.value.trim();
        const desc = elements.taskDescInput.value.trim();
        if (desc) {
            addTask(title, desc);
            closeTaskModal();
        } else {
            alert('Debes incluir una descripción');
        }
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-project')) {
        const id = parseInt(e.target.dataset.id);
        if (confirm('¿Eliminar este proyecto y todas sus tareas?')) {
            deleteProject(id);
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
        closeTaskModal();
    }
});

elements.projectModal.addEventListener('click', (e) => {
    if (e.target === elements.projectModal) {
        closeProjectModal();
    }
});

elements.taskModal.addEventListener('click', (e) => {
    if (e.target === elements.taskModal) {
        closeTaskModal();
    }
});

function exportData() {
    const data = { projects: state.projects };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.projects && Array.isArray(data.projects)) {
                state.projects = data.projects;
                state.currentProjectId = null;
                saveState();
                renderProjects();
                renderTasks();
                alert('Datos importados correctamente');
            } else {
                alert('Archivo JSON inválido');
            }
        } catch (err) {
            alert('Error al leer el archivo');
        }
    };
    reader.readAsText(file);
}

elements.exportBtn.addEventListener('click', exportData);
elements.importBtn.addEventListener('click', () => elements.fileInput.click());
elements.fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        importData(e.target.files[0]);
        e.target.value = '';
    }
});

renderProjects();
renderTasks();
