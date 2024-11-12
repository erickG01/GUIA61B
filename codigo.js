var fila = "<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td><button class='delete-btn'>Eliminar</button></td></tr>";
var productos = null;
var orden = 0;

function codigoCat(catstr) {
    var code = "null";
    switch(catstr) {
        case "electronicos": code = "c1"; break;
        case "joyeria": code = "c2"; break;
        case "caballeros": code = "c3"; break;
        case "damas": code = "c4"; break;
    }
    return code;
}

function listarProductos(productos) {
    var precio = document.getElementById("price");
    precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
    var num = productos.length;
    var listado = document.getElementById("listado");
    var tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    if (orden === 0) {
        orden = -1;
        precio.innerHTML = "Precio";
    } else if (orden == 1) {
        ordenarAsc(productos, "price");
        precio.innerHTML = "Precio A";
        precio.style.color = "darkgreen";
    } else if (orden == -1) {
        ordenarDesc(productos, "price");
        precio.innerHTML = "Precio D";
        precio.style.color = "blue";
    }

    listado.style.display = "block";

    for (let nfila = 0; nfila < num; nfila++) {
        const row = tbody.insertRow();
        row.setAttribute("data-id", productos[nfila].id); // Agregar data-id a cada fila

        // Llenar las celdas de la fila con los datos del producto
        row.innerHTML = `
            <td class="id">${productos[nfila].id}</td>
            <td class="foto"><img src="${productos[nfila].image}" onclick="window.open('${productos[nfila].image}')"></td>
            <td class="price">$${productos[nfila].price}</td>
            <td class="title">${productos[nfila].title}</td>
            <td class="description">${productos[nfila].description}</td>
            <td class="category">${productos[nfila].category}</td>
            <td><button class="delete-btn" onclick="eliminarProducto(${productos[nfila].id})">Eliminar</button></td>
        `;
    }
}

function eliminarProducto(id) {
    console.log(`Intentando eliminar el producto con ID: ${id}`); // Verifica que el ID sea correcto
    fetch(`https://retoolapi.dev/2JJNFu/productos/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        console.log(`Respuesta de la API: ${response.status}`);
        if (response.ok) {
            alert("Producto eliminado con éxito");
            
            // Eliminar la fila directamente de la tabla sin recargar
            const fila = document.querySelector(`tr[data-id="${id}"]`);
            if (fila) {
                fila.remove();
            }

        } else {
            alert("Error al eliminar el producto");
            console.error("Error al eliminar el producto:", response.statusText);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al eliminar el producto. Revisa la consola para más detalles.");
    });
}

function obtenerProductos() {
    fetch('https://retoolapi.dev/2JJNFu/productos')
        .then(res => res.json())
        .then(data => {
            productos = data;
            productos.forEach(function(producto) {
                producto.price = parseFloat(producto.price);
            });
            listarProductos(data);
        });
}

function ordenarDesc(p_array_json, p_key) {
    p_array_json.sort(function (a, b) {
        if (a[p_key] > b[p_key]) return -1;
        if (a[p_key] < b[p_key]) return 1;
        return 0;
    });
}

function ordenarAsc(p_array_json, p_key) {
    p_array_json.sort(function (a, b) {
        if (a[p_key] > b[p_key]) return 1;
        if (a[p_key] < b[p_key]) return -1;
        return 0;
    });
}

// Nueva función para agregar un producto
function agregarProducto() {
    // Captura los valores del formulario
    var title = document.getElementById("title").value;
    var price = parseFloat(document.getElementById("price").value);
    var description = document.getElementById("description").value;
    var image = document.getElementById("image").files[0] ? URL.createObjectURL(document.getElementById("image").files[0]) : '';
    var category = document.getElementById("category").value;

    // Crear un nuevo objeto de producto
    var nuevoProducto = {
        id: productos.length + 1,  // Asignar un ID único
        title: title,
        price: price,
        description: description,
        image: image,
        category: category
    };

    // Agregar el nuevo producto a la lista de productos
    productos.push(nuevoProducto);

    // Actualizar la tabla de productos
    listarProductos(productos);

    // Limpiar el formulario
    document.getElementById("title").value = "";
    document.getElementById("price").value = "";
    document.getElementById("description").value = "";
    document.getElementById("image").value = "";
    document.getElementById("category").value = "";
}
