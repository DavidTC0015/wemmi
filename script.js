/*document.addEventListener('DOMContentLoaded', function () {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const products = parseCSV(data);
            renderCatalog(products);
        });
});

function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(';');
    const products = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(';');
        const product = {};
        for (let j = 0; j < headers.length; j++) {
            product[headers[j].trim()] = line[j] ? line[j].trim() : '';
        }
        if (Object.keys(product).length > 1) { // Ignora líneas vacías
            products.push(product);
        }
    }
    return products;
}

function renderCatalog(products) {
    const catalog = document.getElementById('catalog');
    const categories = {};

    products.forEach(product => {
        if (!categories[product['Categoría']]) {
            categories[product['Categoría']] = [];
        }
        categories[product['Categoría']].push(product);
    });

    let pageNumber = 1;

    for (const category in categories) {
        const categoryProducts = categories[category];
        let pageIndex = 0;

        while (pageIndex < categoryProducts.length) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            categoryDiv.innerHTML = `<h2>${category} - Página ${pageNumber}</h2>`;

            const pageProducts = categoryProducts.slice(pageIndex, pageIndex + 16); // 16 productos por página (4x4 grid)
            pageProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <img src="${product.Imagen}" alt="${product.Nombre}">
                    <div class="product-name">${product.Nombre}</div>
                    <div class="product-ref">${product.Referencia}</div>
                `;
                categoryDiv.appendChild(productDiv);
            });

            catalog.appendChild(categoryDiv);
            pageNumber++;
            pageIndex += 16; // Avanzamos al siguiente conjunto de 16 productos
        }
    }
}*/

/*document.addEventListener('DOMContentLoaded', function () {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const products = parseCSV(data);
            renderCatalog(products);
        });
});

function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(';');
    const products = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(';');
        const product = {};
        for (let j = 0; j < headers.length; j++) {
            product[headers[j].trim()] = line[j] ? line[j].trim() : '';
        }
        if (Object.keys(product).length > 1) { // Ignorar líneas vacías
            products.push(product);
        }
    }

    // Ordenar productos por nombre
    products.sort((a, b) => a.Nombre.localeCompare(b.Nombre));

    return products;
}

function renderCatalog(products) {
    const catalog = document.getElementById('catalog');
    const categories = {};

    // Agrupar productos por categoría
    products.forEach(product => {
        const categoryKey = getCategoryKey(product.Nombre);
        if (!categories[categoryKey]) {
            categories[categoryKey] = [];
        }
        categories[categoryKey].push(product);
    });

    let pageNumber = 1;

    // Iterar sobre cada categoría
    for (const category in categories) {
        const categoryProducts = categories[category];
        let pageIndex = 0;

        while (pageIndex < categoryProducts.length) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            categoryDiv.innerHTML = `<h2>${getUniqueTitle(categoryProducts[pageIndex].Nombre)}</h2>`; // Título basado en las primeras dos palabras del nombre

            const pageProducts = categoryProducts.slice(pageIndex, pageIndex + 16); // Máximo 16 productos por página
            pageProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <img src="${product.Imagen}" alt="${product.Nombre}">
                    <div class="product-name">${product.Nombre}</div>
                    <div class="product-ref">${product.Referencia}</div>
                `;
                categoryDiv.appendChild(productDiv);
            });

            catalog.appendChild(categoryDiv);
            pageNumber++;
            pageIndex += 16; // Avanzar al siguiente conjunto de 16 productos
        }
    }
}

// Función para obtener un título único basado en las primeras dos palabras del nombre del producto
function getUniqueTitle(productName) {
    const words = productName.split(' ');
    if (words.length >= 2) {
        return `${words[0]} ${words[1]}`;
    } else {
        return productName;
    }
}

// Función para obtener la clave de categoría basada en las primeras dos palabras del nombre del producto
function getCategoryKey(productName) {
    const words = productName.split(' ');
    if (words.length >= 2) {
        return `${words[0]}_${words[1]}`; // Usamos un separador para evitar conflictos
    } else {
        return productName; // Si el nombre tiene menos de dos palabras, usar el nombre completo como clave
    }
}*/

document.addEventListener('DOMContentLoaded', function () {
    fetch('data.csv')
        .then(response => response.text())
        .then(data => {
            const products = parseCSV(data);
            renderCatalog(products);
        });
});

function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(';');
    const products = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(';');
        const product = {};
        for (let j = 0; j < headers.length; j++) {
            product[headers[j].trim()] = line[j] ? line[j].trim() : '';
        }
        if (Object.keys(product).length > 1) { // Ignorar líneas vacías
            products.push(product);
        }
    }

    // Ordenar productos por nombre
    products.sort((a, b) => {
        // Verificar si el producto es del tipo especial "Esmalte permanente Wemmi Hema Free" con numeración
        const isSpecialA = isSpecialEsmalte(a.Nombre);
        const isSpecialB = isSpecialEsmalte(b.Nombre);

        if (isSpecialA && isSpecialB) {
            // Extraer números de dígitos del nombre del producto
            const digitsA = extractDigits(a.Nombre);
            const digitsB = extractDigits(b.Nombre);

            // Ordenar de menor a mayor basado en la numeración de dígitos
            return digitsA - digitsB;
        } else if (isSpecialA) {
            return -1; // Colocar producto A antes que B si A es especial y B no lo es
        } else if (isSpecialB) {
            return 1; // Colocar producto B antes que A si B es especial y A no lo es
        } else {
            // Si ninguno es especial, comparar por nombre normalmente
            return a.Nombre.localeCompare(b.Nombre);
        }
    });

    return products;
}

function renderCatalog(products) {
    const catalog = document.getElementById('catalog');
    const categories = {};

    // Agrupar productos por categoría
    products.forEach(product => {
        const categoryKey = getCategoryKey(product.Nombre);
        if (!categories[categoryKey]) {
            categories[categoryKey] = [];
        }
        categories[categoryKey].push(product);
    });

    let pageNumber = 1;

    // Iterar sobre cada categoría
    for (const category in categories) {
        const categoryProducts = categories[category];
        let pageIndex = 0;

        while (pageIndex < categoryProducts.length) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            categoryDiv.innerHTML = `<h2>${getUniqueTitle(categoryProducts[pageIndex])}</h2>`; // Título basado en el nombre del producto

            const pageProducts = categoryProducts.slice(pageIndex, pageIndex + 16); // Máximo 16 productos por página
            pageProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                    <img src="${product.Imagen}" alt="${product.Nombre}">
                    <div class="product-name">${product.Nombre}</div>
                    <div class="product-ref">${product.Referencia}</div>
                `;
                categoryDiv.appendChild(productDiv);
            });

            catalog.appendChild(categoryDiv);
            pageNumber++;
            pageIndex += 16; // Avanzar al siguiente conjunto de 16 productos
        }
    }
}

// Función para verificar si el producto es del tipo especial "Esmalte permanente Wemmi Hema Free" con numeración
function isSpecialEsmalte(productName) {
    return productName.includes('Esmalte permanente Wemmi Hema Free') && /\d+/.test(productName);
}

// Función para extraer números de dígitos del nombre del producto
function extractDigits(productName) {
    const matches = productName.match(/\d+/g); // Extraer números de dígitos usando una expresión regular
    if (matches) {
        return parseInt(matches[0]); // Convertir la cadena de dígitos a número entero
    } else {
        return Infinity; // Si no se encuentran dígitos, devolver Infinity para asegurar que se coloquen al final
    }
}

// Función para obtener un título único basado en el nombre del producto
function getUniqueTitle(product) {
    const productName = product.Nombre;

    // Manejar excepción para los esmaltes de tipo específico
    if (isSpecialEsmalte(productName)) {
        return productName; // Devolver el nombre completo del producto
    }

    // Por defecto, usar las primeras dos palabras del nombre del producto
    const words = productName.split(' ');
    if (words.length >= 2) {
        return `${words[0]} ${words[1]}`;
    } else {
        return productName;
    }
}

// Función para obtener la clave de categoría basada en las primeras dos palabras del nombre del producto
function getCategoryKey(productName) {
    const words = productName.split(' ');
    if (words.length >= 2) {
        return `${words[0]}_${words[1]}`; // Usamos un separador para evitar conflictos
    } else {
        return productName; // Si el nombre tiene menos de dos palabras, usar el nombre completo como clave
    }
}
