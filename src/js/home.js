import page from 'page'

export const home = (ctx) => {
  const _init = (error) => {
    document.querySelector('.js-main').innerHTML = `<div class="loading"><div class="spinner"></div></div>`
    document.querySelector('.js-main').innerHTML = _template()
    if (document.querySelector('.js-list')) document.querySelector('.js-list').innerHTML = ''
    if (document.querySelector('.js-pj')) document.querySelector('.js-pj').innerHTML = ''
    if (typeof error !== 'undefined' && error === 'campaign') {
      document.querySelector('.error').innerHTML = `<h2 class="">La campaña no existe</h2>`
      document.querySelector('.error').classList.remove('hidden')
    }
    document.querySelector('.js-title').innerHTML = 'Aneraio'
    document.querySelector('.home-form-campaign').focus()
    document.querySelector('#app .content-fg2').classList.add('tab--active')
    document.querySelector('.home-form').addEventListener('submit', function (e) {
      e.preventDefault()
      _submit(document.querySelector('.home-form-campaign').value)
    })

    document.querySelector('.js-extra-links').innerHTML = `<a href="https://tomascornelles.com/aneraio" target="_blank">Manual del jugador</a>`
    document.querySelector('.js-menu').innerHTML = ''
    let menu = document.createElement('option')
    menu.value = ''
    menu.innerHTML = '☰'
    document.querySelector('.js-menu').append(menu)
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
    <div class="error card text-center hidden"></div>
    <div class="home-app card text-center">
      <h2>Entra en una campaña</h2>
      <p>
        <form class="home-form container--flex">
          <input type="text" class="input home-form-campaign" autofocus>
          <input type="submit" value="Entrar" class="btn btn--flat">
        </form>
      </p>
    </div>
    <div class="card text-center">
      <h2>Crea una campaña nueva</h2>
      <p class="text-center"><a href="/campaign/new" class="btn btn--principal">Nueva campaña</a></p>
    </div>
    `
  }

  const _submit = (campaign) => {
    if (campaign.trim()) page(`/campaign/${campaign.trim().toLowerCase()}`)
  }

  _init(ctx.params.error)
}
