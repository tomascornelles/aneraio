import firebase from 'firebase/app'
import 'firebase/database'
import { dbInit } from './db.js'
import { newPjLayout } from './layouts/_newPj.js'
import { pjTemplateNew } from './templates/pj.js'
import { pjGenerator } from './generator.js'
import { loadMenu } from './utils.js'

export const newPj = (ctx) => {
  const _init = (_campaign) => {
    dbInit()

    document.querySelector('#app').innerHTML = newPjLayout()
    document.querySelector('.js-title').innerHTML = 'Crear un personaje'

    let pj = pjGenerator()

    _redraw(pj, _campaign)

    let menu = []
    menu.push({
      name: 'Inicio',
      url: '/',
      position: '.js-breadcrum'
    })
    menu.push({
      name: _campaign.toUpperCase(),
      url: `/campaign/${_campaign}`,
      position: '.js-breadcrum'
    })
    menu.push({
      name: 'Manual del jugador',
      url: 'https://tomascornelles.com/aneraio',
      position: '.js-extra-links'
    })

    loadMenu(menu)
  }

  const _redraw = (pj, _campaign) => {
    document.querySelector('.js-main').innerHTML = pjTemplateNew(pj, true)
    const input = document.querySelectorAll('.pj-input')
    for (let i = 0; i < input.length; i++) {
      input[i].addEventListener('blur', function (e) {
        let val = (typeof this.value !== 'undefined') ? this.value : this.innerHTML
        pj[this.dataset.attribute] = val
        _redraw(pj, _campaign)
      })
    }
    document.querySelector('.js-generate-pj').addEventListener('click', function (e) {
      e.preventDefault()
      _init(_campaign)
    })
    document.querySelector('.js-save-pj').addEventListener('click', function (e) {
      e.preventDefault()
      _submit(pj, _campaign)
    })
  }

  const _submit = (pj, _campaign) => {
    let id
    let name = pj.name.trim()
    let error = document.querySelectorAll('form .error')
    for (let a = 0; a < error.length; a++) {
      error[a].remove()
    }
    if (name === 'new' || name === 'master') {
      let p = document.createElement('p')
      p.classList.add('error')
      p.innerHTML = 'El nombre no es válido'
      document.querySelector('form').append(p)
    } else if (name) {
      id = name.toLowerCase().replace(/\s+/g, '-').replace(/(ç)/gi, 'c').replace(/(ñ)/gi, 'n').replace(/&/g, '-and-')
        .replace(/(á)/gi, 'a').replace(/(é)/gi, 'e').replace(/(í)/gi, 'i').replace(/(ó)/gi, 'o').replace(/(ú)/gi, 'u')
        .replace(/(à)/gi, 'a').replace(/(è)/gi, 'e').replace(/(ì)/gi, 'i').replace(/(ò)/gi, 'o').replace(/(ù)/gi, 'u')
        .replace(/(ä)/gi, 'a').replace(/(ë)/gi, 'e').replace(/(ï)/gi, 'i').replace(/(ö)/gi, 'o').replace(/(ü)/gi, 'u')
        .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-*/, '').replace(/-*$/, '')

      firebase.database().ref('/campaigns/' + _campaign + '/characters/' + id).once('value', function (snapshot) {
        if (!snapshot.val()) {
          firebase.database().ref('/campaigns/' + _campaign + '/characters/' + id).set(pj)
          page('/campaign/' + _campaign + '/' + id)
        } else {
          var p = document.createElement('p')
          p.classList.add('error')
          p.innerHTML = 'El nombre de personaje ya existe'
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

  _init(ctx.params.campaign)
}
