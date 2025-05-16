// Import the functions you need from the SDKs you need
// import { getAnalytics } from 'firebase/analytics';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDOP8xa3Vtqq7ZwPgJVxXGw1ZUf-5a-Aww',
  authDomain: 'otp-fyp-542ec.firebaseapp.com',
  projectId: 'otp-fyp-542ec',
  storageBucket: 'otp-fyp-542ec.firebasestorage.app',
  messagingSenderId: '10922307760',
  appId: '1:10922307760:web:c137e23829eceb52324b75',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

auth.useDeviceLanguage();

export { auth };
