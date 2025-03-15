const getTaskFromLocalStorage= () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'))
    return localTasks ? localTasks : [];
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks))
}

const removeTask = (taskId) => {
    const tasks = getTaskFromLocalStorage();
    const updatedTasks = tasks.filter(({ id }) => parseInt(id) !== parseInt(taskId));
    setTasksInLocalStorage(updatedTasks);

    document
        .getElementById('todo-list')
        .removeChild(document.getElementById(taskId));

    updateTaskCounter(); 
}

const removeDoneTasks = () => {
    const tasks = getTaskFromLocalStorage();

    const tasksToRemove = tasks.
        filter(({ checked }) => checked)
        .map(({ id }) => id);
    
    const updatedtasks = tasks.filter(({ checked }) => !checked);
    setTasksInLocalStorage(updatedtasks);

    tasksToRemove.forEach((taskId) => {
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
            document.getElementById('todo-list').removeChild(taskElement);
        }
    });

    updateTaskCounter();
}

const updateTaskCounter = () => {
    const tasks = getTaskFromLocalStorage();

    let doneTasks = tasks.filter(({ checked }) => checked).length;
    let totalTasks = tasks.length;

    document.getElementById("counterDone").textContent = doneTasks;
    document.getElementById("counterTotalTasks").textContent = totalTasks;
};

const counterTaskDone = () => {
    let counterTasks = tasks.filter(({ checked }) => !checked);
    let counterTotalTasks = tasks.length;

    return counterTotalTasks, counterTasks
}



const createTaskListItem = (task, checkbox) => {
    const list = document.getElementById('todo-list');
    const toDo = document.createElement('li');
    const removeTaskButton = document.createElement('button');
    removeTaskButton.textContent = 'x';
    removeTaskButton.ariaLabel = 'Remover Tarefa'
    removeTaskButton.onclick = () => removeTask(task.id);

    toDo.id = task.id;
    toDo.appendChild(checkbox);
    toDo.appendChild(removeTaskButton);
    list.appendChild(toDo);

    return toDo;
}

const onCheckboxClick = (event) => {
    const id = event.target.id.split('-')[0];

    const tasks = getTaskFromLocalStorage();

    const updatedTasks = tasks.map((task) => {
        if(parseInt(id) === parseInt(task.id)) {
            return { ...task, checked: event.target.checked };
        }else {
            return task;
        }
        
    })

    setTasksInLocalStorage(updatedTasks);
    updateTaskCounter();
}

const getCheckboxInput = ({id, description, checked}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false;
    checkbox.addEventListener('change', onCheckboxClick)

    label.textContent = description;
    label.htmlFor = checkboxId;
    wrapper.className = 'checkbox-label-container';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;
}

const getNewTaskId = () => {
    const tasks = getTaskFromLocalStorage();
    const lastId = tasks[tasks.length -1]?.id;
    return lastId ? lastId +1 : 1;
}

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTaskId();
    return {description, id}
}

const getCreateTaskInfo = (event) => new Promise ((resolve) => {
    setTimeout(() => {
        resolve(getNewTaskData(event))
    },1000)
})

const createTask = async (event) => {
    event.preventDefault();
    document.getElementById('save-task').setAttribute('disabled', true)
    const NewTaskData = await getCreateTaskInfo(event);

    if(!NewTaskData.description.trim()) {
        alert('A descrição da tarefa não pode ser vazia!')
        return;
    }

    const checkbox = getCheckboxInput(NewTaskData)
    createTaskListItem(NewTaskData, checkbox);

    const tasks = getTaskFromLocalStorage();

    updatedTasks = [
        ...tasks, 
        {id: NewTaskData.id, description: NewTaskData.description, checked: false }
    ]
    setTasksInLocalStorage(updatedTasks)

    document.getElementById('description').value = '';
    document.getElementById('save-task').removeAttribute('disabled');

    updateTaskCounter();
}



window.onload = function() {
    const form = document.getElementById('create-todo-form');
    form.addEventListener('submit', createTask)

    const tasks = getTaskFromLocalStorage();

    tasks.forEach((task) => {
        const checkbox = getCheckboxInput(task);
        createTaskListItem(task, checkbox);
    });

    updateTaskCounter();
};