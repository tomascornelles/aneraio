import page from 'page'

export const home = () => {
  const _init = () => {
    document.querySelector('.js-main').innerHTML = _template()
    document.querySelector('.js-title').innerHTML = 'Aneraio'
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
        <form class="home-form container--flex">
          <input type="text" class="home-form-campaign">
          <input type="submit" value="Entrar" class="btn btn--principal">
        </form>
      </p>
    </div>
    `
  }

  const _submit = (campaign) => {
    if (campaign.trim()) page(`/campaign/${campaign.trim()}`)
  }

  _init()
}
