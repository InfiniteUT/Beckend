const express = require("express");
const rutas = express.Router();
const { mostrarProductos, nuevoProducto, borrarProducto, buscarProductoPorID, editarProducto } = require("../bd/productosBD");

rutas.get("/", async (req, res) => {
    const productosValidos = await mostrarProductos();
    console.log(productosValidos);
    res.json(productosValidos);
});

rutas.get("/buscarPorId/:id", async (req, res) => {
    const productoValido = await buscarProductoPorID(req.params.id);
    res.json(productoValido);
});

rutas.delete("/borrarProducto/:id", async (req, res) => {
    const productoBorrado = await borrarProducto(req.params.id);
    res.json(productoBorrado);
});

rutas.post("/nuevoProducto", async (req, res) => {
    const productoValido = await nuevoProducto(req.body);
    res.json(productoValido);
});

// Ruta para editar un producto
rutas.put("/editarProducto/:id", async (req, res) => {
    const productoActualizado = await editarProducto(req.params.id, req.body);
    res.json(productoActualizado);
});

module.exports = rutas;
