import { ref as dbRef, update, get} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { ref as stRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js"
import { updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { database, storage, auth } from './api/config.js'


async function getUsername(uid){
    const databaseRef = dbRef(database, `users/${uid}`);
    return get(databaseRef).then((user)=>{
        return user.val().username;
    }).catch((error) => {
        console.log(error);
        return 'undefined';
    });
}

async function getStatus(uid){
    const databaseRef = dbRef(database, `users/${uid}`);
    return get(databaseRef).then((user)=>{
        return user.val().status;
    }).catch((error) => {
        console.log(error);
        return 'undefined';
    });
}

async function getEmail(uid){
    const databaseRef = dbRef(database, `users/${uid}`);
    return get(databaseRef).then((user)=>{
        return user.val().email;
    }).catch((error) => {
        console.log(error);
        return 'undefined';
    });
}

async function getRegistrationDate(uid){
    const databaseRef = dbRef(database, `users/${uid}`);
    return get(databaseRef).then((user)=>{
        return user.val().registrationDate;
    }).catch((error) => {
        console.log(error);
        return 'undefined';
    });
}

async function getUser(uid){
    const databaseRef = dbRef(database, `users/${uid}`);
    return get(databaseRef).then((user)=>{
        return user.val();
    }).catch((error) => {
        console.log(error);
        return 'undefined';
    });
}

function uploadImageAndGetLink(storage, database, uid, image){
    const storageRef = stRef(storage, `avatars/${uid}/`);
    return uploadBytes(storageRef, image).then((snapshot) => {
        return getDownloadURL(snapshot.ref).then((link) => {
            return update(dbRef(database, `users/${uid}`), { 'avatar': link });
        });
    });
}

function getUserImage(uid) {
    const storageRef = stRef(storage, `avatars/${uid}`);
    return getDownloadURL(storageRef).then((url) => {
        return url;
    }).catch((error) => {
        console.log(error);
        return './imgs/default.jpg'
    });
}

async function getProjects(uid){
    let projectsData = {};
    return get(dbRef(database, 'projects')).then((projects) => {
        projects.forEach((project) => {
            const projectId = project.key;
            const projectData = project.val();
            if(projectData.author == uid){
                projectsData[projectId] = {
                    "title": projectData.title,
                    "tasks": projectData.tasks
                };
            }
        });
        return projectsData;
    }).catch((error) => {
        console.log(error);
    });
}

async function updateUser(newUsername, newPassword, newPasswordConfirm){
    auth.onAuthStateChanged((user)=>{
        if(user){
            if(newPassword != "" && newPassword == newPasswordConfirm){
                updatePassword(user, newPassword);
            }

            if(newUsername != ""){
                update(dbRef(database, `users/${user.uid}`), {'username': newUsername});
            }
            location.reload(true);
        }
    })
}

export {getUsername, getStatus, getEmail, getRegistrationDate, getUser, uploadImageAndGetLink, getUserImage, getProjects, updateUser}