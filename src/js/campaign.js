import firebase from 'firebase/app'
import 'firebase/database'
import page from 'page'
import { dbInit } from './db.js'

export const campaign = (ctx) => {
  let campaign = {}
  const _init = (id) => {
    document.querySelector('.js-main').innerHTML = `<div class="loading"><div class="spinner"></div></div>`
    dbInit()
    firebase.database().ref('/campaigns/' + id).on('value', function (snapshot) {
      campaign = snapshot.val()
      if (!campaign) return page('/error')
      campaign.id = id
      document.querySelector('#app').innerHTML = _template()
      document.querySelector('#app .content-fg2').classList.add('tab--active')
      document.querySelector('.js-title').innerHTML = campaign.name
    })
    if (window.sessionStorage.getItem('pj') !== null) {
      firebase.database().ref('/campaigns/' + id + '/characters/' + window.sessionStorage.getItem('pj')).update({active: false})
      window.sessionStorage.removeItem('pj')
    }
    document.querySelector('.js-breadcrum').innerHTML = '<a href="/">Inicio</a>'
  }

  const _template = () => {
    return `
    <div class="content content-fg1"></div>
      <div class="content content-fg2 tab--chat tab--active">
        <article class="js-main">
          <div class="campaign card">
            <p>${campaign.description}</p>
          </div>
          <div class="campaign card">
            <h2>Escoge un personaje</h2>
            <div class="campaign-pjs">${_pjList()}</div>
          </div>
          <div class="campaign card">
            <h2>Crea un nuevo personaje para "${campaign.name}"</h2>
            <p class="text-center"><a href="/campaign/${campaign.id}/new" class="btn">Nuevo personaje</a></p>
          </div>
        </article>
      </div>
    <div class="content content-fg1"></div>
    `
  }

  const _pjList = () => {
    let list = ''
    for (var a = 0; a < campaign.characters.length; a++) {
      let character = campaign.characters[a]
      list += (character)
        ? (!character.active)
          ? `<p><a href="/campaign/${campaign.id}/${a}" class="btn btn--wide"><strong>${character.name}</strong> (<em>${character.class} ${character.race} nivel ${character.level}</em>)</a></p>`
          : `<p><a class="btn btn--wide btn--disabled"><strong>${character.name}</strong> (<em>${character.class} ${character.race} nivel ${character.level}</em>)</a></p>`
        : ''
    }
    return list
  }

  _init(ctx.params.campaign)
}
