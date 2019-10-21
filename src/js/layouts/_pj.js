export const pjLayout = () => {
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
          <div class="content content-fg2 js-chat-input">
          <article>
            <form>
              <input type="text" class="input input--wide js-chat-message" autofocus="" placeholder="Escribe aquí (/3d6+1 p.e. para lanzar dados)">
              <input type="submit" value="📧" class="btn btn--flat btn--input">
              <a class="btn btn--fab dice d20 js-command" data-command="/d20">d20</a>
            </form>
          </article>
          </div>
          <div class="content content-fg1 js-extra-links text-right"> </div>
        </div>
      </nav>
    </header>
    <section class="row">
      <div class="content content-fg1 tab--list js-list"></div>
      <div class="content content-fg2 tab--chat tab--active">
        <article class="js-main chat"></article>
      </div>
      <div class="content content-fg1 tab--sheet js-pj"></div>
      <nav class="tabs row">
        <button class="btn btn--flat content-fg1 js-tab js-tab-list" data-tab="list">Lista</button>
        <button class="btn btn--flat content-fg1 js-tab js-tab-chat button--active" data-tab="chat">Chat</button>
        <button class="btn btn--flat content-fg1 js-tab js-tab-sheet" data-tab="sheet">Ficha</button>
      </nav>
    </section>
    `
}
