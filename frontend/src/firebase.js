import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9J-psBMY0dj7P7SZ3dox4O2xhkfgqnFU",
  authDomain: "mini-task-manager-fffa7.firebaseapp.com",
  projectId: "mini-task-manager-fffa7",
  storageBucket: "mini-task-manager-fffa7.firebasestorage.app",
  messagingSenderId: "853967116454",
  appId: "1:853967116454:web:3b56352a5fd681b15a3c67",
  measurementId: "G-67Y6CPXP8G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);