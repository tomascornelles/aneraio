export const pjTemplate = (pj, editable) => {
  let contenteditable = (editable)
    ? 'contenteditable'
    : ''
  return `
    <div class="pj-sheet card">
      <h2 class="pj-input" ${contenteditable}>${pj.name}</h2>
      <h3>${pj.class} ${pj.race} nivel <span class="pj-input" data-attribute="level" ${contenteditable}>${pj.level}</span></h3>
      <table>
        <tr>
          <th>Cuerpo</th>
          <th>Mente</th>
          <th>Espíritu</th>
          <th>Estrés</th>
        <tr>
        <tr>
          <td><span class="pj-input" data-attribute="body" ${contenteditable}>${pj.body}</span</td>
          <td><span class="pj-input" data-attribute="mind" ${contenteditable}>${pj.mind}</span></td>
          <td><span class="pj-input" data-attribute="soul" ${contenteditable}>${pj.soul}</span></td>
          <td><span class="pj-input" data-attribute="stress" ${contenteditable}>${pj.stress}</span></td>
        <tr>
      </table>
      <div class="stress stress--${pj.stress}"></div>
      <p><strong>Equipo</strong></p>
      <p class="pj-input" datta-attribute="equip" ${contenteditable}>${pj.equip}</p>
      <p><strong>Habilidades</strong></p>
      <p class="pj-input" datta-attribute="skills" ${contenteditable}>${pj.skills}</p>
      <p><strong>Descripción</strong></p>
      <p class="pj-input" data-attribute="description" ${contenteditable}>${pj.description}</p>
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
      <h3>${pj.class} ${pj.race} nivel <span class="pj-input" data-attribute="level" ${contenteditable}>${pj.level}</span></h3>
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
  general: (message, name) => `<p class="card card--message"><strong>${name}</strong>: ${message}</p>`,
  pj: (message, name) => `<p class="card card--message_pj"><strong>${name}</strong>: ${message}</p>`,
  dm: (message) => `<p class="card card--message_dm">${message}</p>`
}
