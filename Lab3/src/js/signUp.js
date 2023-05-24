import { auth, database, storage} from './api/config.js'
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { createCookie } from './cookie.js';
import {set, ref as dbRef} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { ref as stRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js"
import { Authorized, GetDate } from "./functions.js";

submitData.addEventListener('click', (e) => {
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;
    let status = "User";
    let registrationDate = GetDate();
    let avatar = "";

    if(password != confirmPassword){
        alert("Password fields must be identical!")
        return
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user.uid);
            
            set(dbRef(database, 'users/' + user.uid), {
                username: username,
                email: email,
                status: status,
                registrationDate: registrationDate,
                avatar: avatar
            })
                .then(() => {
                    createCookie(user.uid);
                    window.location.replace("index.html");
                })
                .catch((error) => {
                    alert(error.message);
                });
        })
        .catch((error) => {
            console.log(error.message);
        });
    
});

Authorized();
