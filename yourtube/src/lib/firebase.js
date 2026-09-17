// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo2I1TU0H1tc7ZnOMJM-oaYf8j8IgFf4I",
  authDomain: "yourtube-91c0b.firebaseapp.com",
  projectId: "yourtube-91c0b",
  storageBucket: "yourtube-91c0b.firebasestorage.app",
  messagingSenderId: "261556277163",
  appId: "1:261556277163:web:769d195621fc180ff98cee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider();
export{auth,provider};
