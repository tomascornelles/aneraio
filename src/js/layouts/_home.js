
export const homeLayout = () => {
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
          <div class="content content-fg1"> </div>
          <div class="content content-fg2"> </div>
          <div class="content content-fg1 text-right js-extra-links"> </div>
        </div>
      </nav>
    </header>
    <section class="row">
      <div class="content content-fg1"></div>
      <div class="content content-fg2 tab--active">
        <article class="js-main">
        <div class="error card text-center hidden"></div>
        <div class="home-app card text-center">
          <h2>Entra en una campaña</h2>
          <p>
            <form class="home-form container--flex">
              <input type="text" class="input input--wide home-form-campaign" autofocus>
              <input type="submit" value="Entrar" class="btn btn--flat">
            </form>
          </p>
        </div>
        <div class="card text-center">
          <h2>Crea una campaña nueva</h2>
          <p class="text-center"><a href="/campaign/new" class="btn btn--principal">Nueva campaña</a></p>
        </div>
        </article>
      </div>
      <div class="content content-fg1"></div>
    </section>
    `
}
