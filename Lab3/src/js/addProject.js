import { Authorized } from "./functions.js";
import { database } from "./api/config.js";
import { getUserId, checkAuth } from "./cookie.js";
import { set, ref, push } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";


submitData.addEventListener('click', (e) => {
    let projectTitle = document.getElementById('project_title').value;
    let projectDescription = document.getElementById('project_description').value;
    let tasks = [];

    if(projectTitle == ""){
        alert("Project title must exist!");
        return;
    }

    const project_id = push(ref(database, 'projects')).key;
    set(ref(database, 'projects/' + project_id), {
        title: projectTitle,
        description: projectDescription,
        author: getUserId(),
        tasks: tasks
    })
        .then(() => {
            window.location.replace(`profile.html`);
        })
        .catch((error) => {
            alert(error.message);
        });
});

if(!checkAuth()){
    window.location.replace(`signIn.html`);
}
else {
    Authorized();
}