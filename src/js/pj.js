import firebase from 'firebase/app'
import 'firebase/database'
import { fbInit } from './db.js'
import { $, render } from './utils.js'

export const pj = (ctx) => {
  let pj = {}
  let campaign = ctx.params.campaign
  const _init = (campaign, character) => {
    fbInit()
    firebase.database().ref('/campaigns/' + campaign + '/characters/' + character).on('value', function (snapshot) {
      pj = snapshot.val()
      pj.id = character
      $('#app', render, _template())
    })
  }

  const _template = () => {
    return `
    <div class="pj-sheet">
      <h2 class="pj-name">${pj.name}</h2>
      <a href="/">Inicio</a>
      <a href="/campaign/${campaign}">Volver a la lista</a>
    </div>
    `
  }

  _init(campaign, ctx.params.pj)
}
