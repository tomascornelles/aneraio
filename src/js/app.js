import page from 'page'
import {home} from './home.js'
import {campaign} from './campaign.js'
import {pj} from './pj.js'
import {notfound} from './notfound.js'

page('/', home)
page('/campaign', notfound)
page('/campaign/:campaign', campaign)
page('/campaign/:campaign/:pj', pj)
page('*', notfound)
page()

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('serviceworker.js')
      .then(swReg => {
        console.log('Service Worker is registered', swReg)
      })
      .catch(err => {
        console.error('Service Worker Error', err)
      })
  })
}
