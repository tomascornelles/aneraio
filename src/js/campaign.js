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

      firebase.database().ref('/headers').once('value', function (snapshot) {
        let headers = snapshot.val()
        document.querySelector('header').style.backgroundImage = `url(${headers[campaign.header]})`
        document.querySelector('header nav .bg-image').style.backgroundImage = `url(${headers[campaign.header]})`
      })
    })
    if (window.sessionStorage.getItem('pj') !== null) {
      firebase.database().ref('/campaigns/' + id + '/characters/' + window.sessionStorage.getItem('pj')).update({active: false})
      window.sessionStorage.removeItem('pj')
    }
    document.querySelector('.js-breadcrum').innerHTML = '<a href="/">Inicio</a>'
    document.querySelector('.js-extra-links').innerHTML = `<a href="https://tomascornelles.com/aneraio" target="_blank">Manual del jugador</a>`
  }

  const _template = () => {
    let list = ''
    if (typeof campaign.characters !== 'undefined') {
      list = `<div class="campaign card">
        <h2>Escoge un personaje</h2>
        <div class="campaign-pjs">${_pjList()}</div>
      </div>`
    }
    return `
    <div class="content content-fg1"></div>
      <div class="content content-fg2 tab--chat tab--active">
        <article class="js-main">
          <div class="campaign card">
            <p>${campaign.description}</p>
          </div>
          ${list}
          <div class="campaign card">
            <h2>Crea un nuevo personaje para "${campaign.name}"</h2>
            <p class="text-center"><a href="/campaign/${campaign.id}/new" class="btn btn--principal">Nuevo personaje</a></p>
          </div>
        </article>
      </div>
    <div class="content content-fg1"></div>
    `
  }

  const _pjList = () => {
    let list = ''
    if (typeof campaign.characters !== 'undefined') {
      for (var a = 0; a < campaign.characters.length; a++) {
        let character = campaign.characters[a]
        list += (character)
          ? (!character.active)
            ? `<p><a href="/campaign/${campaign.id}/${a}" class="btn btn--wide btn--principal"><strong>${character.name}</strong> (<em>${character.class} ${character.race} nivel ${character.level}</em>)</a></p>`
            : `<p><a class="btn btn--wide btn--disabled"><strong>${character.name}</strong> (<em>${character.class} ${character.race} nivel ${character.level}</em>)</a></p>`
          : ''
      }
    }

    return list
  }

  _init(ctx.params.campaign)
}

export const newCampaign = () => {
  const _init = () => {
    dbInit()
    document.querySelector('#app').innerHTML = _template()

    document.querySelector('.campaign-form').addEventListener('submit', function (e) {
      e.preventDefault()
      _submit(document.querySelector('#name').value, document.querySelector('#description').value)
    })
  }

  const _template = () => {
    return `
    <div class="content content-fg1"></div>
      <div class="content content-fg2 tab--chat tab--active">
        <article class="js-main">
          <div class="campaign card">
            <p>
              <form class="campaign-form container--flex">
                <label for="name">Nombre</label>
                <input type="text" id="name" class="input input--wide" autofocus>
                <label for="name">Descripción</label>
                <textarea id="description" class="input input--wide" ></textarea>
                <input type="submit" value="Crear" class="btn btn--principal">
              </form>
            </p>
          </div>
        </article>
      </div>
    <div class="content content-fg1"></div>
    `
  }

  const _submit = (name, description) => {
    let id
    if (name.trim()) {
      id = name.toLowerCase().replace(/\s+/g, '-').replace(/(ç)/gi, 'c').replace(/(ñ)/gi, 'n').replace(/&/g, '-and-')
        .replace(/(á)/gi, 'a').replace(/(é)/gi, 'e').replace(/(í)/gi, 'i').replace(/(ó)/gi, 'o').replace(/(ú)/gi, 'u')
        .replace(/(à)/gi, 'a').replace(/(è)/gi, 'e').replace(/(ì)/gi, 'i').replace(/(ò)/gi, 'o').replace(/(ù)/gi, 'u')
        .replace(/(ä)/gi, 'a').replace(/(ë)/gi, 'e').replace(/(ï)/gi, 'i').replace(/(ö)/gi, 'o').replace(/(ü)/gi, 'u')
        .replace(/[^a-z0-9\-]/g, '').replace(/-+/g, '-').replace(/^-*/, '').replace(/-*$/, '')
    }
    firebase.database().ref('/campaigns/' + id).set({
      description: description,
      name: name,
      header: 'day'
    })
    page('/campaign/' + id)
  }

  _init()
}
