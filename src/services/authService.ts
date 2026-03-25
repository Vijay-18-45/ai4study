import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(email: string, password: string, name: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(result.user);
  await createUserProfile(result.user, "email", name);
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const userDoc = await getDoc(doc(db, "users", result.user.uid));
  if (!userDoc.exists()) {
    await createUserProfile(result.user, "google", result.user.displayName || "User");
  }
  return result.user;
}

export async function logout() {
  await signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function resendVerificationEmail(user: User) {
  await sendEmailVerification(user);
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

async function createUserProfile(user: User, provider: string, name: string) {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email: user.email,
    provider,
    createdAt: serverTimestamp(),
  });
}
