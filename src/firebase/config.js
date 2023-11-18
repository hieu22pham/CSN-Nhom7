import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDTOmnZGdGdfh7ykRTsy_kVE7buQkWaiFU",
  authDomain: "ttcsn-7e57f.firebaseapp.com",
  projectId: "ttcsn-7e57f",
  storageBucket: "ttcsn-7e57f.appspot.com",
  messagingSenderId: "130502436492",
  appId: "1:130502436492:web:33a69858881b6cb87bbda9",
  measurementId: "G-PT698598KN"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
export default firebase;