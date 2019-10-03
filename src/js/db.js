import firebase from 'firebase/app'
import 'firebase/database'
import {$, render} from './utils.js'

// Initialize Firebase
export function fbInit () {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyBab63rQ35hI2yvepn5_rTv9nQHpS_tv1g',
    authDomain: 'aneraio-app.firebaseapp.com',
    databaseURL: 'https://aneraio-app.firebaseio.com',
    projectId: 'aneraio-app',
    storageBucket: 'aneraio-app.appspot.com',
    messagingSenderId: '906296300118',
    appId: '1:906296300118:web:cb7ef5c338553cb32b61f7'
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
}

export function db (search, selector) {
  firebase.database().ref('/' + search).on('value', function (snapshot) {
    // var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // _a_[selector] = snapshot.val()
    document.querySelector('#app').style.display = 'block'
  })
}
