'use strict';

const body = document.body;
const addtaskHeading = document.getElementById('add_task_title');
const addNewTaskInput = document.getElementById('add_new_task');
const addTaskButton = document.getElementById('add_task_button');
const incompleteTask = document.getElementById('your_incomplete_task');
const yourTask = document.getElementById('your_task');
const completeTask = document.getElementById('your_completed-tasks');
const taskHeader = document.getElementById('completed');
let uncheckedTasks = incompleteTask.querySelectorAll('input[type=checkbox]');
let checkedTasks = completeTask.querySelectorAll('input[type=checkbox]');
const completedCount = document.getElementsByClassName('completed-count')[0];


// status of task means check how many taskis completed
const completeCount=() => {
    let completion_counter=0;
    let incompletion_task=document.getElementById('your_incomplete_task');
    let completion_task = document.getElementById('your_completed-tasks');
    let complete = (completion_task.querySelectorAll('input[type=checkbox]')).length
    let incomplete = (incompletion_task.querySelectorAll('input[type=checkbox]')).length;
    var total_task = complete + incomplete
    console.log("count", complete, incomplete,total_task)
    completion_counter=complete + ' / ' + total_task;
    completedCount.innerHTML=completion_counter;
}

// checked/uncheked task
for (let i = 0; i < checkedTasks.length; i++) {
    checkedTasks[i].checked = true;
}
for (let i = 0; i < uncheckedTasks.length; i++) {
    uncheckedTasks[i].checked = false;
}

// Adding new task
const addTask = () => {
    let task_name = addNewTaskInput.value;
    if (task_name !== '' && task_name !== ' ') {
        let newTask = createYourNewTask(task_name);
        incompleteTask.appendChild(newTask);
        incompleteTask.classList.toggle('show');
        addNewTaskInput.value = '';
    }
    completeCount();
};
// create list for your new task
const createYourNewTask = (taskHeading) => {
    //list
    let listItem = document.createElement('li');
    //checkbox
    let checkBox = document.createElement('input');
    let label = document.createElement('label');
    let iconEdit = document.createElement('i');
    let editInput = document.createElement('input');
    let editButton = document.createElement('button');
    let iconDelete = document.createElement('i');
    let deleteButton = document.createElement('button');
    listItem.className = 'task';
    checkBox.type = 'checkbox';
    checkBox.className = 'task__checkbox';
    editInput.type = 'text';
    editInput.className = 'input_text input_task';
    label.textContent = taskHeading;
    label.className = 'your_task_heading';
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    iconDelete.className = 'material-icons icon__delete';
    iconDelete.textContent = 'delete';
    deleteButton.className = 'button deleted_task';
    deleteButton.appendChild(iconDelete);
    listItem.appendChild(deleteButton);
    iconEdit.className = 'material-icons icon__edit';
    iconEdit.textContent = 'mode_edit';
    editButton.className = 'button edit_task';
    editButton.appendChild(iconEdit);
    listItem.appendChild(editButton);
    return listItem;
};

// Editing task
const todoTaskEdit = (taskToEdit) => {
    let listItem = taskToEdit;
    let editInput = listItem.querySelector('input[type=text]');
    let checkBox = listItem.querySelector('input[type=checkbox]');
    let iconEdit = listItem.getElementsByTagName('i')[1];
    let label = listItem.querySelector('label');
    let containsClass = listItem.classList.contains('editing');
    if (containsClass) {
        label.innerText = editInput.value;
        iconEdit.innerText = 'mode_edit';
        checkBox.disabled = false;
    } else {
        editInput.value = label.innerText;
        iconEdit.innerText = 'playlist_add_check';
        checkBox.disabled = true;
    }

    editInput.addEventListener('keyup', function (e) {
        if (e.which === 13) //enter
        {
            label.innerText = editInput.value;
            iconEdit.innerText = 'mode_edit';
            checkBox.disabled = false;
            listItem.classList.toggle('editing');
        }
    });
    listItem.classList.toggle('editing');
    completeCount();
};

const transformList = (listItem, currentList) => {
    let label = listItem.getElementsByTagName('label')[0];
    label.classList.toggle('is-done');
    switch (currentList) {
        case 'your_incomplete_task':
            completeTask.appendChild(listItem);
            break;
        case 'your_completed-tasks':
            incompleteTask.appendChild(listItem);
            break;
    }
    completeCount();
};

const confirmDialogue = function (clicked) {
    let listItem = clicked.parentNode;
    let ul = listItem.parentNode;
    let no = document.createElement('button');
    let yes = document.createElement('button');
    let divContainer = document.createElement('div');
    let dialogue_box = document.createElement('div');
    dialogue_box.className = 'dialogue';
    no.textContent = 'No';
    no.setAttribute('class', 'button dialogue_button dialogue_button_no');
    yes.setAttribute('class', 'button dialogue_button dialogue_button_yes');
    yes.textContent = 'Yes';
    dialogue_box.innerHTML = '<p>Do you want to delete this item?</p>';
    dialogue_box.appendChild(no);
    dialogue_box.appendChild(yes);
    divContainer.className = 'overlay';
    divContainer.appendChild(dialogue_box);
    body.appendChild(divContainer);

    yes.addEventListener('click', function () {
        deleteTask(ul, listItem, divContainer);
    });

    no.addEventListener('click', function () {
        body.removeChild(divContainer);
    });
    completeCount();
};

const deleteTask = function (ul, listItem, divContainer,) {
    ul.removeChild(listItem);
    body.removeChild(divContainer);
    completeCount();
};

// Add event listeners to edit/delete buttons
const what_do_want = (e) => {
    let listItem = e.target.parentNode;
    if (e.target.classList.contains('icon__edit')) {
        listItem = e.target.parentNode.parentNode;
        todoTaskEdit(listItem);
    } else if (e.target.classList.contains('task__title')) {
        todoTaskEdit(listItem);
    }
    else if (e.target.classList.contains('icon__delete')) {
        let buttonClicked = e.target.parentNode;
        confirmDialogue(buttonClicked);
    } else if (e.target.type === 'checkbox') {
        let currentList = listItem.parentNode.id;
        transformList(listItem, currentList);
    }
    completeCount();
};

incompleteTask.addEventListener('click', what_do_want);
completeTask.addEventListener('click', what_do_want);

// Accordion
yourTask.addEventListener('click', () => incompleteTask.classList.toggle('is-hidden'));
taskHeader.addEventListener('click', () => completeTask.classList.toggle('is-hidden'));
addtaskHeading.addEventListener('click', () => {
    addTaskButton.classList.toggle('is-hidden');
    addNewTaskInput.classList.toggle('is-hidden');
});

// Add new task - listeners
addNewTaskInput.addEventListener('keydown', function (e) {
    if (e.which === 13) //enter
    {
        addTask();
    }
});
addTaskButton.addEventListener('click', addTask);

/*Local storage
saveButton.addEventListener('click', () => {
    localStorage.incompleteContent = incompleteTask.innerHTML;
    localStorage.completedContent = completeTask.innerHTML;
});

if (localStorage.getItem('incompleteContent')) {
    incompleteTask.innerHTML = localStorage.getItem('incompleteContent');
}

if (localStorage.getItem('completedContent')) {
    completeTask.innerHTML = localStorage.getItem('completedContent');
}*/
