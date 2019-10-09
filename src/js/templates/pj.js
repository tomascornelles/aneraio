export const pjTemplate = (pj, editable) => {
  let contenteditable = (editable)
    ? 'contenteditable'
    : ''
  return `
    <div class="pj-sheet card">
      <h2 class="pj-input" data-attribute="name" ${contenteditable}>${pj.name}</h2>
      <p class="pj-input" data-attribute="description" ${contenteditable}>${pj.description}</p>
      <table>
        <tr>
          <th>Cuerpo</th>
          <th>Mente</th>
          <th>Espíritu</th>
          <th>Estrés</th>
        <tr>
        <tr>
          <td><span data-attribute="body" class="pj-input" ${contenteditable}>${pj.body}</span</td>
          <td><span data-attribute="mind" class="pj-input" ${contenteditable}>${pj.mind}</span></td>
          <td><span data-attribute="soul" class="pj-input" ${contenteditable}>${pj.soul}</span></td>
          <td><span data-attribute="stress" class="pj-input" ${contenteditable}>${pj.stress}</span></td>
        <tr>
      </table>
      <div class="stress stress--${pj.stress}"></div>
      <p><strong>Rasgos</strong></p>
      <p class="pj-input" datta-attribute="traits" ${contenteditable}>${pj.traits}</p>
      <p><strong>Equipo</strong></p><p class="pj-input" datta-attribute="equip" ${contenteditable}>${pj.equip}</p>
    </div>
    `
}

export const pjTemplateShort = (pj, editable) => {
  let contenteditable = (editable)
    ? 'contenteditable'
    : ''
  return `
    <div class="pj-sheet card">
      <h2 class="pj-input" data-attribute="name" ${contenteditable}>${pj.name}</h2>
      <table>
        <tr>
          <th>Cuerpo</th>
          <th>Mente</th>
          <th>Espíritu</th>
          <th>Estrés</th>
        <tr>
        <tr>
          <td><span data-attribute="body" class="pj-input" ${contenteditable}>${pj.body}</span</td>
          <td><span data-attribute="mind" class="pj-input" ${contenteditable}>${pj.mind}</span></td>
          <td><span data-attribute="soul" class="pj-input" ${contenteditable}>${pj.soul}</span></td>
          <td><span data-attribute="stress" class="pj-input" ${contenteditable}>${pj.stress}</span></td>
        <tr>
      </table>
      <div class="stress stress--${pj.stress}"></div>
    </div>
    `
}

export const pjMessages = {
  general: (message, name) => `<p class="card card--message">${name}: ${message}</p>`,
  pj: (message, name) => `<p class="card card--message_pj">${name}: ${message}</p>`,
  dm: (message) => `<p class="card card--message_dm">${message}</p>`
}
