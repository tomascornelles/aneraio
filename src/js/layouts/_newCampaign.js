export const newCampaignLayout = () => {
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
        <p>
          <form class="campaign-form" autocomplete="off">
            <label for="name">Contraseña para el narrador</label>
            <input type="password" id="pass" class="input input--wide input--top" autofocus>
            <input type="password" id="pass2" class="input input--wide input--bottom" placeholder="repite la contraseña">
            <label for="name">Título de la campaña</label>
            <input type="text" id="name" class="input input--wide">
            <label for="name">Descripción</label>
            <textarea id="description" class="input input--wide" ></textarea>
            <input type="submit" value="Crear" class="btn btn--principal">
          </form>
        </p>
      </div>
    </article>
  </div>
  <div class="content content-fg1"></div>
  </section>
  `
}
