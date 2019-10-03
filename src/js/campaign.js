import firebase from 'firebase/app'
import 'firebase/database'
import { fbInit } from './db.js'
import { $, render } from './utils.js'

export const campaign = (ctx) => {
  let campaign = {}
  const _init = (id) => {
    fbInit()
    firebase.database().ref('/campaigns/' + id).on('value', function (snapshot) {
      campaign = snapshot.val()
      campaign.id = id
      $('#app', render, _template())
    })
  }

  const _template = () => {
    return `
    <div class="campaign">
      <h2 class="campaign-name">${campaign.name}</h2>
      <div class="campaign-pjs">${_pjList()}</div>
      <a href="/">Inicio</a>
    </div>
    `
  }

  const _pjList = () => {
    let list = ''
    for (var a = 0; a < campaign.characters.length; a++) {
      let character = campaign.characters[a]
      if (character) {
        list += `<p><a href="/campaign/${campaign.id}/${a}">${character.name}</a></p>`
      }
    }
    return list
  }

  _init(ctx.params.campaign)
}
