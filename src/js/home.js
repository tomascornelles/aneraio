import page from 'page'
import { $, render } from './utils.js'

export const home = () => {
  const _init = () => {
    $('#app', render, _template())
    document.querySelector('.home-form').addEventListener('submit', function (e) {
      e.preventDefault()
      _submit(document.querySelector('.home-form-campaign').value)
    })
  }

  const _template = () => {
    return `
    <div class="home-app">
      <h2>Entra en una campaña</h2>
      <p>
        <form class="home-form">
          <input type="text" class="home-form-campaign">
          <input type="submit" value="Entrar">
        </form>
      </p>
    </div>
    `
  }

  const _submit = (campaign) => {
    page(`/campaign/${campaign}`)
  }

  _init()
}
