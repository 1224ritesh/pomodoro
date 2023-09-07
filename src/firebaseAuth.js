import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, sendPasswordResetEmail, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
    apiKey: "AIzaSyCXnsMC4yDC0LMGug4FBNFGFpbdERkTOZc",
    authDomain: "pomodoro-f8ccf.firebaseapp.com",
    projectId: "pomodoro-f8ccf",
    storageBucket: "pomodoro-f8ccf.appspot.com",
    messagingSenderId: "939642673775",
    appId: "1:939642673775:web:3aedc35168b4db2a5a4b9a",
    measurementId: "G-GS6P1PE84V"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const signinWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const doc = await getDocs(q);
        if (doc.empty) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                authProvider: "google",
                createdAt: new Date(),
            });

        }
    } catch (error) {
        console.log(error.message);
    }

}

const register = async (name, email, password) => {
    try {

        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            email,
            authProvider: "local",
            createdAt: new Date(),

        });


    } catch (error) {
        console.log(error.message);
    }
}

const login = async (email, password) => {
    try {

        await signInWithEmailAndPassword(auth, email, password);
        console.log("logged in");

    } catch (error) {
        console.log(error.message);
    }
};

const logout = () => {
    try {
        signOut(auth);
    } catch (error) {
        console.log(error.message);
    }
};

const resetPassword = (email) => {
    try {
        sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (error) {
        console.log(error.message);
    }

};


export { db, auth, signinWithGoogle, register, login, logout, resetPassword };