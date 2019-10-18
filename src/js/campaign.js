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
      if (!campaign) return page('/error/campaign')
      campaign.id = id
      document.querySelector('#app').innerHTML = _template()
      document.querySelector('#app .content-fg2').classList.add('tab--active')
      document.querySelector('.js-title').innerHTML = campaign.name
      document.querySelector('.master-form').addEventListener('submit', function (e) {
        e.preventDefault()
        _login(campaign.id, document.querySelector('.master-form-pass').value)
      })
      firebase.database().ref('/headers').once('value', function (snapshot) {
        let headers = snapshot.val()
        document.querySelector('header').style.backgroundImage = `url(${headers[campaign.header]})`
        document.querySelector('header nav .bg-image').style.backgroundImage = `url(${headers[campaign.header]})`
      })
    })
    if (window.sessionStorage.getItem('pj') !== null) {
      firebase.database().ref('/campaigns/' + window.sessionStorage.getItem('campaign') + '/characters/' + window.sessionStorage.getItem('pj')).update({active: false})
      window.sessionStorage.removeItem('pj')
      window.sessionStorage.removeItem('campaign')
    }
    document.querySelector('.js-breadcrum').innerHTML = `<a href="/">Inicio</a></a>`
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
    let manual = document.createElement('option')
    manual.value = 'https://tomascornelles.com/aneraio'
    manual.innerHTML = 'Manual del jugador'
    document.querySelector('.js-menu').append(manual)

    document.querySelector('.js-menu').addEventListener('change', function () {
      if (this.value.search(/^(http)/i) >= 0) { window.open(this.value, '_blank') } else { window.open(this.value, '_self') }
    })
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
          <div class="campaign card">
            <h2>Entra como "Master"</h2>
            <form class="master-form container--flex">
              <input type="password" class="input master-form-pass" autofocus>
              <input type="submit" value="Entrar" class="btn btn--flat">
            </form>
          </div>
          
        </article>
      </div>
    <div class="content content-fg1"></div>
    `
  }

  const _login = (campaign, pass) => {
    firebase.database().ref('/campaigns/' + campaign).once('value', function (snapshot) {
      if (pass === snapshot.val().pass) {
        window.sessionStorage.setItem('master', true)
        window.sessionStorage.setItem('campaign', campaign)
        window.open('/campaign/' + campaign + '/master', '_self')
      }
    })
  }

  const _pjList = () => {
    let list = ''
    if (typeof campaign.characters !== 'undefined') {
      for (const key in campaign.characters) {
        if (campaign.characters.hasOwnProperty(key)) {
          const character = campaign.characters[key]
          list += (character)
            ? (!character.active)
              ? `<p><a href="/campaign/${campaign.id}/${key}" class="btn btn--wide btn--principal"><strong>${character.name}</strong> (<em>${character.class} ${character.race} nivel ${character.level}</em>)</a></p>`
              : `<p><a class="btn btn--wide btn--disabled"><strong>${character.name}</strong> (<em>${character.class} ${character.race} nivel ${character.level}</em>)</a></p>`
            : ''
        }
      }
    }

    return list
  }

  _init(ctx.params.campaign)
}

export const newCampaign = () => {
  const _init = () => {
    document.querySelector('.js-title').innerHTML = 'Crear una nueva campaña'
    dbInit()
    document.querySelector('#app').innerHTML = _template()

    document.querySelector('.campaign-form').addEventListener('submit', function (e) {
      e.preventDefault()
      _submit(document.querySelector('#pass').value, document.querySelector('#pass2').value, document.querySelector('#name').value, document.querySelector('#description').value)
    })
    document.querySelector('.js-breadcrum').innerHTML = `<a href="/">Inicio</a></a>`
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
    let manual = document.createElement('option')
    manual.value = 'https://tomascornelles.com/aneraio'
    manual.innerHTML = 'Manual del jugador'
    document.querySelector('.js-menu').append(manual)

    document.querySelector('.js-menu').addEventListener('change', function () {
      if (this.value.search(/^(http)/i) >= 0) { window.open(this.value, '_blank') } else { window.open(this.value, '_self') }
    })
  }

  const _template = () => {
    return `
    <div class="content content-fg1"></div>
      <div class="content content-fg2 tab--chat tab--active">
        <article class="js-main">
          <div class="campaign card">
            <p>
              <form class="campaign-form container--flex" autocomplete="off">
                <label for="name">Contraseña para el narrador</label>
                <input type="password" id="pass" class="input input--wide input--top" autofocus>
                <input type="password" id="pass2" class="input input--wide input--bottom" placeholder="repite la contraseña">
                <label for="name">Título de la campaña</label>
                <input type="text" id="name" class="input input--wide">
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

  const _submit = (pass, pass2, name, description) => {
    let id
    name = name.trim()
    let error = document.querySelectorAll('form .error')
    for (let a = 0; a < error.length; a++) {
      error[a].remove()
    }
    if (pass.trim() !== pass2.trim()) {
      let p = document.createElement('p')
      p.classList.add('error')
      p.innerHTML = 'Las contraseñas no coinciden'
      document.querySelector('form').append(p)
    } else if (name === 'new') {
      let p = document.createElement('p')
      p.classList.add('error')
      p.innerHTML = 'El título de campaña no es válido'
      document.querySelector('form').append(p)
    } else if (name) {
      id = name.toLowerCase().replace(/\s+/g, '-').replace(/(ç)/gi, 'c').replace(/(ñ)/gi, 'n').replace(/&/g, '-and-')
        .replace(/(á)/gi, 'a').replace(/(é)/gi, 'e').replace(/(í)/gi, 'i').replace(/(ó)/gi, 'o').replace(/(ú)/gi, 'u')
        .replace(/(à)/gi, 'a').replace(/(è)/gi, 'e').replace(/(ì)/gi, 'i').replace(/(ò)/gi, 'o').replace(/(ù)/gi, 'u')
        .replace(/(ä)/gi, 'a').replace(/(ë)/gi, 'e').replace(/(ï)/gi, 'i').replace(/(ö)/gi, 'o').replace(/(ü)/gi, 'u')
        .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-*/, '').replace(/-*$/, '')

      firebase.database().ref('/campaigns/' + id).once('value', function (snapshot) {
        if (!snapshot.val()) {
          firebase.database().ref('/campaigns/' + id).set({
            description: description,
            name: name,
            pass: pass.trim(),
            header: 'day'
          })
          page('/campaign/' + id)
        } else {
          let p = document.createElement('p')
          p.classList.add('error')
          p.innerHTML = 'El nombre de campaña ya existe'
          document.querySelector('form').append(p)
        }
      })
    } else {
      var p = document.createElement('p')
      p.classList.add('error')
      p.innerHTML = 'Hay que rellenar todos los campos'
      document.querySelector('form').append(p)
    }
  }

  _init()
}
