import firebase from 'firebase';
require('firebase/firestore')

const config = {
  apiKey: "AIzaSyCKe5TZUL0mrwjA6CfnPLvWZ9bihauM_NM",
  authDomain: "map-creation-2d889.firebaseapp.com",
  databaseURL: "https://map-creation-2d889.firebaseio.com",
  projectId: "map-creation-2d889",
  storageBucket: "map-creation-2d889.appspot.com",
  messagingSenderId: "562265513034"
};

firebase.initializeApp(config)

export const auth = firebase.auth
export const provider = new firebase.auth.FacebookAuthProvider();
export const db = firebase.firestore()
const settings = {/* your settings... */ timestampsInSnapshots: true };
db.settings(settings);
export default firebase;
