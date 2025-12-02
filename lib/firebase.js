import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "FIREBASE_API_KEY_REDACTED",
    authDomain: "memorias-vivas-eb4c0.firebaseapp.com",
    projectId: "memorias-vivas-eb4c0",
    storageBucket: "memorias-vivas-eb4c0.firebasestorage.app",
    messagingSenderId: "649179746848",
    appId: "1:649179746848:web:522359edcd506116ac6245"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, storage, db, googleProvider };
