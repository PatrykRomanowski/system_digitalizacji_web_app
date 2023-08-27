import {
  initializeApp
} from "firebase/app";
import {
  getStorage
} from "firebase/storage";
import {
  getAuth
} from "firebase/auth";
import {
  getDatabase
} from 'firebase/database';



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

// const adminConfig = {
//   credential: admin.credential.cert({
//     projectId: 'systemdigitalizacji',
//     clientEmail: 'firebase-adminsdk-o25s4@systemdigitalizacji.iam.gserviceaccount.com',
//     privateKey: process.env.React_App_privateKey,
//   }),
//   databaseURL: "https://systemdigitalizacji-default-rtdb.europe-west1.firebasedatabase.app"
// };

// export const adminApp = admin.initializeApp(adminConfig);

export const app = initializeApp(firebaseConfig);

export const myStorage = getStorage(app);
export const auth2 = getAuth(app);

export const firebaseRealtime = getDatabase(app);