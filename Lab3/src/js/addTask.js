import { Authorized } from "./functions.js";
import { database } from "./api/config.js";
import { checkAuth } from "./cookie.js";
import {ref, push } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

submitData.addEventListener('click', (e) => {
    var taskTitle = document.getElementById('task_title').value;
    var projectId = new URLSearchParams(window.location.search).get('id');

    if(taskTitle == ""){
        alert("Project title must exist!");
        return;
    }

    push(ref(database, 'projects/' + projectId + '/tasks/'), {
        title: taskTitle,
        status: false
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