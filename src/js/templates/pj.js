export const pjTemplate = (pj, editable) => {
  let disabled = (!editable)
    ? 'disabled'
    : ''
  return `
    <div class="pj-sheet card">
      <input type="text" class="pj-input input input--wide title" data-attribute="name" value="${pj.name}" ${disabled}/>
      <h3>${pj.class} ${pj.race} nivel <input type="number" class="pj-input input input--mini" data-attribute="level" value="${pj.level}" ${disabled}/></h3>
      <table>
        <tr>
          <th>Cuerpo</th>
          <th>Mente</th>
          <th>Espíritu</th>
          <th>Estrés</th>
        <tr>
        <tr>
          <td><input type="number" class="pj-input input input--mini" data-attribute="body" value="${pj.body}" ${disabled}/></td>
          <td><input type="number" class="pj-input input input--mini" data-attribute="mind" value="${pj.mind}" ${disabled}/></td>
          <td><input type="number" class="pj-input input input--mini" data-attribute="soul" value="${pj.soul}" ${disabled}/></td>
          <td><input type="number" class="pj-input input input--mini" data-attribute="stress" value="${pj.stress}" ${disabled}/></td>
        <tr>
      </table>
      <div class="stress stress--${pj.stress}"></div>
      <p><strong>Equipo</strong></p>
      <textarea class="pj-input input input--wide" data-attribute="equip" ${disabled}>${pj.equip}</textarea>
      <p><strong>Habilidades</strong></p>
      <textarea class="pj-input input input--wide" data-attribute="skills" ${disabled}>${pj.skills}</textarea>
      <p><strong>Descripción</strong></p>
      <textarea class="pj-input input input--wide" data-attribute="description" ${disabled}>${pj.description}</textarea>
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
  general: (message, name) => `<div class="card card--message"><strong>${name}</strong>: ${message}</div>`,
  pj: (message, name) => `<div class="card card--message_pj"><strong>${name}</strong>: ${message}</div>`,
  dm: (message) => `<div class="card card--message_dm">${message}</div>`
}
