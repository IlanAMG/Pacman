import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyD34YzsEUek__fXzDl1zqLicebEa0g5JyM",
    authDomain: "pacman-e2df8.firebaseapp.com",
    databaseURL: "https://pacman-e2df8.firebaseio.com",
    projectId: "pacman-e2df8",
    storageBucket: "pacman-e2df8.appspot.com",
    messagingSenderId: "260508216863",
    appId: "1:260508216863:web:fd6333cacc0004449baf2a"
  };

export default firebase.initializeApp(firebaseConfig);