export const newPjLayout = () => {
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
          <div class="content content-fg2 js-chat-input"> </div>
          <div class="content content-fg1 js-extra-links text-right"> </div>
        </div>
      </nav>
    </header>
    <section class="row">
      <div class="content content-fg1"></div>
      <div class="content content-fg2 tab--active">
        <article class="js-main">
        </article>
      </div>
      <div class="content content-fg1"></div>
    </section>
    `
}
