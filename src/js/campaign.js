import firebase from 'firebase/app'
import 'firebase/database'
import { dbInit } from './db.js'
import { campaignLayout } from './layouts/_campaign.js'
import { loadMenu } from './utils.js'

export const campaign = (ctx) => {
  const _init = (id) => {
    let campaign = {}
    document.querySelector('#app').innerHTML = `<div class="loading"><div class="spinner"></div></div>`
    dbInit()
    firebase.database().ref('/campaigns/' + id).on('value', function (snapshot) {
      campaign = snapshot.val()
      if (!campaign) return window.open('/error/campaign', '_self')

      campaign.id = id
      document.querySelector('#app').innerHTML = campaignLayout(campaign)
      document.querySelector('.js-title').innerHTML = campaign.name
      document.querySelector('.master-form').addEventListener('submit', function (e) {
        _login(campaign.id, document.querySelector('.master-form-pass').value)
      })

      firebase.database().ref('/headers').once('value', function (snapshot) {
        let headers = snapshot.val()
        document.querySelector('header').style.backgroundImage = `url(${headers[campaign.header]})`
        document.querySelector('header nav .bg-image').style.backgroundImage = `url(${headers[campaign.header]})`
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
    })

    if (window.sessionStorage.getItem('pj') !== null) {
      firebase.database().ref('/campaigns/' + window.sessionStorage.getItem('campaign') + '/characters/' + window.sessionStorage.getItem('pj')).update({active: false})
      window.sessionStorage.removeItem('pj')
      window.sessionStorage.removeItem('campaign')
    }
  }

  const _login = (campaign, pass, e) => {
    e.preventDefault()
    firebase.database().ref('/campaigns/' + campaign).once('value', function (snapshot) {
      if (pass === snapshot.val().pass) {
        window.sessionStorage.setItem('master', true)
        window.sessionStorage.setItem('campaign', campaign)
        window.open('/campaign/' + campaign + '/master', '_self')
      }
    })
  }

  _init(ctx.params.campaign)
}
