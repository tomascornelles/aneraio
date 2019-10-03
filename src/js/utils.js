export function $ (selector, callback, parameters) {
  document.querySelectorAll(selector).forEach(function (element) {
    callback(element, parameters)
  })
}

export function render (element, text) {
  element.innerHTML = text
}
