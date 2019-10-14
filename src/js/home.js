import page from 'page'

export const home = () => {
  const _init = () => {
    document.querySelector('.js-main').innerHTML = `<div class="loading"><div class="spinner"></div></div>`
    document.querySelector('.js-main').innerHTML = _template()
    document.querySelector('.js-title').innerHTML = 'Aneraio'
    document.querySelector('.home-form-campaign').focus()
    document.querySelector('#app .content-fg2').classList.add('tab--active')
    document.querySelector('.home-form').addEventListener('submit', function (e) {
      e.preventDefault()
      _submit(document.querySelector('.home-form-campaign').value)
    })
    document.querySelector('.js-extra-links').innerHTML = `<a href="https://tomascornelles.com/aneraio" target="_blank">Manual del jugador</a>`
  }

  const _template = () => {
    return `
    <div class="home-app card text-center">
      <h2>Entra en una campaña</h2>
      <p>
        <form class="home-form container--flex">
          <input type="text" class="input home-form-campaign" autofocus>
          <input type="submit" value="Entrar" class="btn btn--flat">
        </form>
      </p>
    </div>
    `
  }

  const _submit = (campaign) => {
    if (campaign.trim()) page(`/campaign/${campaign.trim().toLowerCase()}`)
  }

  _init()
}
