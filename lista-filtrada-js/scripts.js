const filterList = document.querySelector(".filter");
const filterButtons = filterList.querySelectorAll(".filter-btn");
const conferences = document.querySelectorAll(".conference");

let conferenceIndex = 0;

conferences.forEach((conference) => {
  conference.style.viewTransitionName = `conf-${++conferenceIndex}`;
});

filterButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let confCategory = e.target.getAttribute("data-filter");

    /*
    transicion nativa en el navegador
    */

    //si el navegador NO soporta "startViewTransition"
    if (!document.startViewTransition) {
      updateActiveButton(e.target);
      filterEvents(confCategory);
    }
    
    //si el navegador SI lo soporta
    document.startViewTransition(() => {
      updateActiveButton(e.target);
      filterEvents(confCategory);
    });
  });
});

function updateActiveButton(newButton) {
  filterList.querySelector(".active").classList.remove("active");
  newButton.classList.add("active");
}

function filterEvents(filter) {
  conferences.forEach((conference) => {

    // obtiene cada categoría de conferencias
    let eventCategory = conference.getAttribute("data-category");

    // comprueba si esa categoría coincide con el filtro
    if (filter === "all" || filter === eventCategory) {
      conference.removeAttribute("hidden");
    } else {
      conference.setAttribute("hidden", "");
    }
  });
}
