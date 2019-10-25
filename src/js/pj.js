import firebase from 'firebase/app'
import 'firebase/database'
import { dbInit } from './db.js'
import { pjTemplate } from './templates/pj.js'
import { pjLayout } from './layouts/_pj.js'
import { chat, command, pjList, swipe, saveLog, loadMenu } from './utils.js'

export const pj = (ctx) => {
  let pj = {}
  let campaign = ctx.params.campaign
  let tab = 'chat'

  const _init = (campaign, character) => {
    document.querySelector('#app').innerHTML = `<div class="loading"><div class="spinner"></div></div>`

    dbInit()
    document.querySelector('#app').innerHTML = pjLayout()

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

    firebase.database().ref('/campaigns/' + campaign).off()

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

  const _pjSheet = (campaign, character) => {
    firebase.database().ref('/headers').once('value', function (snapshot) {
      let headers = snapshot.val()
      firebase.database().ref('/campaigns/' + campaign).on('value', function (snapshot) {
        let campaignData = snapshot.val()
        document.querySelector('header').style.backgroundImage = `url(${headers[campaignData.header]})`
        document.querySelector('header nav .bg-image').style.backgroundImage = `url(${headers[campaignData.header]})`

        let menu = []
        menu.push({
          name: 'Inicio',
          url: '/',
          position: '.js-breadcrum'
        })
        menu.push({
          name: campaignData.name,
          url: `/campaign/${campaign}`,
          position: '.js-breadcrum'
        })
        menu.push({
          name: 'Manual del jugador',
          url: 'https://tomascornelles.com/aneraio',
          position: '.js-extra-links'
        })

        loadMenu(menu)
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
    saveLog(prop, value, campaign, pj)
    firebase.database().ref('/campaigns/' + campaign + '/characters/' + pj.id).update(pj)
  }

  const _pjSwipe = (start, end) => {
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
