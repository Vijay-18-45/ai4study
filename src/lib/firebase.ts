import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-d9IxD86gOUXPq4SLQu76MaVvZWKBpL4",
  authDomain: "study-ai-26152.firebaseapp.com",
  projectId: "study-ai-26152",
  storageBucket: "study-ai-26152.firebasestorage.app",
  messagingSenderId: "751484835629",
  appId: "1:751484835629:web:43a27f18549aa81791a5a4",
  measurementId: "G-29GLBXSYV8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
