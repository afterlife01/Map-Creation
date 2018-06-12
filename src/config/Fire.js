import firebase from 'firebase';

  const config = {
    apiKey: "AIzaSyB0PkIbPAsDdX1-ETlh3m_ct3lo7c_eIno",
    authDomain: "projects-ebb91.firebaseapp.com",
    databaseURL: "https://projects-ebb91.firebaseio.com",
    projectId: "projects-ebb91",
    storageBucket: "projects-ebb91.appspot.com",
    messagingSenderId: "1008240443638"
  };

    firebase.initializeApp(config)
    export const auth = firebase.auth
    export const provider = new firebase.auth.FacebookAuthProvider();
    export default firebase;
