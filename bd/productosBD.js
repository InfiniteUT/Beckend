const productosBD = require("./conexion").productos; 
const Producto = require("../modelos/ProductoModelo");
const { encriptarCodigo, validarCodigo } = require("../middlewares/funcionesCodigo");

function validarDatosProducto(producto) {
    return producto.nombre != undefined && producto.proveedor != undefined && producto.codigo != undefined;
}

async function mostrarProductos() {
    const productos = await productosBD.get();
    let productosValidos = [];
    productos.forEach(producto => {
        const producto1 = new Producto({ id: producto.id, ...producto.data() });
        if (validarDatosProducto(producto1.getProducto)) {
            productosValidos.push(producto1.getProducto);
        }
    });
    return productosValidos;
}

async function buscarProductoPorID(id) {
    const producto = await productosBD.doc(id).get();
    const producto1 = new Producto({ id: producto.id, ...producto.data() });
    return validarDatosProducto(producto1.getProducto) ? producto1.getProducto : null;
}

async function nuevoProducto(data) {
    const { salt, hash } = encriptarCodigo(data.codigo);
    data.codigo = hash;
    data.salt = salt;
    const producto1 = new Producto(data);

    if (validarDatosProducto(producto1.getProducto)) {
        await productosBD.doc().set(producto1.getProducto);
        return true;
    }
    return false;
}

async function borrarProducto(id) {
    const productoValido = await buscarProductoPorID(id);
    if (productoValido) {
        await productosBD.doc(id).delete();
        return true;
    }
    return false;
}

async function editarProducto(id, data) {
    const productoExistente = await buscarProductoPorID(id); // Verifica si el producto existe
    if (!productoExistente) {
        return false; // Retorna falso si el producto no existe
    }

    // Actualizamos los datos permitidos
    const productoActualizado = {
        nombre: data.nombre || productoExistente.nombre,
        proveedor: data.proveedor || productoExistente.proveedor,
        codigo: data.codigo ? encriptarCodigo(data.codigo).hash : productoExistente.codigo,
        salt: data.codigo ? encriptarCodigo(data.codigo).salt : productoExistente.salt
    };

    await productosBD.doc(id).update(productoActualizado); // Actualiza los datos en la BD
    return { id, ...productoActualizado }; 
}

module.exports = {
    mostrarProductos,
    nuevoProducto,
    borrarProducto,
    buscarProductoPorID,
    editarProducto,
};
