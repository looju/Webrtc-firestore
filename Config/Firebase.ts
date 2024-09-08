import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAzoOOYhnXTo73-iYZeb6_XqzZsiTtAcTA",
  authDomain: "me2u-1da09.firebaseapp.com",
  projectId: "me2u-1da09",
  storageBucket: "me2u-1da09.appspot.com",
  messagingSenderId: "91246886582",
  appId: "1:91246886582:web:eca41c295524988ba2f017",
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
