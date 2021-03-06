import firebase from 'firebase/app'
import 'firebase/database'
import { dbInit } from './db.js'
import { masterLayout } from './layouts/_master.js'
import { chat, command, pjList, swipe, loadMenu } from './utils.js'

export const master = (ctx) => {
  let campaign = ctx.params.campaign
  let campaignData
  let tab = 'chat'

  const _init = (campaign) => {
    if (window.sessionStorage.getItem('campaign') !== campaign || window.sessionStorage.getItem('master') !== 'true') {
      window.open('/campaign/' + campaign, '_self')
    }

    document.querySelector('#app').innerHTML = `<div class="loading"><div class="spinner"></div></div>`

    dbInit()
    firebase.database().ref('/campaigns/' + campaign).off()

    document.querySelector('#app').innerHTML = masterLayout()
    // let select = document.querySelector('.js-master-input')
    firebase.database().ref('/headers').once('value', function (snapshot) {
      let headers = snapshot.val()

      firebase.database().ref('/campaigns/' + campaign).on('value', function (snapshot) {
        campaignData = snapshot.val()
        document.querySelector('header').style.backgroundImage = `url(${headers[campaignData.header]})`
        document.querySelector('header nav .bg-image').style.backgroundImage = `url(${headers[campaignData.header]})`

        document.querySelector('.js-title').innerHTML = campaignData.name + ' - Master'

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

    pjList(campaign, 'master')
    chat(campaign, 'master')

    let btnCommand = document.querySelectorAll('.js-command')
    for (let i = 0; i < btnCommand.length; i++) {
      btnCommand[i].addEventListener('click', function () {
        command(this.dataset.command, campaign, 'master')
      })
    }

    document.querySelector('.master-copy-pj').addEventListener('submit', _copyPj)
    firebase.database().ref('/campaigns/' + campaign).on('value', function (snapshot) {
      let campaign = snapshot.val()
      document.querySelector('.js-timetracker').innerHTML = campaign.time
    })
    document.querySelector('.js-timetracker-plus').addEventListener('click', function () {
      let time = document.querySelector('.js-timetracker').innerHTML
      _timetracker('+', time)
    })
    document.querySelector('.js-timetracker-minus').addEventListener('click', function () {
      let time = document.querySelector('.js-timetracker').innerHTML
      _timetracker('-', time)
    })

    swipe(_pjSwipe)
  }

  const _timetracker = (sign, time) => {
    if (sign === '-') {
      if (time === -1) time = 23
      time--
    } else {
      time++
      if (time === 24) time = 0
    }

    let header = (time < 6)
      ? 'night'
      : (time < 8)
        ? 'dawn'
        : (time < 19)
          ? 'day'
          : (time < 21)
            ? 'dawn'
            : 'night'
    firebase.database().ref('/campaigns/' + campaign).update({time: time, header: header})
  }

  const _copyPj = (e) => {
    e.preventDefault()
    let input = document.querySelector('.master-copy-pj-input').value.toLowerCase()
    let _campaign = input.split('/')[0]
    let _pj = input.split('/')[1]
    firebase.database().ref('/campaigns/' + _campaign + '/characters/' + _pj).once('value', function (snapshot) {
      let pj = snapshot.val()
      if (pj !== null) {
        firebase.database().ref('/campaigns/' + campaign + '/characters/' + _pj).set(pj)
        this.value = ''
      } else {
        document.querySelector('.master-copy-pj-error').innerHTML = '<p class="error">El personaje no existe</p>'
      }
    })
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

  _init(campaign)
}
