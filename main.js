
// Aca lo que hago es obtener referencias a elementos HTML por su ID y almacenarlos en variables.
const container = document.getElementById("container");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnFiltrar = document.getElementById("btnFiltrar");
const filtroMenu = document.getElementById("filtro-menu");
const aplicarFiltroBtn = document.getElementById("aplicar-filtro");

//Variables para controlar la paginación y los filtros:
let currentPage = 1; // Página actual
let originalData; // Variable para almacenar la información original
let currentFilters = {}; // Filtros actuales

// La función obtenerInfoCards se encarga de obtener datos de la API con la página y filtros proporcionados

const obtenerInfoCards = (page, filters = {}) => {
  const queryParams = new URLSearchParams(filters); // Crea una instancia de URLSearchParams para construir la URL con los filtros.
  queryParams.append("page", page); // Agrega el número de página a los parámetros de la URL.

  fetch(`https://rickandmortyapi.com/api/character/?${queryParams.toString()}`)
    .then((res) => res.json())
    .then((data) => {
      originalData = data; // Almacenar la información original
      renderMortyCards(data);
      
      // Verifico si estoy en la última página y deshabilito el botón "Siguiente"
      if (page >= data.info.pages) {
        btnNext.disabled = true; // Deshabilita el botón "Siguiente"
      } else {
        btnNext.disabled = false; // Habilita el botón "Siguiente"
      }

      if (page <= 1) {
        btnPrev.disabled = true; // Deshabilitar el botón "Anterior"
      } else {
        btnPrev.disabled = false; // Habilitar el botón "Anterior"
      }
    });
};

// Llama a la función obtenerInfoCards con la página actual al cargar la página.
obtenerInfoCards(currentPage);


// La función renderMortyCards toma los datos de las tarjetas y las muestra en el contenedor.

const renderMortyCards = (cardsData) => {
  let mortyArray = cardsData.results;
  container.innerHTML = ""; // Limpia el contenido del contenedor.
  mortyArray.forEach((morty) => {
    container.innerHTML += `
        <div class="morty-card">
            <img src="${morty.image}" alt="imagen de personaje">
            <h2>${morty.name}</h2>
            <button onclick="viewMortyDetail('${morty.url}')">Ver Detalles</button>
        </div>`;
  });
};

//La función viewMortyDetail muestra los detalles de un personaje cuando se hace clic en el botón "Ver Detalles".
const viewMortyDetail = (mortyUrl) => {
  fetch(mortyUrl)
    .then((res) => res.json())
    .then((data) => {
      container.innerHTML = `
            <div class="card-detail">
                <img src="${data.image}" alt="">
                <h2>${data.name}</h2>
                <p>Genero: ${data.gender}</p>
                <p>Origen: ${data.origin.name}</p>
                <p>Locación: ${data.location.name}</p>
                <p>Estado: ${data.status}</p>
                <button onclick="restoreInfo()">Regresar</button>
            </div>`;
    });
};

// La función restoreInfo restaura la información original en el contenedor.
const restoreInfo = () => {
   renderMortyCards(originalData);
};
// Agrega event listeners a los botones "Anterior" y "Siguiente" para la paginación. Cuando se hace clic en el botón "Anterior", se disminuye el valor de currentPage en 1 y se llama a la función obtenerInfoCards. Pasa lo mismo con el boton siguiente.
btnPrev.addEventListener("click", () => {
  currentPage -= 1;
  obtenerInfoCards(currentPage, currentFilters);
});

btnNext.addEventListener("click", () => {
  currentPage += 1;
  obtenerInfoCards(currentPage, currentFilters);
});

// Evento de clic al botón "Filtrar" para mostrar/ocultar el menú
//toggle para agregar una clase a un elemento si no está presente, y eliminarla si ya está presente. 
btnFiltrar.addEventListener("click", () => {
  btnFiltrar.classList.toggle("mostrar-filtro");
  btnFiltrar.classList.toggle("ocultar-filtro");

  if (filtroMenu.style.display === "block") {
    filtroMenu.style.display = "none"; // Oculta el menú si ya está visible
  } else {
    filtroMenu.style.display = "block"; // Muestra el menú si está oculto
  }
});

// Evento de clic al botón "Aplicar Filtro"
aplicarFiltroBtn.addEventListener("click", () => {
  const opcionesFiltro = document.querySelectorAll(".menu input[type='checkbox']");

  // Reiniciar los filtros actuales
  currentFilters = {};

  opcionesFiltro.forEach((opcion) => {
    if (opcion.checked) {
      switch (opcion.id) {
        case "filtro-mujer":
          currentFilters["gender"] = "female";
          break;
        case "filtro-vivo":
          currentFilters["status"] = "alive";
          break;
        case "filtro-hombre":
          currentFilters["gender"] = "male";
          break;
        case "filtro-muerto":
          currentFilters["status"] = "dead";
          break;
        case "filtro-desconocido":
          currentFilters["gender"] = "unknown";
          break;
      }
    }
  });

  // Aplicar los filtros y cargar la primera página
  currentPage = 1;
  obtenerInfoCards(currentPage, currentFilters);
});

//cosas que no me tengo que olvidar: para que la paginacion funcione con los filtros se hace un nuevo llamado a la api y se renderiza de nuevo.Para eso hay que crear una funcion que busque los datos de la api con los filtros aplicados.