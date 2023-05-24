import { database, storage } from './api/config.js';
import { checkAuth, getUserId, logOut } from './cookie.js';
import { Authorized } from "./functions.js";
import { getUser, getUserImage, uploadImageAndGetLink, getProjects, updateUser } from "./requests.js";

let containers = [];
let from = "";
let to = "";

logout.addEventListener('click', (e) => {
    logOut();
});

submitAvatar.addEventListener('click',()=>{
    var imageInput = document.getElementById('image_input')
    var image = imageInput.files[0]
    var userId = getUserId();
    uploadImageAndGetLink(storage,database, userId, image);
});

submitSettings.addEventListener('click',()=>{
    var newUsername = document.getElementById('new_username').value;
    var newPassword = document.getElementById('new_password').value;
    var newPasswordConfirm = document.getElementById('new_password_confirm').value;

    updateUser(newUsername, newPassword, newPasswordConfirm);
});

async function loadProfile(){
    let authorized = checkAuth();
    if(authorized == true){

        let userId = getUserId();
        let user = await getUser(userId);

        let elements = Array.from(document.getElementById('user_info').getElementsByTagName('p'));
        let elementsValues = [user.status, user.username, user.email, user.registrationDate];

        for(let i = 0; i < elements.length; i++){
            let text = elements[i].textContent;
            elements[i].textContent = text + elementsValues[i];
        }

        getUserImage(userId).then((link) => {
            document.getElementById('avatar-img').src = link;
        })

        let projects = await getProjects(userId);

        if(!projects){
            return;
        }
        
        var projectAddButton = document.getElementById('add_project');
        for(let project in projects){
            //Form project
            let articleProject = document.createElement('article');
            articleProject.setAttribute('class','project');

            //Add project title
            let h3 = document.createElement('h3');
            h3.textContent = projects[project].title;
            articleProject.appendChild(h3);

            //Form tasks container
            let tasksWrapper = document.createElement('div');
            tasksWrapper.setAttribute('class','tabcontent__tasks-wrapper');

            let tasks = projects[project].tasks;
            
            for(let task in tasks){
                //Form tasks
                let article = document.createElement('article');
                article.setAttribute('class', 'task');
                article.classList.add('draggable');

                //Form task form
                let form = document.createElement('form');
                form.setAttribute('class', 'task-form');

                let p = document.createElement('p');
                p.textContent = tasks[task].title;

                // let editButton = document.createElement('button');
                // editButton.setAttribute('class','task-edit__button');

                let buttonImage = document.createElement('img');
                buttonImage.setAttribute('src','../imgs/edit.png');

                form.appendChild(p);

                article.appendChild(form);
                article.draggable = 'true';

                //here

                article.addEventListener('dragstart', ()=>{
                    article.classList.add('dragging');
                    from = article.parentElement.id;
                })

                article.addEventListener('dragend',()=>{
                    article.classList.remove('dragging')
                    to = article.parentElement.id
                    updateTaskOrder();
                })

                article.addEventListener('touchstart', e => {
                    e.preventDefault()
                    article.classList.add('dragging')
                    from = article.parentElement.id
                })
    
                article.addEventListener('touchend', e => {
                    article.classList.remove('dragging')
                    to = article.parentElement.id
                    updateTaskOrder();
                })

                tasksWrapper.appendChild(article);
                
            }

            articleProject.appendChild(tasksWrapper);
            containers.push({project : tasksWrapper});

            let buttonAddTask = document.createElement('button');
            buttonAddTask.setAttribute('class', 'tabcontent__add-button');
            buttonAddTask.textContent = '+';
            buttonAddTask.addEventListener('click', (e)=>{
                const projectId = project;
                window.location.replace(`addTask.html?id=${projectId}`)
            });
            articleProject.appendChild(buttonAddTask);

            projectAddButton.before(articleProject);
        }
    }
}

if(!checkAuth()){
    window.location.replace(`signIn.html`);
}
else {
    Authorized();
}

await loadProfile();

for(let index in containers){
    for(let key in containers[index]){
        containers[index][key].addEventListener('dragover', handleDragOver)
        containers[index][key].addEventListener('touchmove', handleDragOver)

        function handleDragOver(e) {
            try {
                e.preventDefault()

                let clientY

                if (e.type === 'dragover') {
                    clientY = e.clientY
                } else if (e.type === 'touchmove') {
                    clientY = e.touches[0].clientY
                }

                const afterElement = getDragAfterElement(containers[index][key], clientY)
                const draggable = document.querySelector('.dragging')

                if (afterElement == null) {
                    containers[index][key].appendChild(draggable)
                } else {
                    containers[index][key].insertBefore(draggable, afterElement)
                }
            } catch {
                return
            }
        }
    }
}

// containers.forEach(container => {
//     console.log(container);
//     container.addEventListener('dragover', handleDragOver)
//     container.addEventListener('touchmove', handleDragOver)

//     function handleDragOver(e) {
//         try {
//             e.preventDefault()

//             let clientY

//             if (e.type === 'dragover') {
//                 clientY = e.clientY
//             } else if (e.type === 'touchmove') {
//                 clientY = e.touches[0].clientY
//             }

//             const afterElement = getDragAfterElement(container, clientY)
//             const draggable = document.querySelector('.dragging')

//             if (afterElement == null) {
//                 container.appendChild(draggable)
//             } else {
//                 container.insertBefore(draggable, afterElement)
//             }
//         } catch {
//             return
//         }
//     }
// })

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

function updateTaskOrder(){
    console.log(to);
    console.log(from);
    // if (from != to) {
    //     get(projectRef).then((snapshot) => {
    //         let project = snapshot.val()
    //         const allTasks = project.tasks[from].concat(project.tasks[to]).filter(task => task !== undefined);

    //         const fromOrder = GetTaskOrder(from)
    //         const toOrder = GetTaskOrder(to)

    //         project.tasks[from] = []
    //         project.tasks[to] = []

    //         fromOrder.forEach((taskId) => {
    //             project.tasks[from].push(allTasks.find(task => task.id === taskId))
    //         })
    //         toOrder.forEach((taskId) => {
    //             project.tasks[to].push(allTasks.find(task => task.id === taskId))
    //         })

    //         update(projectRef, { tasks: project.tasks })
    //             .then(() => {
    //                 updateTasks(from)
    //                 updateTasks(to)
    //             })
    //     })
    //         .catch((error) => {
    //             console.error(error.message)
    //         })
    // }
    // else {
    //     get(projectRef).then((snapshot) => {
    //         let project = snapshot.val()
    //         const allTasks = project.tasks[from]

    //         const order = GetTaskOrder(from)
    //         project.tasks[from] = []

    //         order.forEach((taskId) => {
    //             project.tasks[from].push(allTasks.find(task => task.id === taskId))
    //         })

    //         update(projectRef, { tasks: project.tasks })
    //             .then(() => {
    //                 updateTasks(from)
    //             })
    //     })
    //         .catch((error) => {
    //             console.error(error.message)
    //         })
    // }
}

