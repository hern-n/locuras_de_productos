const curency = "€"

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
                    // Solo añadir la imagen si existe (es decir, si la columna no está vacía)
                    if (values[j] && values[j].trim() !== "") {
                        product.images.push(values[j].replace(/\\/g, "/")); // Unificar barras
                    }
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

    // Solo crear el contenedor de imágenes si hay imágenes
    if (product.images.length > 0) {
        const productImagesContainer = document.createElement('div');
        productImagesContainer.classList.add('product-images-container');  // Nuevo contenedor para el carrusel

        // Contenedor de las imágenes
        const productImages = document.createElement('div');
        productImages.classList.add('product-images');
        product.images.forEach((src, index) => {
            const img = document.createElement('img');
            img.classList.add('product-image');
            img.src = src;
            img.alt = `Producto ${index + 1}`;
            productImages.appendChild(img);
        });

        // Crear las flechas de navegación
        const prevButton = document.createElement('button');
        prevButton.classList.add('carousel-button', 'prev');
        prevButton.textContent = '❮';  // Flecha izquierda
        prevButton.addEventListener('click', () => changeImage(-1));

        const nextButton = document.createElement('button');
        nextButton.classList.add('carousel-button', 'next');
        nextButton.textContent = '❯';  // Flecha derecha
        nextButton.addEventListener('click', () => changeImage(1));

        productImagesContainer.appendChild(prevButton);
        productImagesContainer.appendChild(productImages);
        productImagesContainer.appendChild(nextButton);

        document.body.appendChild(productImagesContainer);

        let currentImageIndex = 0;

        // Función para cambiar la imagen
        function changeImage(direction) {
            currentImageIndex += direction;
            if (currentImageIndex < 0) currentImageIndex = product.images.length - 1;
            if (currentImageIndex >= product.images.length) currentImageIndex = 0;
            updateImageDisplay();
        }

        // Función para actualizar las imágenes visibles
        function updateImageDisplay() {
            const images = document.querySelectorAll('.product-image');
            images.forEach((img, index) => {
                img.style.display = index === currentImageIndex ? 'block' : 'none';
            });
        }

        // Inicializa la primera imagen visible
        updateImageDisplay();

        // Evento para detectar las teclas de dirección
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                changeImage(-1); // Flecha izquierda
            } else if (e.key === 'ArrowRight') {
                changeImage(1);  // Flecha derecha
            }
        });

        // Función para cambiar automáticamente cada 2-3 segundos
        setInterval(() => {
            changeImage(1);  // Avanza a la siguiente imagen
        }, 2500);  // Cambia la imagen cada 2.5 segundos
    }

    // Crear la información del producto
    const productInfo = document.createElement('div');
    productInfo.classList.add('product-info');
    
    const productTitle = document.createElement('h1');
    productTitle.textContent = product.title;
    productInfo.appendChild(productTitle);

    const productDescription = document.createElement('p');
    productDescription.innerHTML = product.description.replace(/\n/g, "<br>");
    productInfo.appendChild(productDescription);
    

    const productPrice = document.createElement('h2');
    productPrice.textContent = product.price + curency;
    productInfo.appendChild(productPrice);

    const buyButton = document.createElement('a');
    buyButton.href = product.href;
    buyButton.classList.add('buy-button');
    buyButton.textContent = "Comprar ahora";
    productInfo.appendChild(buyButton);

    //Salto de linea
    const jump = document.createElement("br");
    productInfo.appendChild(jump);

    //Información de después (sobre la compra)
    const buyInfo = document.createElement("small");
    buyInfo.textContent = "El boton de compra te llevará a la página oficial de ámazon. Desde allí lo podrás comprar de forma rápida, fácil y segura.";
    buyInfo.className = "buyInfo";
    productInfo.appendChild(buyInfo);

    // Añadir la información al body
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
