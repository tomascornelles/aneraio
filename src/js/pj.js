import firebase from 'firebase/app'
import 'firebase/database'
import { dbInit } from './db.js'
import { pjTemplate, pjTemplateShort, pjMessages } from './templates/pj.js'

export const pj = (ctx) => {
  let pj = {}
  let campaign = ctx.params.campaign

  const _init = (campaign, character) => {
    _layout()

    dbInit()
    firebase.database().ref('/campaigns/' + campaign).off()

    _pjSheet(campaign, character)
    _pjList(campaign)
    _pjChat(campaign, character)

    firebase.database().ref('/campaigns/' + campaign + '/characters/' + character).once('value', function (snapshot) {
      _savePj('active', true)
      window.sessionStorage.setItem('pj', pj.id)
    })
    window.addEventListener('beforeunload', function () { _savePj('active', false) })
  }

  const _layout = () => {
    document.querySelector('#app').innerHTML = `
      <div class="content content-fg1 tab--list js-list"></div>
      <div class="content content-fg2 tab--chat tab--active">
        <article class="js-main chat"></article>
      </div>
      <div class="content content-fg1 tab--sheet js-pj"></div>
      <nav class="tabs row">
        <button class="btn btn--flat content-fg1 js-tab" data-tab="list">Lista</button>
        <button class="btn btn--flat content-fg1 js-tab button--active" data-tab="chat">Chat</button>
        <button class="btn btn--flat content-fg1 js-tab" data-tab="sheet">Ficha</button>
      </nav>
    `
    const tab = document.querySelectorAll('.js-tab')

    for (let i = 0; i < tab.length; i++) {
      tab[i].addEventListener('click', function () {
        console.log('>>>')
        document.querySelector('.tab--active').classList.remove('tab--active')
        document.querySelector('.tab--' + this.dataset.tab).classList.add('tab--active')
        document.querySelector('.button--active').classList.remove('button--active')
        document.querySelector(this).classList.add('button--active')
      })
    }
  }

  const _pjSheet = (campaign, character) => {
    firebase.database().ref('/campaigns/' + campaign + '/characters/' + character).on('value', function (snapshot) {
      pj = snapshot.val()
      pj.id = character

      document.querySelector('.js-pj').innerHTML = pjTemplate(pj, true)

      const input = document.querySelectorAll('.pj-input')

      for (let i = 0; i < input.length; i++) {
        input[i].addEventListener('blur', function () {
          _savePj(this.dataset.attribute, this.innerHTML)
        })
      }
      document.querySelector('.js-title').innerHTML = pj.name.toUpperCase()
      document.querySelector('.js-breadcrum').innerHTML = `<a href="/">Inicio</a> / <a href="/campaign/${campaign}">${campaign.toUpperCase()}</a>`
    })
  }

  const _pjList = (campaign) => {
    firebase.database().ref('/campaigns/' + campaign + '/characters').on('value', function (snapshot) {
      let pjs = snapshot.val()
      let list = ''
      for (let a = 0; a < pjs.length; a++) {
        if (pjs[a] && a!= pj.id) list += pjTemplateShort(pjs[a], false)
      }
      document.querySelector('.js-list').innerHTML = list
    })
  }

  const _pjChat = (campaign) => {
    let input = `
      <article>
        <form>
          <input type="text" class="input input--wide js-chat-message" autofocus placeholder="Escribe aquí (/3d6+1 p.e. para lanzar dados)">
          <input type="submit" value="✉︝" class="btn btn--flat btn--input">
          <a class="btn btn--fab dice d4 js-command" data-command="/d4">d4</a>
          <a class="btn btn--fab dice d6 js-command" data-command="/d6">d6</a>
          <a class="btn btn--fab dice d8 js-command" data-command="/d8">d8</a>
          <a class="btn btn--fab dice d10 js-command" data-command="/d10">d10</a>
          <a class="btn btn--fab dice d12 js-command" data-command="/d12">d12</a>
          <a class="btn btn--fab dice d20 js-command" data-command="/d20">d20</a>
        </form>
      </article>
      `

    firebase.database().ref('/campaigns/' + campaign + '/chat').on('value', function (snapshot) {
      let messages = snapshot.val()
      let wall = ''
      for (const prop in messages) {
        if (messages.hasOwnProperty(prop)) {
          const message = messages[prop]
          if (message) {
            let msg = (message.dm)
              ? pjMessages.dm(message.message)
              : (message.name === pj.name)
                ? pjMessages.pj(message.message, message.name)
                : pjMessages.general(message.message, message.name)
            wall = msg + wall
          }
        }
      }
      document.querySelector('.js-main').innerHTML = wall
    })
    document.querySelector('.js-chat-input').innerHTML = input

    let btnCommand = document.querySelectorAll('.js-command')
    
    for (let i = 0; i < btnCommand.length; i++) {
      btnCommand[i].addEventListener('click', function () {
        _command(this.dataset.command)
      })
    }

    document.querySelector('.js-chat-input form').addEventListener('submit', function (e) {
      e.preventDefault()
      let message = document.querySelector('.js-chat-message').value.trim()

      if (message !== '') {
        if (message.search('/') === 0) _command(message)
        else _saveChat(pj.name, message)
      }
      document.querySelector('.js-chat-message').value = ''
    })
  }

  const _savePj = (prop, value) => {
    pj[prop] = value
    firebase.database().ref('/campaigns/' + campaign + '/characters/' + pj.id).update(pj)
  }

  const _saveChat = (name, message) => {
    let time = Date.now()
    firebase.database().ref('/campaigns/' + campaign + '/chat/' + time).set({
      message: message,
      dm: false,
      name: name
    })
  }

  const _command = (message) => {
    message = message.replace(/[ ]/g, '')
    if (message.search(/^[/]\d*[d]\d+([+-]?\d)?/gmi) >= 0) {
      let str1 = message.split('/')[1]
      let str2 = str1.split('d')

      let diceNumber = (str2[0] === '') ? 1 : str2[0]
      let diceSides = ''
      let diceModifier = ''
      let diceBonus = ''

      if (str2[1].search(/[+]+/gmi) >= 0) {
        diceSides = str2[1].split('+')[0]
        diceBonus = str2[1].split('+')[1]
        diceModifier = '+'
      } else if (str2[1].search(/[-]+/gmi) >= 0) {
        diceSides = str2[1].split('-')[0]
        diceBonus = str2[1].split('-')[1]
        diceModifier = '-'
      } else {
        diceSides = str2[1]
      }

      let results = []
      let totalResult = 0
      for (let d = 0; d < diceNumber; d++) {
        let rnd = Math.ceil(Math.random() * parseInt(diceSides))
        results.push(rnd)
        // results += (d === 0) ? rnd : `, ${rnd}`
      }
      message = `He tirado ${str1}<br>`
      for (const result of results) {
        totalResult += parseInt(result)
        message += `<span class="dice d${diceSides}">${result}</span>`
      }
      totalResult += (diceModifier === '+')
        ? parseInt(diceBonus)
        : (diceModifier === '-')
          ? -parseInt(diceBonus)
          : 0
      message += `<br>Total: <strong>${totalResult}</strong>`
      _saveChat(pj.name, message)
    }
  }

  _init(campaign, ctx.params.pj)
}
