import firebase from 'firebase/app'
import 'firebase/database'
import { pjTemplateShort, pjMessages } from './templates/pj.js'

export function chat (campaign, pj) {
  let input = `
      <article>
        <form>
          <input type="text" class="input input--wide js-chat-message" autofocus placeholder="Escribe aquí (/3d6+1 p.e. para lanzar dados)">
          <input type="submit" value="📧" class="btn btn--flat btn--input">

          <!--<a class="btn btn--fab dice d4 js-command" data-command="/d4">d4</a>
          <a class="btn btn--fab dice d6 js-command" data-command="/d6">d6</a>
          <a class="btn btn--fab dice d8 js-command" data-command="/d8">d8</a>
          <a class="btn btn--fab dice d10 js-command" data-command="/d10">d10</a>
          <a class="btn btn--fab dice d12 js-command" data-command="/d12">d12</a>-->
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
            : (message.id === pj.id)
              ? pjMessages.pj(message.message, message.name)
              : pjMessages.general(message.message, message.name)
          wall = msg + wall
        }
      }
    }
    document.querySelector('.js-main').innerHTML = wall

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
    name: pj.name,
    id: pj.id
  })
}

export function pjList (campaign, pj) {
  firebase.database().ref('/campaigns/' + campaign + '/characters').on('value', function (snapshot) {
    let pjs = snapshot.val()
    let list = ''
    for (let a = 0; a < pjs.length; a++) {
      if (pjs[a] && parseInt(a) !== parseInt(pj) && pjs[a].active) list += pjTemplateShort(pjs[a], false)
    }
    document.querySelector('.js-list').innerHTML = list
  })
}

export function command (message, campaign, pj) {
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
    saveChat(message, campaign, pj)
  }
}

export function swipe (callback) {
  // Inicialize the variables
  let touchStartX = 0
  let touchEndX = 0

  // Find the element if needed
  let zoneTouched = document.querySelectorAll('body')

  // CAUTION HERE
  // CAUTION HERE READ MORE
  // CAUTION HERE

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
