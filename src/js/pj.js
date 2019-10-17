import firebase from 'firebase/app'
import 'firebase/database'
import page from 'page'
import { dbInit } from './db.js'
import { pjTemplate, pjTemplateNew } from './templates/pj.js'
import { chat, command, pjList, swipe } from './utils.js'
import { pjGenerator } from './generator.js'

export const pj = (ctx) => {
  let pj = {}
  let campaign = ctx.params.campaign
  let tab = 'chat'

  const _init = (campaign, character) => {
    document.querySelector('.js-main').innerHTML = `<div class="loading"><div class="spinner"></div></div>`

    dbInit()
    firebase.database().ref('/campaigns/' + campaign).off()

    _layout()
    _pjSheet(campaign, character)
    pjList(campaign, character)

    swipe(_pjSwipe)

    firebase.database().ref('/campaigns/' + campaign + '/characters/' + character).once('value', function (snapshot) {
      _savePj('active', true)
      window.sessionStorage.setItem('pj', character)
      window.sessionStorage.setItem('campaign', campaign)
    })
    window.addEventListener('beforeunload', function () { _savePj('active', false) })
  }

  const _layout = () => {
    document.querySelector('#app').innerHTML = `
      <div class="content content-fg1 tab--list js-list"></div>
      <div class="content content-fg2 tab--chat tab--active">
        <article class="js-main chat"></article>
      </div>
      <div class="content content-fg1 tab--sheet js-pj"></div>
      <nav class="tabs row">
        <button class="btn btn--flat content-fg1 js-tab js-tab-list" data-tab="list">Lista</button>
        <button class="btn btn--flat content-fg1 js-tab js-tab-chat button--active" data-tab="chat">Chat</button>
        <button class="btn btn--flat content-fg1 js-tab js-tab-sheet" data-tab="sheet">Ficha</button>
      </nav>
    `
    const tabs = document.querySelectorAll('.js-tab')

    for (let i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        document.querySelector('.tab--active').classList.remove('tab--active')
        document.querySelector('.tab--' + this.dataset.tab).classList.add('tab--active')
        document.querySelector('.button--active').classList.remove('button--active')
        this.classList.add('button--active')
        tab = this.dataset.tab
      })
    }
  }

  const _pjSheet = (campaign, character) => {
    firebase.database().ref('/headers').once('value', function (snapshot) {
      let headers = snapshot.val()
      console.log(headers)
      firebase.database().ref('/campaigns/' + campaign + '/header').on('value', function (snapshot) {
        let header = snapshot.val()
        console.log(header)
        document.querySelector('header').style.backgroundImage = `url(${headers[header]})`
        document.querySelector('header nav .bg-image').style.backgroundImage = `url(${headers[header]})`
      })
    })
    firebase.database().ref('/campaigns/' + campaign + '/characters/' + character).on('value', function (snapshot) {
      pj = snapshot.val()
      pj.id = character

      document.querySelector('.js-pj').innerHTML = pjTemplate(pj, true)

      const input = document.querySelectorAll('.pj-input')
      for (let i = 0; i < input.length; i++) {
        input[i].addEventListener('blur', function () {
          let val = (typeof this.value !== 'undefined') ? this.value : this.innerHTML
          _savePj(this.dataset.attribute, val)
        })
      }

      document.querySelector('.js-title').innerHTML = pj.name.toUpperCase()
      document.querySelector('.js-breadcrum').innerHTML = `<a href="/">Inicio</a> / <a href="/campaign/${campaign}">${campaign.toUpperCase()}</a>`
      document.querySelector('.js-extra-links').innerHTML = `<a href="https://tomascornelles.com/aneraio" target="_blank">Manual del jugador</a>`

      document.querySelector('.js-menu').innerHTML = ''
      let menu = document.createElement('option')
      menu.value = ''
      menu.innerHTML = '☰'
      document.querySelector('.js-menu').append(menu)
      let inicio = document.createElement('option')
      inicio.value = '/'
      inicio.innerHTML = 'Inicio'
      document.querySelector('.js-menu').append(inicio)
      let campLink = document.createElement('option')
      campLink.value = `/campaign/${campaign}`
      campLink.innerHTML = 'Campaña'
      document.querySelector('.js-menu').append(campLink)
      let manual = document.createElement('option')
      manual.value = 'https://tomascornelles.com/aneraio'
      manual.innerHTML = 'Manual del jugador'
      document.querySelector('.js-menu').append(manual)

      document.querySelector('.js-menu').addEventListener('change', function () {
        if (this.value.search(/^(http)/i) >= 0) { window.open(this.value, '_blank') } else { window.open(this.value, '_self') }
      })

      chat(campaign, pj)

      let btnCommand = document.querySelectorAll('.js-command')
      for (let i = 0; i < btnCommand.length; i++) {
        btnCommand[i].addEventListener('click', function () {
          command(this.dataset.command, campaign, pj)
        })
      }
    })
  }

  const _savePj = (prop, value) => {
    pj[prop] = value
    firebase.database().ref('/campaigns/' + campaign + '/characters/' + pj.id).update(pj)
  }

  const _pjSwipe = (start, end) => {
    console.log(tab, end > start)
    if (end - start > 50) {
      if (tab === 'list') {
        document.querySelector('.js-tab-list').click()
        tab = 'list'
      } else if (tab === 'chat') {
        document.querySelector('.js-tab-list').click()
        tab = 'list'
      } else if (tab === 'sheet') {
        document.querySelector('.js-tab-chat').click()
        tab = 'chat'
      }
    }
    if (end - start < -50) {
      if (tab === 'list') {
        document.querySelector('.js-tab-chat').click()
        tab = 'chat'
      } else if (tab === 'chat') {
        document.querySelector('.js-tab-sheet').click()
        tab = 'sheet'
      } else if (tab === 'sheet') {
        document.querySelector('.js-tab-sheet').click()
        tab = 'sheet'
      }
    }
  }

  _init(campaign, ctx.params.pj)
}

export const newPj = (ctx) => {
  const _init = (_campaign) => {
    console.log(_campaign)
    document.querySelector('.js-title').innerHTML = 'Crear un personaje'
    dbInit()

    let pj = pjGenerator()

    console.log(_campaign)
    _redraw(pj, _campaign)

    // document.querySelector('.campaign-form').addEventListener('submit', function (e) {
    //   e.preventDefault()
    //   _submit(document.querySelector('#pass').value, document.querySelector('#pass2').value, document.querySelector('#name').value, document.querySelector('#description').value)
    // })
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
      console.log(pj, _campaign)
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
