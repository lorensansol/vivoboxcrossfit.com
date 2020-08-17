// CONTROL DE COOKIES
function controlcookies() {
  ;(localStorage.controlcookie = localStorage.controlcookie || 0),
    localStorage.controlcookie++,
    cookiesms.classList.add('ocultar-cookies')
}
localStorage.controlcookie > 0 && cookiesms.classList.add('ocultar-cookies')
