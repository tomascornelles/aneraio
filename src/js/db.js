import firebase from 'firebase/app'
import 'firebase/database'

// Initialize Firebase
export function dbInit () {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyDfxz7P8yVhB27YE8CNR8iQ-w0I_Hlyp2o',
    authDomain: 'labyrinth-lord.firebaseapp.com',
    databaseURL: 'https://labyrinth-lord.firebaseio.com',
    projectId: 'labyrinth-lord',
    storageBucket: 'labyrinth-lord.appspot.com',
    messagingSenderId: '1095012192726',
    appId: '1:1095012192726:web:5805c2e72b7913cc9fd477',
    measurementId: 'G-1LRZQS44ZG'
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
}
