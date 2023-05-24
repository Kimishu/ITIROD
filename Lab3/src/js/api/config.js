import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js"

const firebaseConfig = {
    apiKey: "AIzaSyCpCyjRwaftRh5TTCXAz_mt6rtkcmkJeQI",
    authDomain: "fightinglist.firebaseapp.com",
    databaseURL: "https://fightinglist-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fightinglist",
    storageBucket: "fightinglist.appspot.com",
    messagingSenderId: "625314290181",
    appId: "1:625314290181:web:006367035c938f13559a6c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);
const storage = getStorage();


export { firebaseConfig, app, auth, database, storage}


