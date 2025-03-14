// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{getAuth} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCRQKOvVjDoqEPAR2ul-9MaJ88UPZyp-tA",
  authDomain: "ecommerce-22ffd.firebaseapp.com",
  projectId: "ecommerce-22ffd",
  storageBucket: "ecommerce-22ffd.firebasestorage.app",
  messagingSenderId: "670348901905",
  appId: "1:670348901905:web:99dfb303f8af0dcc01bbb0",
  measurementId: "G-1C6YT92ZTK"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const analytics = getAnalytics(app);
