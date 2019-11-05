export const masterLayout = () => {
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
    <div class="content content-fg1 tab--sheet js-pj">
      <p>
        <a class="btn btn--fab dice d4 js-command" data-command="/d4">d4</a>
        <a class="btn btn--fab dice d6 js-command" data-command="/d6">d6</a>
        <a class="btn btn--fab dice d8 js-command" data-command="/d8">d8</a>
        <a class="btn btn--fab dice d10 js-command" data-command="/d10">d10</a>
        <a class="btn btn--fab dice d12 js-command" data-command="/d12">d12</a>
        <a class="btn btn--fab dice d20 js-command" data-command="/d20">d20</a>
      </p>
      <!--<p><select class="js-master-input input input--wide"> </select></p>
      <p> <a href="/" target="_blank" class="btn btn--wide">Bestiario</a> </p>
      <p> <a href="/" target="_blank" class="btn btn--wide">NPCs</a> </p>-->
      <p> <a class="btn btn--wide js-command" data-command="/2d20">Ventaja</a> </p>
      <h2>Importar PJ</h2>
      <p>
        <form class="master-copy-pj container--flex">
          <input type="text" class="input input--wide master-copy-pj-input" placeholder="campaña/personaje">
          <input type="submit" value="Incorporar PJ" class="btn btn--wide">
        </form>
      </p>
      <div class="master-copy-pj-error"></div>
      <h2>Time tracker</h2>
      <div class="container--flex">
        <div class="content-fg1"><button class="btn btn--wide js-timetracker-minus" data-time="-1">-</button></div>
        <div class="content-fg1"><span class="js-timetracker">0</span></div>
        <div class="content-fg1"><button class="btn btn--wide js-timetracker-plus" data-time="+1">+</button></div>
      </div>
      <h2>Crear ciudad</h2>
      <div class="container--flex">
        <div class="content-fg1"><button class="btn btn--wide btn--toggle js-city" data-citycitadel="0">Castillo</button></div>
        <div class="content-fg1"><button class="btn btn--wide btn--toggle js-city" data-cityriver="0">Rio</button></div>
        <div class="content-fg1"><button class="btn btn--wide btn--toggle js-city" data-citycoast="0">Costa</button></div>
      </div>
      <div class="container--flex">
        <div class="content-fg1"><button class="btn btn--wide btn--toggle js-city" data-citysize="8">Pequeña</button></div>
        <div class="content-fg1"><button class="btn btn--wide btn--toggle active js-city" data-citysize="20">Mediana</button></div>
        <div class="content-fg1"><button class="btn btn--wide btn--toggle js-city" data-citysize="50">Grande</button></div>
      </div>
      <div class="container--flex">
        <div class="content-fg1"><a href="" target="_blank" class="btn btn--wide btn--principal js-city-link" data-time="-1">Crear ciudad</a></div>
      </div>
      <h2>Generar nombre</h2>
      <div class="">
        <button class="btn btn--wide btn--toggle js-name-generator">Generar nombre</button>
        <p class="js-name-generated name-generated"></p>
      </div>
    </div>
    <nav class="tabs row">
      <button class="btn btn--flat content-fg1 js-tab js-tab-list" data-tab="list">Lista</button>
      <button class="btn btn--flat content-fg1 js-tab js-tab-chat button--active" data-tab="chat">Chat</button>
      <button class="btn btn--flat content-fg1 js-tab js-tab-sheet" data-tab="sheet">Tools</button>
    </nav>
    </section>
    `
}
