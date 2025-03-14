async function getProductDetails(productTitle) {
    // Cargar el archivo CSV con fetch
    return fetch("../products.csv")
        .then(response => response.text())
        .then(csvData => {
            const lines = csvData.split("\n");
            const headers = lines[0].split(";");
            const products = [];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(";");
                if (values.length < 4) continue; // Evitar líneas incompletas

                let product = {};
                headers.forEach((header, index) => {
                    if (values[index]) product[header] = values[index].trim();
                });

                // Manejar imágenes (eliminar campos vacíos)
                product.images = [];
                for (let j = 4; j < headers.length; j++) {
                    if (values[j]) product.images.push(values[j].replace(/\\/g, "/")); // Unificar barras
                }

                products.push(product);
            }

            // Buscar el producto por nombre
            return products.find(p => p.title === productTitle) || null;
        })
        .catch(error => {
            console.error("Error al cargar el CSV:", error);
            return null;
        });
}

function generateProductTemplate(product) {
    if (!product) return;

    // Crear la barra de tareas
    document.body.appendChild(createTaskBar());

    // Crear el contenedor de imágenes del producto
    const productImages = document.createElement('div');
    productImages.classList.add('product-images');
    product.images.forEach((src, index) => {
        const img = document.createElement('img');
        img.classList.add('product-image');
        img.src = src;
        img.alt = `Producto ${index + 1}`;
        productImages.appendChild(img);
    });

    // Crear la información del producto
    const productInfo = document.createElement('div');
    productInfo.classList.add('product-info');
    
    const productTitle = document.createElement('h1');
    productTitle.textContent = product.title;
    productInfo.appendChild(productTitle);

    const productDescription = document.createElement('p');
    productDescription.textContent = product.description;  // Corrección aquí
    productInfo.appendChild(productDescription);

    const productPrice = document.createElement('h2');
    productPrice.textContent = product.price;
    productInfo.appendChild(productPrice);

    const buyButton = document.createElement('a');
    buyButton.href = product.href;
    buyButton.classList.add('buy-button');
    buyButton.textContent = "Comprar ahora";
    productInfo.appendChild(buyButton);

    // Añadir todo al body
    document.body.appendChild(productImages);
    document.body.appendChild(productInfo);

    // Animación de aparición al cargar la página
    window.onload = () => {
        document.body.style.opacity = "1"; // Aplica la animación solo cuando todos los recursos se han cargado
    };
}

// Llamar a la función para generar el producto cuando el CSV se haya cargado
const params = new URLSearchParams(window.location.search);
const choosenName = params.get("name");

getProductDetails(choosenName).then(product => {
    if (product) {
        generateProductTemplate(product);
    } else {
        console.error("Producto no encontrado o error al cargar.");
    }
});

function createTaskBar() {
    const optionsBar = document.createElement("div");
    optionsBar.className = "options-bar";

    // Logo (botón para volver a la pantalla inicial)

    const logoSrc = document.createElement("a");
    logoSrc.href = "/index.html";

    const logoButton = document.createElement("img");
    logoButton.src = "../Logotipo_locuras_de_productos_blanco.png";
    logoButton.alt = "Logotipo Locuras de Productos";
    logoButton.className = "logo-button";
    addHoverEffect(logoButton);
    logoButton.addEventListener("click", () => initialScreen());

    logoSrc.appendChild(logoButton);
    optionsBar.appendChild(logoSrc);



    // Botón de ayuda
    const helpButton = document.createElement("a");
    helpButton.href = "../ayuda/index.html";
    helpButton.className = "help-button";
    helpButton.textContent = "¿Necesitas\n ayuda?";
    addHoverEffect(helpButton);
    optionsBar.appendChild(helpButton);

    return optionsBar;
}

function addHoverEffect(element) {
    element.addEventListener("mouseover", () => {
        element.classList.add("hover");
    });
    element.addEventListener("mouseout", () => {
        element.classList.remove("hover");
    });
}
