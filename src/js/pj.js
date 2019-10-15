import firebase from 'firebase/app'
import 'firebase/database'
import { dbInit } from './db.js'
import { pjTemplate } from './templates/pj.js'
import { chat, command, pjList, swipe } from './utils.js'

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
      window.sessionStorage.setItem('pj', pj.id)
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
