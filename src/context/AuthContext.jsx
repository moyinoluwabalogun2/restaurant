import React, { createContext, useEffect, useState } from 'react';
import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged,
sendPasswordResetEmail,
updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
const [currentUser, setCurrentUser] = useState(null);
const [userData, setUserData] = useState(null);
const [loading, setLoading] = useState(true);

// Signup
async function signup(email, password, userInfo) {
try {
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
await updateProfile(userCredential.user, {
displayName: userInfo.name
});

const userDoc = {
uid: userCredential.user.uid,
email: userCredential.user.email,
name: userInfo.name,
phone: userInfo.phone,
role: 'customer',
createdAt: new Date().toISOString()
};

await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
toast.success('Account created successfully!');
return userCredential;
} catch (error) {
toast.error('Failed to create account. Please try again.');
throw error;
}
}

// Login
async function login(email, password) {
try {
const userCredential = await signInWithEmailAndPassword(auth, email, password);
toast.success('Welcome back!');
return userCredential;
} catch (error) {
toast.error('Invalid email or password.');
throw error;
}
}

// Logout
async function logout() {
try {
await signOut(auth);
toast.success('Logged out successfully');
} catch (error) {
toast.error('Failed to log out.');
throw error;
}
}

// Reset password
async function resetPassword(email) {
try {
await sendPasswordResetEmail(auth, email);
toast.success('Password reset email sent!');
} catch (error) {
toast.error('Failed to send reset email.');
throw error;
}
}

// Update user profile
async function updateUserProfile(updates) {
try {
await updateProfile(auth.currentUser, updates);
if (updates.name || updates.phone) {
await setDoc(
doc(db, 'users', auth.currentUser.uid),
{ ...updates },
{ merge: true }
);
}
toast.success('Profile updated successfully!');
} catch (error) {
toast.error('Failed to update profile.');
throw error;
}
}

// Listen to auth state
useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, async (user) => {
setCurrentUser(user);

if (user) {
try {
const userDoc = await getDoc(doc(db, 'users', user.uid));
if (userDoc.exists()) {
setUserData(userDoc.data());
}
} catch (error) {
console.error('Error fetching user data:', error);
}
} else {
setUserData(null);
}

setLoading(false);
});

return unsubscribe;
}, []);

const value = {
currentUser,
userData,
signup,
login,
logout,
resetPassword,
updateUserProfile
};

return (
<AuthContext.Provider value={value}>
{!loading && children}
</AuthContext.Provider>
);
}

export default AuthContext;