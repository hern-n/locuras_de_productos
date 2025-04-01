import { loadProducts, getNameProducts, findSimilarItems, loadSearchedProducts } from "./functions.js";

// Variables globales
let search_result = [];
let exported_names = "";

// Esperar a que el DOM cargue completamente
document.addEventListener("DOMContentLoaded", () => {
    initialScreen();
});

async function initialScreen() {
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

    //Testo de productos aleatorios
    const textRandomProducts = document.createElement("h2");
    textRandomProducts.textContent = "Tu selección de productos de hoy:";
    textRandomProducts.className = "text-random";

    document.body.appendChild(textRandomProducts);

    // Cargar productos
    await loadProducts();

    //Crear la parte final
    document.body.appendChild(createLicensePart());
}

async function searchScreen() {
    // Limpiar el DOM
    document.body.innerHTML = "";

    // Título del documento
    document.title = "Buscador de Productos";

    // Barra de tareas (incluye logo, barra de búsqueda y botón de ayuda)
    document.body.appendChild(createTaskBar());

    // Mostrar resultados
    const imageContainer = document.createElement("div");
    imageContainer.className = "search-image-container";

    const maintenanceText = document.createElement("h1");
    maintenanceText.textContent = search_result.length > 0 
        ? `Resultados de búsqueda para "${exported_names}":`
        : `Ups, no hemos encontrado nada para "${exported_names}". Busca algo parecido, o pulsa "¿necesitas ayuda?" ↗ para que te podamos ayudar.`;
        maintenanceText.className = "title-notFoundProducts";

    const SearchImage = document.createElement("img");
    SearchImage.src = "/elements/busqueda.png";
    SearchImage.className = "not-search-image";

    imageContainer.appendChild(maintenanceText);
    if (search_result.length == 0 ) {
        imageContainer.appendChild(SearchImage);
    };
    document.body.appendChild(imageContainer);

    if (search_result.length > 0) {
        await loadSearchedProducts(search_result);
    }

    document.body.appendChild(createSpaceLicense());
    document.body.appendChild(createLicensePart());
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

//Para todo lo que hay debajo de las páginas (derechos, licencias, etc)
function createLicensePart() {
    const mainDiv = document.createElement("div");
    mainDiv.className = "license-div";

    const space = document.createElement("div");
    space.className = "invisible-div";

    const text1 = document.createElement("h5");
    text1.textContent = "Esta página petenece al programa de Ámazon afiliados, y todos los productos han sido encontrados en Ámazon.";
    text1.className = "text-license";

    const text2 = document.createElement("h5");
    const url = "https://afiliados.amazon.es/";
    text2.innerHTML = `Para más información visita la pagina de <a href="${url}" target="_blank" class="text-link">Ámazon afiliados.</a>`;
    text2.className = "text-license";

    const image = document.createElement("img");
    image.src = "./elements/Logotipo_locuras_de_productos_blanco.png"
    image.className = "image-license";

    mainDiv.appendChild(space);
    mainDiv.appendChild(text1);
    mainDiv.appendChild(text2);
    mainDiv.appendChild(image);
    return mainDiv;
}

function createSpaceLicense() {
    const space = document.createElement("div");
    space.className = "space-license";
    return space;
}

function addHoverEffect(element) {
    element.addEventListener("mouseover", () => {
        element.classList.add("hover");
    });
    element.addEventListener("mouseout", () => {
        element.classList.remove("hover");
    });
}