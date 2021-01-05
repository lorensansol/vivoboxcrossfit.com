// SCRIPTS FILE LOAD FUNCTION
function loadScript (url, callback) {
  if (!document.getElementById(url)) {
    const s = document.createElement('script')
    s.onload = callback
    s.src = url
    s.id = url
    document.head.appendChild(s)
  }
}
