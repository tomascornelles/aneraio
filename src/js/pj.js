import firebase from 'firebase/app'
import 'firebase/database'
import { dbInit } from './db.js'
import { pjTemplate, pjTemplateShort } from './templates/pj.js'

export const pj = (ctx) => {
  let pj = {}
  let campaign = ctx.params.campaign
  const _init = (campaign, character) => {
    dbInit()
    firebase.database().ref('/campaigns/' + campaign).off()
    firebase.database().ref('/campaigns/' + campaign + '/characters/' + character).on('value', function (snapshot) {
      pj = snapshot.val()
      pj.id = character

      document.querySelector('#app').innerHTML = pjTemplate(campaign, pj, true)

      const input = document.querySelectorAll('.pj-input')

      for (let i = 0; i < input.length; i++) {
        input[i].addEventListener('change', function () {
          _save(this.dataset.attribute, this.value)
        })
      }
    })
    firebase.database().ref('/campaigns/' + campaign + '/characters').on('value', function (snapshot) {
      let pjs = snapshot.val()
      let list = ''
      for (let a = 0; a < pjs.length; a++) {
        if (pjs[a]) list += pjTemplateShort(campaign, pjs[a], false)
      }
      document.querySelector('#app').innerHTML = list
    })
    firebase.database().ref('/campaigns/' + campaign + '/characters/' + character).once('value', function (snapshot) {
      _save('active', true)
      window.sessionStorage.setItem('pj', pj.id)
    })
    window.addEventListener('beforeunload', function () { _save('active', false) })
  }

  const _template = () => {
    return `
    <div class="pj-sheet">
      <h2 class="pj-name">${pj.name}</h2>
      <p><textarea data-attribute="description" class="pj-input">${pj.description}</textarea></p>
      <table>
        <tr>
          <th>Cuerpo</th>
          <th>Mente</th>
          <th>Espíritu</th>
        <tr>
        <tr>
          <td><input type="text" data-attribute="body" class="pj-input" value="${pj.body}" /></td>
          <td><input type="text" data-attribute="mind" class="pj-input" value="${pj.mind}" /></td>
          <td><input type="text" data-attribute="soul" class="pj-input" value="${pj.soul}" /></td>
        <tr>
      </table>
      <p><strong>Estrés</strong>: <input type="text" data-attribute="stress" class="pj-input" value="${pj.stress}" /></p>
      <div class="pj-stress pj-stress-${pj.stress}"></div>
      <p><strong>Rasgos</strong>:<br> <textarea data-attribute="traits" class="pj-input">${pj.traits}</textarea></p>
      <p><strong>Equipo</strong>:<br> <textarea data-attribute="equip" class="pj-input">${pj.equip}</textarea></p>
      <a href="/">Inicio</a>
      <a href="/campaign/${campaign}">Volver a la lista</a>
    </div>
    `
  }

  const _save = (prop, value) => {
    pj[prop] = value
    firebase.database().ref('/campaigns/' + campaign + '/characters/' + pj.id).update(pj)
  }

  _init(campaign, ctx.params.pj)
}
