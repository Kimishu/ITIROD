import { checkAuth } from "./cookie.js";

function Authorized(){

    let elements = Array.from(document.getElementsByClassName('form_element'));
    let hr = document.getElementById('hr_elem');

    let result = checkAuth();
    if(result == true){
        //For side-bar
        let profileButton = document.createElement('a');
        profileButton.textContent = 'Profile';
        profileButton.setAttribute('href',"profile.html");

        let addProjectButton = document.createElement('a');
        addProjectButton.textContent = 'Add Projects';
        addProjectButton.setAttribute('href', "addProject.html");

        hr.before(profileButton);
        hr.after(addProjectButton);
    }
    else {
        //For nav-bar
        elements.forEach(function(element) {
            element.style.visibility = 'visible';
        });

        //For side-bar
        let signInButton = document.createElement('a');
        signInButton.textContent = 'SignIn';
        signInButton.setAttribute('href', "signIn.html");

        let signUpButton = document.createElement('a');
        signUpButton.textContent = 'SignUp';
        signUpButton.setAttribute('href', "signUp.html");

        hr.after(signUpButton);
        hr.after(signInButton);
    }
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
  
function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('.');
}

function GetDate(){
    return formatDate(new Date());
}

export {Authorized, GetDate}