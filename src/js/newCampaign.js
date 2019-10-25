import firebase from 'firebase/app'
import 'firebase/database'
import { dbInit } from './db.js'
import { newCampaignLayout } from './layouts/_newCampaign.js'
import { loadMenu } from './utils.js'

export const newCampaign = () => {
  const _init = () => {
    dbInit()
    document.querySelector('#app').innerHTML = newCampaignLayout()
    document.querySelector('.js-title').innerHTML = 'Crear una nueva campaña'

    document.querySelector('.campaign-form').addEventListener('submit', function (e) {
      e.preventDefault()
      _submit(document.querySelector('#pass').value, document.querySelector('#pass2').value, document.querySelector('#name').value, document.querySelector('#description').value)
    })

    let menu = []
    menu.push({
      name: 'Inicio',
      url: '/',
      position: '.js-breadcrum'
    })
    menu.push({
      name: 'Manual del jugador',
      url: 'https://tomascornelles.com/aneraio',
      position: '.js-extra-links'
    })

    loadMenu(menu)
  }

  const _submit = (pass, pass2, name, description) => {
    let id
    name = name.trim()
    let error = document.querySelectorAll('form .error')
    for (let a = 0; a < error.length; a++) {
      error[a].remove()
    }
    if (pass.trim() !== pass2.trim()) {
      let p = document.createElement('p')
      p.classList.add('error')
      p.innerHTML = 'Las contraseñas no coinciden'
      document.querySelector('form').append(p)
    } else if (name === 'new') {
      let p = document.createElement('p')
      p.classList.add('error')
      p.innerHTML = 'El título de campaña no es válido'
      document.querySelector('form').append(p)
    } else if (name) {
      id = name.toLowerCase().replace(/\s+/g, '-').replace(/(ç)/gi, 'c').replace(/(ñ)/gi, 'n').replace(/&/g, '-and-')
        .replace(/(á)/gi, 'a').replace(/(é)/gi, 'e').replace(/(í)/gi, 'i').replace(/(ó)/gi, 'o').replace(/(ú)/gi, 'u')
        .replace(/(à)/gi, 'a').replace(/(è)/gi, 'e').replace(/(ì)/gi, 'i').replace(/(ò)/gi, 'o').replace(/(ù)/gi, 'u')
        .replace(/(ä)/gi, 'a').replace(/(ë)/gi, 'e').replace(/(ï)/gi, 'i').replace(/(ö)/gi, 'o').replace(/(ü)/gi, 'u')
        .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-*/, '').replace(/-*$/, '')

      firebase.database().ref('/campaigns/' + id).once('value', function (snapshot) {
        if (!snapshot.val()) {
          firebase.database().ref('/campaigns/' + id).set({
            description: description,
            name: name,
            pass: pass.trim(),
            header: 'day',
            time: 12
          })
          window.open('/campaign/' + id, '_self')
        } else {
          let p = document.createElement('p')
          p.classList.add('error')
          p.innerHTML = 'El nombre de campaña ya existe'
          document.querySelector('form').append(p)
        }
      })
    } else {
      var p = document.createElement('p')
      p.classList.add('error')
      p.innerHTML = 'Hay que rellenar todos los campos'
      document.querySelector('form').append(p)
    }
  }

  _init()
}
