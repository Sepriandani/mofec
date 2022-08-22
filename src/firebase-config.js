import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBq0Ro_qS_N2CLPQ7zvcGsTPVkQ7PNSlKE",
    authDomain: "mofecweb.firebaseapp.com",
    databaseURL: "https://mofecweb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mofecweb",
    storageBucket: "mofecweb.appspot.com",
    messagingSenderId: "79927434233",
    appId: "1:79927434233:web:af7543966b137cb7defb28"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);