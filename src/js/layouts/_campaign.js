export const campaignLayout = (campaign) => {
  let list = ''
  const _pjList = () => {
    let list = ''
    if (typeof campaign.characters !== 'undefined') {
      for (const key in campaign.characters) {
        if (campaign.characters.hasOwnProperty(key)) {
          const character = campaign.characters[key]
          list += (character)
            ? (!character.active)
              ? `<p><a href="/campaign/${campaign.id}/${key}" class="btn btn--wide btn--principal"><strong>${character.name}</strong> (<em>${character.class} ${character.race} nivel ${character.level}</em>)</a></p>`
              : `<p><a class="btn btn--wide btn--disabled"><strong>${character.name}</strong> (<em>${character.class} ${character.race} nivel ${character.level}</em>)</a></p>`
            : ''
        }
      }
    }

    return list
  }

  if (typeof campaign.characters !== 'undefined') {
    list = `<div class="campaign card">
      <h2>Escoge un personaje</h2>
      <div class="campaign-pjs">${_pjList()}</div>
    </div>`
  }

  return `
  <header class="row vertical">
    <div class="content">
      <select class="mobile js-menu input">
      </select>
      <h1 class="js-title"></h1>
    </div>
    <nav>
      <div class="bg-image"></div>
      <div class="row">
        <div class="content content-fg1 js-breadcrum"> </div>
        <div class="content content-fg2"> </div>
        <div class="content content-fg1 text-right js-extra-links"> </div>
      </div>
    </nav>
  </header>
  <section class="row">
    <div class="content content-fg1"></div>
      <div class="content content-fg2 tab--chat tab--active">
        <article class="js-main">
          <div class="campaign card">
            <p>${campaign.description}</p>
          </div>
          ${list}
          <div class="campaign card">
            <h2>Crea un nuevo personaje para "${campaign.name}"</h2>
            <p class="text-center"><a href="/campaign/${campaign.id}/new" class="btn btn--principal">Nuevo personaje</a></p>
          </div>
          <div class="campaign card">
            <h2>Entra como "Master"</h2>
            <form class="master-form container--flex">
              <input type="password" class="input master-form-pass" autofocus>
              <input type="submit" value="Entrar" class="btn btn--flat">
            </form>
          </div>
          
        </article>
      </div>
    <div class="content content-fg1"></div>
  </section>
  `
}
