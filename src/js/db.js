import firebase from 'firebase/app'
import 'firebase/database'

// Initialize Firebase
export function dbInit () {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyAKGv95kC_QS4gSl8NgguRIv9ygwa17-AI',
    authDomain: 'aneraio07.firebaseapp.com',
    databaseURL: 'https://aneraio07.firebaseio.com',
    projectId: 'aneraio07',
    storageBucket: '',
    messagingSenderId: '984485799576',
    appId: '1:984485799576:web:c4c5eec855c96d1ff392ed',
    measurementId: 'G-YZCF5K8R5R'
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
}
