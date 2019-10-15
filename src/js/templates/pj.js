export const pjTemplate = (pj, editable) => {
  let disabled = (!editable)
    ? 'disabled'
    : ''
  let contenteditable = (editable)
    ? 'contenteditable'
    : ''
  return `
    <div class="pj-sheet card">
      <h2>${pj.name}</h2>
      <h3>${pj.class} ${pj.race} nivel ${pj.level}</h3>
      <table>
        <tr>
          <th>Cuerpo</th>
          <th>Mente</th>
          <th>Espíritu</th>
        <tr>
        <tr>
          <td><span class="stat">${pj.body}</span></td>
          <td><span class="stat">${pj.mind}</span></td>
          <td><span class="stat">${pj.soul}</span></td>
        <tr>
        <tr>
          <th style="text-align: left" colspan="2">Estrés (max: ${10 + parseInt(pj.body) + parseInt(pj.level)})</th>
          <td style="text-align: right"><input type="number" class="pj-input input--mini" data-attribute="stress" value="${pj.stress}" ${disabled}/></td>
        <tr>
      </table>
      <div class="stress stress--${Math.round((parseInt(pj.stress) / (10 + parseInt(pj.body) + parseInt(pj.level))) * 10)}"></div>
      <p><strong>Equipo</strong> (Riqueza: ${pj.wealth})</p>
      <div ${contenteditable} data-attribute="equip" class="pj-input">${pj.equip}</div>
      <p><strong>Habilidades</strong></p>
      <div ${contenteditable} data-attribute="skills" class="pj-input">${pj.skills}</div>
      <p><strong>Descripción</strong></p>
      <div ${contenteditable} data-attribute="description" class="pj-input">${pj.description}</div>
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
      <div class="stress stress--${Math.round((parseInt(pj.stress) / (10 + parseInt(pj.body) + parseInt(pj.level))) * 10)}"></div>
    </div>
    `
}

export const pjMessages = {
  general: (message, name) => `<div class="card card--message"><strong>${name}</strong>: ${message}</div>`,
  pj: (message, name) => `<div class="card card--message_pj"><strong>${name}</strong>: ${message}</div>`,
  dm: (message) => `<div class="card card--message_dm">${message}</div>`
}
