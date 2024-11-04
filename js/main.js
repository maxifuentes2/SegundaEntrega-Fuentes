// busca y guarda los elementos del HTML que vamos a usar
const listaProductosElemento = document.getElementById('lista-productos');
const formularioProducto = document.getElementById('formulario-producto');
const nombreProductoInput = document.getElementById('nombre-producto');
const cantidadProductoInput = document.getElementById('cantidad-producto');
const precioProductoInput = document.getElementById('precio-producto');

// lista inicial de productos para cargar en la aplicación
const productosIniciales = [
    { nombre: 'Procesador Intel Core i9 14900KS 6.2GHz Turbo Socket 1700 Raptor Lake', cantidad: 20, precio: 933570 },
    { nombre: 'Placa de Video ASUS ROG Strix GeForce RTX 4090 24GB GDDR6X BTF OC Edition', cantidad: 8, precio: 2972550 },
    { nombre: 'Placa de Video Zotac GeForce RTX 4060 Ti 16GB GDDR6 AMP', cantidad: 31, precio: 632930 },
    { nombre: 'Auriculares Razer BLACKSHARK V2 PRO Wireless USB-C White PC/PS5/XBOX', cantidad: 3, precio: 322990 },
    { nombre: 'Teclado Mecanico Razer BlackWidow V4 Pro RGB Switch Yellow Linear', cantidad: 15, precio: 264990 }
];

// inicializa los productos en el localStorage solo si no hay productos guardados
function inicializarProductos() {
    let productos = JSON.parse(localStorage.getItem('productos'));
    if (!productos || productos.length === 0) {
        localStorage.setItem('productos', JSON.stringify(productosIniciales));
    }
}

function mostrarProductos() {
    // obtiene los productos guardados en localStorage, o un array vacío si no existen productos guardados
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    
    // limpia el contenido actual del elemento de la lista de productos en la interfaz
    listaProductosElemento.innerHTML = ''; 

    // recorre cada producto en el array productos y su índice
    productos.forEach((producto, index) => {
        // crea un elemento div que representará la tarjeta de un producto individual
        const card = document.createElement('div');
        card.classList.add('producto'); // asigna la clase producto al div

        // inserta el contenido HTML en card mostrando nombre cantidad y precio del producto
        card.innerHTML = `
            <span class="producto-nombre">${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${producto.precio.toFixed(2)}</span>
            <div class="acciones">
                <!-- Campo de entrada para indicar cuántas unidades se quieren quitar (con un mínimo de 1 y un máximo igual a la cantidad del producto) -->
                <input type="number" class="cantidad-quitar" placeholder="Quitar" min="1" max="${producto.cantidad}">
                <!-- Botón para quitar la cantidad indicada del producto -->
                <button class="boton-quitar" data-index="${index}">Quitar</button>
                <!-- Botón para eliminar el producto completo -->
                <button class="boton-eliminar" data-index="${index}">Eliminar</button>
            </div>
        `;

        // agrega la tarjeta del producto al elemento de la lista de productos en la interfaz
        listaProductosElemento.appendChild(card); 
    });
}



// agrega un producto al almacenamiento y lo muestra en el array
function agregarProducto(nombre, cantidad, precio) {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    
    const productoExistente = productos.find(producto => producto.nombre === nombre);
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        productos.push({ nombre, cantidad, precio });
    }

    localStorage.setItem('productos', JSON.stringify(productos));
    mostrarProductos();
}

// quita una cantidad específica de un producto o lo elimina si la cantidad es 0
function quitarProducto(index, cantidadQuitar) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    const producto = productos[index];
    
    if (producto) {
        producto.cantidad -= cantidadQuitar;
        if (producto.cantidad <= 0) {
            productos.splice(index, 1);
        }
        localStorage.setItem('productos', JSON.stringify(productos));
        mostrarProductos();
    }
}

// elimina un producto completamente del almacenamiento
function eliminarProducto(index) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.splice(index, 1);
    localStorage.setItem('productos', JSON.stringify(productos));
    mostrarProductos();
}

// evento para agregar un producto por el formulario
formularioProducto.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = nombreProductoInput.value.trim();
    const cantidad = parseInt(cantidadProductoInput.value);
    const precio = parseFloat(precioProductoInput.value);

    if (nombre && cantidad > 0 && precio >= 0) {
        agregarProducto(nombre, cantidad, precio);
        nombreProductoInput.value = '';
        cantidadProductoInput.value = '';
        precioProductoInput.value = '';
    }
});

// evento para quitar o eliminar productos desde los botones
listaProductosElemento.addEventListener('click', (event) => {
    if (event.target.classList.contains('boton-quitar')) {
        const index = event.target.getAttribute('data-index');
        const cantidadInput = event.target.previousElementSibling;
        const cantidadQuitar = parseInt(cantidadInput.value) || 0;

        if (cantidadQuitar > 0) {
            quitarProducto(index, cantidadQuitar);
            cantidadInput.value = '';
        }
    } else if (event.target.classList.contains('boton-eliminar')) {
        const index = event.target.getAttribute('data-index');
        eliminarProducto(index);
    }
});

// inicializa la aplicación cargando productos iniciales si no hay en localStorage
inicializarProductos();
mostrarProductos();
