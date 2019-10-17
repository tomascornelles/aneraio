import firebase from 'firebase/app'
import 'firebase/database'
import { dbInit } from './db.js'
import { chat, command, pjList, swipe } from './utils.js'

export const master = (ctx) => {
  let campaign = ctx.params.campaign
  let tab = 'chat'

  const _init = (campaign) => {
    if (window.sessionStorage.getItem('campaign') !== campaign || window.sessionStorage.getItem('master') !== 'true') {
      window.open('/campaign/' + campaign, '_self')
    }

    document.querySelector('.js-main').innerHTML = `<div class="loading"><div class="spinner"></div></div>`

    dbInit()
    firebase.database().ref('/campaigns/' + campaign).off()

    _layout()
    pjList(campaign, 'master')

    chat(campaign, 'master')
    let btnCommand = document.querySelectorAll('.js-command')
    for (let i = 0; i < btnCommand.length; i++) {
      btnCommand[i].addEventListener('click', function () {
        command(this.dataset.command, campaign, 'master')
      })
    }

    document.querySelector('.js-title').innerHTML = campaign + ' Master'
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

    swipe(_pjSwipe)
  }

  const _layout = () => {
    document.querySelector('#app').innerHTML = `
      <div class="content content-fg1 tab--list js-list"></div>
      <div class="content content-fg2 tab--chat tab--active">
        <article class="js-main chat"></article>
      </div>
      <div class="content content-fg1 tab--sheet js-pj">
        <p>
          <a class="btn btn--fab dice d4 js-command" data-command="/d4">d4</a>
          <a class="btn btn--fab dice d6 js-command" data-command="/d6">d6</a>
          <a class="btn btn--fab dice d8 js-command" data-command="/d8">d8</a>
          <a class="btn btn--fab dice d10 js-command" data-command="/d10">d10</a>
          <a class="btn btn--fab dice d12 js-command" data-command="/d12">d12</a>
          <a class="btn btn--fab dice d20 js-command" data-command="/d20">d20</a>
        </p>
        <p> <a href="/" target="_blank" class="btn btn--wide">Bestiario</a> </p>
        <p> <a href="/" target="_blank" class="btn btn--wide">NPCs</a> </p>
        <p> <a class="btn btn--wide js-command" data-command="/2d20">Ventaja</a> </p>
      </div>
      <nav class="tabs row">
        <button class="btn btn--flat content-fg1 js-tab js-tab-list" data-tab="list">Lista</button>
        <button class="btn btn--flat content-fg1 js-tab js-tab-chat button--active" data-tab="chat">Chat</button>
        <button class="btn btn--flat content-fg1 js-tab js-tab-sheet" data-tab="sheet">Tools</button>
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

  _init(campaign)
}
