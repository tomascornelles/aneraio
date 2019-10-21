import {homeLayout} from './layouts/_home.js'
import {loadMenu} from './utils.js'

export const home = (ctx) => {
  const _init = (error) => {
    document.querySelector('#app').innerHTML = homeLayout()
    document.querySelector('.js-title').innerHTML = 'Aneraio'

    let menu = []
    menu.push({
      name: 'Manual del jugador',
      url: 'https://tomascornelles.com/aneraio',
      position: '.js-extra-links'
    })

    loadMenu(menu)

    if (typeof error !== 'undefined' && error === 'campaign') {
      document.querySelector('.error').innerHTML = `<h2 class="">La campaña no existe</h2>`
      document.querySelector('.error').classList.remove('hidden')
    }

    document.querySelector('.home-form-campaign').focus()
    document.querySelector('.home-form').addEventListener('submit', _submit)
  }

  const _submit = (e) => {
    e.preventDefault()
    let campaign = document.querySelector('.home-form-campaign').value.trim()
    if (campaign) window.open(`/campaign/${campaign.toLowerCase()}`, '_self')
  }

  _init(ctx.params.error)
}
