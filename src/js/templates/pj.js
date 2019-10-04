export const pjTemplate = (campaign, pj, editable) => {
  let disabled = (editable)
    ? ''
    : 'disabled'
  return `
    <div class="pj-sheet">
      <h2 class="pj-name">${pj.name}</h2>
      <p><textarea data-attribute="description" class="pj-input" ${disabled}>${pj.description}</textarea></p>
      <table>
        <tr>
          <th>Cuerpo</th>
          <th>Mente</th>
          <th>Espíritu</th>
        <tr>
        <tr>
          <td><input type="text" data-attribute="body" class="pj-input" value="${pj.body}"  ${disabled}/></td>
          <td><input type="text" data-attribute="mind" class="pj-input" value="${pj.mind}"  ${disabled}/></td>
          <td><input type="text" data-attribute="soul" class="pj-input" value="${pj.soul}"  ${disabled}/></td>
        <tr>
      </table>
      <p><strong>Estrés</strong>: <input type="text" data-attribute="stress" class="pj-input" value="${pj.stress}"  ${disabled}/></p>
      <div class="pj-stress pj-stress-${pj.stress}"></div>
      <p><strong>Rasgos</strong>:<br> <textarea data-attribute="traits" class="pj-input" ${disabled}>${pj.traits}</textarea></p>
      <p><strong>Equipo</strong>:<br> <textarea data-attribute="equip" class="pj-input" ${disabled}>${pj.equip}</textarea></p>
      <a href="/">Inicio</a>
      <a href="/campaign/${campaign}">Volver a la lista</a>
    </div>
    `
}

export const pjTemplateShort = (campaign, pj, editable) => {
  let disabled = (editable)
    ? ''
    : 'disabled'
  return `
    <div class="pj-sheet">
      <h2 class="pj-name">${pj.name}</h2>
      <div class="pj-stress pj-stress-${pj.stress}"></div>
      <p><textarea data-attribute="description" class="pj-input" ${disabled}>${pj.description}</textarea></p>
      <table>
        <tr>
          <th>Cuerpo</th>
          <th>Mente</th>
          <th>Espíritu</th>
        <tr>
        <tr>
          <td><input type="text" data-attribute="body" class="pj-input" value="${pj.body}"  ${disabled}/></td>
          <td><input type="text" data-attribute="mind" class="pj-input" value="${pj.mind}"  ${disabled}/></td>
          <td><input type="text" data-attribute="soul" class="pj-input" value="${pj.soul}"  ${disabled}/></td>
        <tr>
      </table>
    </div>
    `
}
