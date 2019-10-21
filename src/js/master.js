import firebase from 'firebase/app'
import 'firebase/database'
import { dbInit } from './db.js'
import { masterLayout } from './layouts/_master.js'
import { chat, command, pjList, swipe, loadMenu } from './utils.js'

export const master = (ctx) => {
  let campaign = ctx.params.campaign
  let tab = 'chat'

  const _init = (campaign) => {
    if (window.sessionStorage.getItem('campaign') !== campaign || window.sessionStorage.getItem('master') !== 'true') {
      window.open('/campaign/' + campaign, '_self')
    }

    document.querySelector('#app').innerHTML = `<div class="loading"><div class="spinner"></div></div>`

    dbInit()
    firebase.database().ref('/campaigns/' + campaign).off()

    document.querySelector('#app').innerHTML = masterLayout()

    document.querySelector('.js-title').innerHTML = campaign + ' Master'
    let menu = []
    menu.push({
      name: 'Inicio',
      url: '/',
      position: '.js-breadcrum'
    })
    menu.push({
      name: campaign.toUpperCase(),
      url: `/campaign/${campaign}`,
      position: '.js-breadcrum'
    })
    menu.push({
      name: 'Manual del jugador',
      url: 'https://tomascornelles.com/aneraio',
      position: '.js-extra-links'
    })

    loadMenu(menu)

    pjList(campaign, 'master')
    chat(campaign, 'master')

    let select = document.querySelector('.js-master-input')
    firebase.database().ref('/headers').once('value', function (snapshot) {
      let headers = snapshot.val()
      let campaignData

      firebase.database().ref('/campaigns/' + campaign).on('value', function (snapshot) {
        campaignData = snapshot.val()
        document.querySelector('header').style.backgroundImage = `url(${headers[campaignData.header]})`
        document.querySelector('header nav .bg-image').style.backgroundImage = `url(${headers[campaignData.header]})`
        for (const key in headers) {
          if (headers.hasOwnProperty(key)) {
            const header = headers[key]
            let option = document.createElement('option')
            option.value = key
            option.innerHTML = key
            option.selected = (campaignData.header === key)
            select.append(option)
          }
        }
      })
    })
    select.addEventListener('change', function () {
      firebase.database().ref('/campaigns/' + campaign).update({header: this.value})
    })

    let btnCommand = document.querySelectorAll('.js-command')
    for (let i = 0; i < btnCommand.length; i++) {
      btnCommand[i].addEventListener('click', function () {
        command(this.dataset.command, campaign, 'master')
      })
    }

    swipe(_pjSwipe)
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
