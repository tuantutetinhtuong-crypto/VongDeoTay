import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDol7-MQcpI9QRFTyzeWrDP1WyC4or8WE4",
  authDomain: "vongdeotay-84e31.firebaseapp.com",
  databaseURL: "https://vongdeotay-84e31-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vongdeotay-84e31",
  storageBucket: "vongdeotay-84e31.firebasestorage.app",
  messagingSenderId: "358205950024",
  appId: "1:358205950024:web:5809eb9ad24c107a5a307d",
  measurementId: "G-HXW17M4DNQ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    errorMessage.innerText = "❌ " + error.message;
  }
});