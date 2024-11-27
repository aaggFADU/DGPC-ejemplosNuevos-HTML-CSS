const toggleButton = document.querySelector('#toggle-btn')
const sidebar = document.querySelector('#sidebar')

function toggleSidebar() {
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')

  closeAllSubMenus()
}

function toggleSubMenu(button) {

  if(!button.nextElementSibling.classList.contains('show')) {
    closeAllSubMenus()
  }

  button.nextElementSibling.classList.toggle('show')
  button.classList.toggle('rotate')

  if(sidebar.classList.contains('close')) {
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
  }
}

function closeAllSubMenus() {
  Array.from(sidebar.querySelectorAll('.show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}