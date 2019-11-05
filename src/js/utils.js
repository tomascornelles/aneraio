import firebase from 'firebase/app'
import 'firebase/database'
import { pjTemplateShort, pjMessages } from './templates/pj.js'

export function chat (campaign, pj) {
  let input = `
      <article>
        <form>
          <input type="text" class="input input--wide js-chat-message" autofocus placeholder="Escribe aquí (/3d6+1 p.e. para lanzar dados)">
          <input type="submit" value="📧" class="btn btn--flat btn--input">
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
          let msg = (message.id === 'master')
            ? pjMessages.dm(message.message, (pj === 'master'), prop)
            : (message.id === pj.id)
              ? pjMessages.pj(message.message, message.name, (pj === 'master'), prop)
              : (message.id === 'log')
                ? (pj === 'master')
                  ? pjMessages.log(message.message, message.name, (pj === 'master'), prop)
                  : ''
                : pjMessages.general(message.message, message.name, (pj === 'master'), prop)
          wall = msg + wall
        }
      }
    }
    document.querySelector('.js-main').innerHTML = wall

    const deleteBtn = document.querySelectorAll('.js-delete')
    for (let i = 0; i < deleteBtn.length; i++) {
      deleteBtn[i].addEventListener('click', function () {
        let campaign = window.sessionStorage.getItem('campaign')
        firebase.database().ref('/campaigns/' + campaign + '/chat/' + this.dataset.id).remove()
      })
    }

    document.onkeypress = function (e) {
      e = e || window.event
      if (e.keyCode === 160) document.querySelector('.js-chat-message').focus()
    }
  })
  document.querySelector('.js-chat-input').innerHTML = input

  document.querySelector('.js-chat-input form').addEventListener('submit', function (e) {
    e.preventDefault()
    let message = document.querySelector('.js-chat-message').value.trim()
    if (message !== '') {
      if (message.search('/') === 0) command(message, campaign, pj)
      else saveChat(message, campaign, pj)
    }
    document.querySelector('.js-chat-message').value = ''
  })
}

export function saveChat (message, campaign, pj) {
  let time = Date.now()
  if (message.search(/^(http)+.+\.(gif|jpg|jpeg|tiff|png)$/i) === 0) {
    message = `<a href="${message}" target="_blank"><img src="${message}" /></a>`
  } else if (message.search(/^(https:\/\/www.youtube.com|https:\/\/youtube.com|https:\/\/youtu.be)/i) === 0) {
    let url = message.split('/')
    url = url[url.length - 1]
    if (url.search(/^(watch\?v=)/i) >= 0) {
      url = url.split('watch?v=')
      url = url[1]
    }
    message = `<div class="video"><iframe width="100%" height="0" src="https://www.youtube.com/embed/${url}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
  } else if (message.search(/^(https:\/\/|http:\/\/)/i) === 0) {
    message = `<a href="${message}" target="_blank">${message}</a>`
  }
  firebase.database().ref('/campaigns/' + campaign + '/chat/' + time).set({
    message: message,
    dm: false,
    name: (pj === 'master') ? 'master' : pj.name,
    id: (pj === 'master') ? 'master' : pj.id
  })
}

export function saveLog (prop, value, campaign, pj) {
  if (prop !== 'active') {
    let timestamp = Date.now()
    let time = new Date()
    let date = {
      day: time.getDay(),
      month: time.getMonth(),
      year: time.getYear(),
      hour: time.getHours(),
      minute: time.getMinutes()
    }
    if (date.minute.length === 1) date.minute = '0' + date.minute
    if (date.minute.length === 2) date.minute = '00'
    let message = `[${date.hour}:${date.minute}] ha cambiado ${prop} por ${value}`
    firebase.database().ref('/campaigns/' + campaign + '/chat/' + timestamp).set({
      message: message,
      dm: false,
      name: pj.name,
      id: 'log'
    })
  }
}

export function pjList (campaign, pj) {
  if (pj === 'master') {
    firebase.database().ref('/campaigns/' + campaign + '/characters').on('value', function (snapshot) {
      let pjs = snapshot.val()
      let list = ''
      for (const key in pjs) {
        if (pjs[key] && pjs[key].active) list += pjTemplateShort(pjs[key], key, true)
      }
      for (const key in pjs) {
        if (pjs[key] && !pjs[key].active) list += pjTemplateShort(pjs[key], key, true)
      }
      document.querySelector('.js-list').innerHTML = list
      inputListener()

      let archive = document.querySelectorAll('.master-archive-pj')
      for (let a = 0; a < archive.length; a++) {
        archive[a].addEventListener('click', function () {
          let _pj = this.dataset.pj
          firebase.database().ref('/campaigns/' + window.sessionStorage.getItem('campaign') + '/characters/' + _pj).once('value', function (snapshot) {
            let pj = snapshot.val()
            firebase.database().ref('/archive/' + _pj).set(pj)
            firebase.database().ref('/campaigns/' + window.sessionStorage.getItem('campaign') + '/characters/' + _pj).remove()
          })
        })
      }

      let btnActivate = document.querySelectorAll('.js-activate')
      for (let i = 0; i < btnActivate.length; i++) {
        btnActivate[i].addEventListener('click', function () {
          let activate = (this.dataset.activate === 'true')
          firebase.database().ref('/campaigns/' + campaign + '/characters/' + this.dataset.pj).update({active: activate})
        })
      }
    })
  } else {
    firebase.database().ref('/campaigns/' + campaign + '/characters').on('value', function (snapshot) {
      let pjs = snapshot.val()
      let list = ''
      for (const key in pjs) {
        if (pjs[key] && key !== pj && pjs[key].active) list += pjTemplateShort(pjs[key], key, false)
      }
      document.querySelector('.js-list').innerHTML = list
      inputListener()
    })
  }
}

const inputListener = () => {
  const input = document.querySelectorAll('.js-list .pj-input')
  for (let i = 0; i < input.length; i++) {
    input[i].addEventListener('blur', function () {
      let val = (typeof this.value !== 'undefined') ? this.value : this.innerHTML
      let updates = {}
      let campaign = window.sessionStorage.getItem('campaign')
      updates[this.dataset.attribute] = val
      firebase.database().ref('/campaigns/' + campaign + '/characters/' + this.dataset.pj).update(updates)
    })
  }
}

export function command (message, campaign, pj) {
  if (message.search(/^[/]\d*[d]\d+([+-]?\d)?/gmi) === 0) {
    message = message.replace(/[ ]/g, '')
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
    saveChat(message, campaign, pj)
  } else if (pj === 'master') {
    if (message.search(/^[/][a-z0-9-]+[ ][a-z]+[ ][a-z0-9 ]+/) === 0) {
      let msg = message.split('/')[1]
      let com = msg.split(' ')
      let updates = {}
      updates[com[1]] = com[2]
      firebase.database().ref('/campaigns/' + campaign + '/characters/' + com[0]).update(updates)
    }
  }
}

export function swipe (callback) {
  // Inicialize the variables
  let touchStartX = 0
  let touchEndX = 0

  // Find the element if needed
  let zoneTouched = document.querySelectorAll('body')

  // Add the event
  zoneTouched[0].addEventListener('touchstart', function (event) {
  // Change the variables (start)
    touchStartX = event.changedTouches[0].screenX
  })

  zoneTouched[0].addEventListener('touchend', function (event) {
  // Change the needed variables (end)
    touchEndX = event.changedTouches[0].screenX
    // Do the action
    callback(touchStartX, touchEndX)
  })
}

export function loadMenu (menu) {
  document.querySelector('.js-menu').innerHTML = ''
  document.querySelector('.js-breadcrum').innerHTML = ''
  document.querySelector('.js-extra-links').innerHTML = ''
  let link = document.createElement('option')
  link.value = ''
  link.innerHTML = '☰'
  document.querySelector('.js-menu').append(link)

  for (let a = 0; a < menu.length; a++) {
    link = document.createElement('a')
    link.href = menu[a].url
    link.target = (menu[a].url.search(/^(http)/) === 0) ? '_blank' : '_self'
    link.innerHTML = menu[a].name
    document.querySelector(menu[a].position).append(link)

    link = document.createElement('option')
    link.value = menu[a].url
    link.innerHTML = menu[a].name
    document.querySelector('.js-menu').append(link)
  }

  document.querySelector('.js-menu').addEventListener('change', function () {
    if (this.value.search(/^(http)/i) >= 0) { window.open(this.value, '_blank') } else { window.open(this.value, '_self') }
  })
}

export function nameGenerator () {
  const _names = [
    'Lexand Horne',
    'Munder',
    'Harder',
    'Pholes',
    'Thelry',
    'Wilher',
    'Aeweald',
    'Wulfa',
    'Here',
    'Jamart',
    'Raffin',
    'Tondbeorht',
    'Anied',
    'Iged',
    'Yodwin',
    'Eadulf',
    'Helwy',
    'Ralphye Gare',
    'Rewill',
    'Edfrith',
    'Rewill Kesell',
    'Reyny',
    'Wulfa',
    'Goda',
    'Rebert',
    'Robern Vinte',
    'Ryany',
    'Driffolk',
    'Eaddaf',
    'Helmund',
    'Brither',
    'Ether',
    'Mesym Woode',
    'Dere',
    'Walteph Page',
    'Altel',
    'Bertio',
    'Oswulf',
    'Igelm',
    'Nathye',
    'Reder',
    'Monder',
    'Wisym',
    'Lany Caney',
    'Artis',
    'Wine',
    'Werher',
    'Lesym',
    'Cheny Parry',
    'Wulffre'
  ]

  const read = (item) => item[Math.floor(Math.random() * item.length)]

  let _name = read(_names)
  let _surname = read(_names)
  return `${_name} ${_surname}`
}
