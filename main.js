import { loadProducts, getNameProducts, findSimilarItems, loadSearchedProducts } from "./functions.js";

// Variables globales
let search_result = [];
let exported_names = "";

// Esperar a que el DOM cargue completamente
document.addEventListener("DOMContentLoaded", () => {
    initialScreen();
});

function initialScreen() {
    // Limpiar el DOM
    document.body.innerHTML = "";

    // Título del documento
    document.title = "Locuras de Productos";

    // Barra de tareas (incluye logo, barra de búsqueda y botón de ayuda)
    document.body.appendChild(createTaskBar());

    // Contenedor de imagen principal
    document.body.appendChild(createImageContainer());

    // Título principal
    document.body.appendChild(createTitleContainer());

    // Cargar productos
    loadProducts();
}

function searchScreen() {
    // Limpiar el DOM
    document.body.innerHTML = "";

    // Título del documento
    document.title = "Buscador de Productos";

    // Barra de tareas (incluye logo, barra de búsqueda y botón de ayuda)
    document.body.appendChild(createTaskBar());

    // Mostrar resultados
    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    const maintenanceText = document.createElement("h1");
    maintenanceText.textContent = search_result.length > 0 
        ? `Resultados de búsqueda para "${exported_names}"`
        : `No se han encontrado resultados para "${exported_names}"`;

    maintenanceText.className = "sub-title";
    imageContainer.appendChild(maintenanceText);
    document.body.appendChild(imageContainer);

    if (search_result.length > 0) {
        loadSearchedProducts(search_result);
    }
}

// Función para crear la barra de tareas (logo, barra de búsqueda y botón de ayuda)
function createTaskBar() {
    const optionsBar = document.createElement("div");
    optionsBar.className = "options-bar";

    // Logo (botón para volver a la pantalla inicial)
    const logoButton = document.createElement("img");
    logoButton.src = "./elements/Logotipo_locuras_de_productos_blanco.png";
    logoButton.alt = "Logotipo Locuras de Productos";
    logoButton.className = "logo-button";
    addHoverEffect(logoButton);
    logoButton.addEventListener("click", () => initialScreen());
    optionsBar.appendChild(logoButton);

    // Agregar la barra de búsqueda
    optionsBar.appendChild(createSearchBar());

    // Botón de ayuda
    const helpButton = document.createElement("a");
    helpButton.href = "./elements/ayuda/index.html";
    helpButton.className = "help-button";
    helpButton.textContent = "¿Necesitas\n ayuda?";
    addHoverEffect(helpButton);
    optionsBar.appendChild(helpButton);

    return optionsBar;
}

// Función para crear la barra de búsqueda
function createSearchBar() {
    const searchBar = document.createElement("form");
    searchBar.className = "search-bar";

    searchBar.onsubmit = function (event) {
        event.preventDefault();
    };

    const input = document.createElement("input");
    input.type = "text";
    input.id = "searchInput";
    input.name = "searchInput";
    input.required = true;
    input.placeholder = "¿Qué quieres empezar a buscar?";

    input.addEventListener("keydown", async function (event) {
        if (event.key === "Enter") {
            event.preventDefault();

            const names = await getNameProducts();
            search_result = findSimilarItems(names, input.value);
            exported_names = input.value;

            searchScreen();
        }
    });

    searchBar.appendChild(input);
    return searchBar;
}

// Funciones auxiliares
function createImageContainer() {
    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    const logoImage = document.createElement("img");
    logoImage.src = "./elements/Logotipo_locuras_de_productos.png";
    logoImage.alt = "Logotipo Locuras de Productos";
    logoImage.className = "logo-image";
    addHoverEffect(logoImage);

    imageContainer.appendChild(logoImage);
    return imageContainer;
}

function createTitleContainer() {
    const titleContainer = document.createElement("div");
    titleContainer.className = "title-container";

    const mainTitle = document.createElement("h1");
    mainTitle.textContent = "Locuras de productos";
    mainTitle.className = "main-title";
    addHoverEffect(mainTitle);

    const subTitle = document.createElement("h2");
    subTitle.textContent = "¿Qué vas a comprar hoy?";
    subTitle.className = "sub-title";

    titleContainer.appendChild(mainTitle);
    titleContainer.appendChild(subTitle);
    return titleContainer;
}

function addHoverEffect(element) {
    element.addEventListener("mouseover", () => {
        element.classList.add("hover");
    });
    element.addEventListener("mouseout", () => {
        element.classList.remove("hover");
    });
}