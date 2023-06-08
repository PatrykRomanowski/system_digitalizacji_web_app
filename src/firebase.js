import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.React_App_APIKEY,
  authDomain: process.env.React_App_authDomain,
  projectId: process.env.React_App_projectId,
  databaseURL: process.env.React_App_databaseURL,
  storageBucket: "systemdigitalizacji.appspot.com",
  messagingSenderId: process.env.React_App_messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.Raect_App_measurementId,
};

export const app = initializeApp(firebaseConfig);

export const myStorage = getStorage(app);
export const auth = getAuth(app);
