import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDG4Fb2hlLRCcSswAt4nIakTBnm4od1oiw",
  authDomain: "hh-online-clothing-store.firebaseapp.com",
  projectId: "hh-online-clothing-store",
  storageBucket: "hh-online-clothing-store.appspot.com",
  messagingSenderId: "75598662869",
  appId: "1:75598662869:web:67cce0478bb5385867a65c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign-up functionality (Only for Regular Users)
const signupForm = document.querySelector('form.signup');
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Automatically assign the role of 'user' to newly signed-up users
    await setDoc(doc(db, "account", user.uid), {
      email: user.email,
      role: "user" // All new signups are regular users
    });

    console.log('User signed up:', user);
    alert('Sign-up successful! Redirecting to User Home.');

    // Redirect to user home page
    window.location.href = "user-home.html";
    
  } catch (error) {
    console.error('Error during sign-up:', error.code, error.message);
    alert('Sign-up failed: ' + error.message);
  }
});

// Login functionality
const loginForm = document.querySelector('form.login');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user role from Firestore
    const userDoc = await getDoc(doc(db, "account", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const role = userData.role;
      
      // Redirect based on role
      if (role === "admin") {
        alert('Login successful! Redirecting to Admin Dashboard.');
        window.location.href = "admin-dashboard.html"; // Admin dashboard
      } else {
        alert('Login successful! Redirecting to User Home.');
        window.location.href = "user-home.html"; // Regular user home page
      }
    } else {
      throw new Error("No user role found in Firestore");
    }

  } catch (error) {
    console.error('Error during login:', error.code, error.message);
    alert('Login failed: ' + error.message);
  }
});
