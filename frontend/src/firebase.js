// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA_X2TKZVMcUin_cgIouEzoIJb0kVlL9s",
  authDomain: "chronus-96a22.firebaseapp.com",
  projectId: "chronus-96a22",
  storageBucket: "chronus-96a22.firebasestorage.app",
  messagingSenderId: "623988774037",
  appId: "1:623988774037:web:72b4d35412352d6f19b79c",
  measurementId: "G-9JG7J7WYDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export {app,auth,googleProvider}