import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";

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

// Sign-up functionality
const signupForm = document.querySelector('form.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up successfully
      const user = userCredential.user;
      console.log('User signed up:', user);
      alert('Sign-up successful!');
    })
    .catch((error) => {
      console.error('Error during sign-up:', error.code, error.message);
      alert('Sign-up failed: ' + error.message);
    });
});

// Login functionality
const loginForm = document.querySelector('form.login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Logged in successfully
      const user = userCredential.user;
      console.log('User logged in:', user);
      alert('Login successful!');
    })
    .catch((error) => {
      console.error('Error during login:', error.code, error.message);
      alert('Login failed: ' + error.message);
    });
});

