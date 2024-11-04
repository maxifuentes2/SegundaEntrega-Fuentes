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

// muestra los productos en el array y los agrega al HTML
function mostrarProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    listaProductosElemento.innerHTML = '';
    
    productos.forEach((producto, index) => {
        const productoElemento = document.createElement('div');
        productoElemento.classList.add('producto');
        
        const nombreElemento = document.createElement('span');
        nombreElemento.classList.add('producto-nombre');
        nombreElemento.textContent = `${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${producto.precio.toFixed(2)}`;
        
        const accionesElemento = document.createElement('div');
        accionesElemento.classList.add('acciones');
        
        const cantidadQuitarInput = document.createElement('input');
        cantidadQuitarInput.type = 'number';
        cantidadQuitarInput.classList.add('cantidad-quitar');
        cantidadQuitarInput.placeholder = 'Quitar';
        cantidadQuitarInput.min = 1;
        cantidadQuitarInput.max = producto.cantidad;
        
        const botonQuitar = document.createElement('button');
        botonQuitar.classList.add('boton-quitar');
        botonQuitar.dataset.index = index;
        botonQuitar.textContent = 'Quitar';
        
        const botonEliminar = document.createElement('button');
        botonEliminar.classList.add('boton-eliminar');
        botonEliminar.dataset.index = index;
        botonEliminar.textContent = 'Eliminar';
        
        accionesElemento.appendChild(cantidadQuitarInput);
        accionesElemento.appendChild(botonQuitar);
        accionesElemento.appendChild(botonEliminar);
        
        productoElemento.appendChild(nombreElemento);
        productoElemento.appendChild(accionesElemento);
        
        listaProductosElemento.appendChild(productoElemento);
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

// quita una cantidad especifica de un producto o lo elimina si la cantidad es 0
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

// elimina un producto completamente del localStorage
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
    const index = event.target.dataset.index;
    if (event.target.classList.contains('boton-quitar')) {
        const cantidadInput = event.target.previousElementSibling;
        const cantidadQuitar = parseInt(cantidadInput.value) || 0;

        if (cantidadQuitar > 0) {
            quitarProducto(index, cantidadQuitar);
            cantidadInput.value = '';
        }
    } else if (event.target.classList.contains('boton-eliminar')) {
        eliminarProducto(index);
    }
});

inicializarProductos();
mostrarProductos();
