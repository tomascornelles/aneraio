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
          <td style="text-align: right"><input type="number" class="pj-input input input--mini" data-attribute="stress" value="${pj.stress}" ${disabled}/></td>
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

export const pjTemplateShort = (pj, id, editable) => {
  let contenteditable = (editable)
    ? 'contenteditable'
    : ''
  let pjId = (editable) ? `<sup class="master">${id}</sup>` : ''
  console.log(pj)
  return `
    <div class="pj-sheet card">
      <h2 class="pj-input" data-pj="${pj.id}" data-attribute="name" ${contenteditable}>${pj.name} ${pjId}</h2>
      <h3>${pj.class} ${pj.race} nivel <span class="pj-input" data-pj="${pj.id}" data-attribute="level" ${contenteditable}>${pj.level}</span></h3>
      <table>
        <tr>
          <th>Cuerpo</th>
          <th>Mente</th>
          <th>Espíritu</th>
          <th>Estrés</th>
        <tr>
        <tr>
          <td><span data-pj="${pj.id}" data-attribute="body" class="pj-input" ${contenteditable}>${pj.body}</span</td>
          <td><span data-pj="${pj.id}" data-attribute="mind" class="pj-input" ${contenteditable}>${pj.mind}</span></td>
          <td><span data-pj="${pj.id}" data-attribute="soul" class="pj-input" ${contenteditable}>${pj.soul}</span></td>
          <td><span data-pj="${pj.id}" data-attribute="stress" class="pj-input" ${contenteditable}>${pj.stress}</span>/${10 + parseInt(pj.body) + parseInt(pj.level)}</td>
        <tr>
      </table>
      <div class="stress stress--${Math.round((parseInt(pj.stress) / (10 + parseInt(pj.body) + parseInt(pj.level))) * 10)}"></div>
      <div class="content-hidden">
        <p><strong>Equipo</strong> (Riqueza: ${pj.wealth})</p>
        <div ${contenteditable} data-pj="${pj.id}" data-attribute="equip" class="pj-input">${pj.equip}</div>
        <p><strong>Habilidades</strong></p>
        <div ${contenteditable} data-pj="${pj.id}" data-attribute="skills" class="pj-input">${pj.skills}</div>
        <p><strong>Descripción</strong></p>
        <div ${contenteditable} data-pj="${pj.id}" data-attribute="description" class="pj-input">${pj.description}</div>
      </div>
    </div>
    `
}

export const pjTemplateNew = (pj, editable) => {
  let contenteditable = (editable)
    ? 'contenteditable'
    : ''
  let selectType = '<select class="pj-input input input--wide" data-attribute="type">'
  selectType += (pj.type === 'fighter') ? '<option value="fighter" selected="selected">Luchador</option>' : '<option value="fighter">Luchador</option>'
  selectType += (pj.type === 'mentalist') ? '<option value="mentalist" selected="selected">Mentalista</option>' : '<option value="mentalist">Mentalista</option>'
  selectType += (pj.type === 'rogue') ? '<option value="rogue" selected="selected">Hábil</option>' : '<option value="rogue">Hábil</option>'
  selectType += '</select>'

  let selectSize = '<select class="pj-input input input--wide" data-attribute="size">'
  selectSize += (pj.size === 'small') ? '<option value="small" selected="selected">Pequeño</option>' : '<option value="small">Pequeño</option>'
  selectSize += (pj.size === 'medium') ? '<option value="medium" selected="selected">Mediano</option>' : '<option value="medium">Mediano</option>'
  selectSize += (pj.size === 'large') ? '<option value="large" selected="selected">Grande</option>' : '<option value="large">Grande</option>'
  selectSize += '</select>'
  return `
    <div class="pj-sheet card">
      
      <h2>
        <label for="name">Nombre</label>
        <input type="text" id="name" data-attribute="name" class="pj-input input input--wide" value="${pj.name}" autofocus>
      </h2>
      <h3>
      <div class="row">
          <div class="content-fg1 m--r">
            <label for="class">Clase</label>
            <input type="text" id="class" data-attribute="class" class="pj-input input input--wide" value="${pj.class}">
            <label for="name">Tipo de Clase</label>
            ${selectType}
          </div>
          <div class="content-fg1">
            <label for="race">Raza</label>
            <input type="text" id="race" data-attribute="race" class="pj-input input input--wide" value="${pj.race}">
            <label for="name">Tamaño de Raza</label>
            ${selectSize}
          </div>
        </div>
      </h3>
      <table>
        <tr>
          <th>Cuerpo</th>
          <th>Mente</th>
          <th>Espíritu</th>
        <tr>
        <tr>
          <td>
            <input type="number" id="body" data-attribute="body" class="pj-input input input--wide" value="${pj.body}">
          </td>
          <td>
            <input type="number" id="mind" data-attribute="mind" class="pj-input input input--wide" value="${pj.mind}">
          </td>
          <td>
            <input type="number" id="soul" data-attribute="soul" class="pj-input input input--wide" value="${pj.soul}">
          </td>
        <tr>
        <tr>
          <th style="text-align: left" colspan="2">Estrés máximo: ${10 + parseInt(pj.body) + parseInt(pj.level)}</th>
          <input type="hidden" class="pj-input" data-attribute="stress" value="${10 + parseInt(pj.body) + parseInt(pj.level)}">
        <tr>
      </table>
      <p><strong>Descripción</strong></p>
      <div ${contenteditable} data-attribute="description" class="pj-input">${pj.description}</div>
      <p><strong>Equipo</strong> (Riqueza: ${pj.wealth})</p>
      <div ${contenteditable} data-attribute="equip" class="pj-input">${pj.equip}</div>
      <p><strong>Habilidades</strong></p>
      <div ${contenteditable} data-attribute="skills" class="pj-input">${pj.skills}</div>
    </div>
    <div class="card row">
      <div class="content-fg1 m--r"><a class="btn btn--flat btn--wide js-generate-pj">Generar otro personaje</a></div>
      <div class="content-fg1"><a class="btn btn--principal btn--wide js-save-pj">Crear a ${pj.name}</a></div>
    </div>
    `
}

export const pjMessages = {
  general: (message, name) => `<div class="card card--message"><strong>${name}</strong>: ${message}</div>`,
  pj: (message, name) => `<div class="card card--message_pj"><strong>${name}</strong>: ${message}</div>`,
  log: (message, name) => `<div class="log"><strong>${name}</strong>: ${message}</div>`,
  dm: (message) => `<div class="card card--message_dm">${message}</div>`
}
