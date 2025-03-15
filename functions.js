// Cargar y mostrar todos los productos
export function loadProducts() {
    const productGrid = document.createElement("div");
    productGrid.className = "product-grid";

    fetch("./elements/products.csv")
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar el archivo CSV");
            return response.text();
        })
        .then(csvText => {
            const rows = csvText.trim().split("\n");

            if (rows.length <= 1) {
                throw new Error("El archivo CSV no contiene datos.");
            }

            rows.slice(1).forEach(row => {
                const [title, href, price, description, imgPrincp] = parseCSVRow(row);

                if (title && href && imgPrincp && price) {
                    const productItem = createProductElement(title, href, imgPrincp, price);
                    productGrid.appendChild(productItem);
                }
            });

            // Agregar un mensaje de "Pronto habrá más"
            const finalItem = createFinalItem("¡Pronto habrá más!");
            productGrid.appendChild(finalItem);

            document.body.appendChild(productGrid);
        })
        .catch(error => console.error("Error loading CSV:", error));
}

// Obtener todos los nombres de productos
export async function getNameProducts() {
    try {
        const response = await fetch("./elements/products.csv");
        if (!response.ok) throw new Error("Error al cargar el archivo CSV");
        const csvText = await response.text();

        const rows = csvText.trim().split("\n");
        return rows.slice(1).map(row => parseCSVRow(row)[0]); // Extraer solo el título
    } catch (error) {
        console.error("Error al obtener nombres de productos:", error);
        return [];
    }
}

// Buscar elementos similares en un array
export function findSimilarItems(array, searchTerm) {
    // Normaliza el término de búsqueda eliminando acentos y convierte a minúsculas
    const normalizeString = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Normalizar y dividir el searchTerm en palabras
    const searchTerms = normalizeString(searchTerm).split(" ");

    return array.filter(item => {
        // Normalizar el item y comprobar si todas las palabras del searchTerm están presentes
        const itemNormalized = normalizeString(item);
        return searchTerms.every(term => itemNormalized.includes(term));
    });
}



// Cargar y mostrar los productos buscados
export async function loadSearchedProducts(array_products) {
    const searchGrid = document.createElement("div");
    searchGrid.className = "search-grid"; // Usar la nueva clase para esta página

    try {
        const response = await fetch("./elements/products.csv");
        if (!response.ok) throw new Error("Error al cargar el archivo CSV");
        const csvText = await response.text();

        const rows = csvText.trim().split("\n");
        rows.slice(1).forEach(row => {
            const [title, href, price, description, imgPrincp] = row.split(";");

            if (array_products.includes(title)) {
                // Crear el contenedor principal
                const searchItem = document.createElement("a");
                searchItem.className = "search-item";
                searchItem.onclick = () => {
                    window.location.href = `./elements/productTemplate/index.html?name=${encodeURIComponent(title)}`;
                };

                // Crear la imagen
                const searchImage = document.createElement("img");
                searchImage.src = imgPrincp;
                searchImage.alt = title;
                searchImage.className = "search-image";

                // Crear el contenedor del texto
                const searchContent = document.createElement("div");
                searchContent.className = "search-content";

                const searchTitle = document.createElement("h3");
                searchTitle.textContent = title;
                searchTitle.className = "search-title";

                const searchPrice = document.createElement("p");
                searchPrice.textContent = price;
                searchPrice.className = "search-price";

                // Agregar título y precio al contenedor de texto
                searchContent.appendChild(searchTitle);
                searchContent.appendChild(searchPrice);

                // Agregar imagen y contenido al elemento principal
                searchItem.appendChild(searchImage);
                searchItem.appendChild(searchContent);

                // Agregar el producto al grid
                searchGrid.appendChild(searchItem);
            }
        });

        document.body.appendChild(searchGrid);
    } catch (error) {
        console.error("Error al cargar productos buscados:", error);
    }
}


// Función auxiliar para dividir filas del CSV
function parseCSVRow(row) {
    return row.split(";").map(col => col.trim());
}

// Crear un elemento de producto
function createProductElement(title, href, imgPrincp, price) {
    const productItem = document.createElement("div");
    productItem.className = "product-item";
    productItem.onclick = () => {
        window.location.href = `./elements/productTemplate/index.html?name=${encodeURIComponent(title)}`;
    };
    

    const productImage = document.createElement("img");
    productImage.src = imgPrincp;
    productImage.alt = title;
    productImage.className = "product-image";

    const productTitle = document.createElement("h3");
    productTitle.textContent = title;
    productTitle.className = "product-title";

    const productPrice = document.createElement("p");
    productPrice.textContent = price;
    productPrice.className = "product-price";

    productItem.appendChild(productImage);
    productItem.appendChild(productTitle);
    productItem.appendChild(productPrice);

    return productItem;
}


// Crear un elemento final de mensaje
function createFinalItem(message) {
    const finalItem = document.createElement("a");
    finalItem.className = "product-item";

    const finalTitle = document.createElement("h3");
    finalTitle.textContent = message;
    finalTitle.className = "product-title";

    finalItem.appendChild(finalTitle);
    return finalItem;
}
