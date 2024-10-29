var rutas = require("express").Router();
var { nuevaVenta, buscarVentaPorId, mostrarVentas, cambiarEstatusVenta, editarVenta } = require("../bd/ventasBD");

rutas.get("/", async (req, res) => {
    const ventasValidas = await mostrarVentas();
    res.json(ventasValidas);
});

rutas.get("/:id", async (req, res) => {
    const venta = await buscarVentaPorId(req.params.id); // Llamar a la función para buscar la venta por ID
    if (venta) {
        res.json(venta); // Si se encuentra la venta, devolverla
    } else {
        res.status(404).json({ mensaje: "Venta no encontrada" }); // Si no se encuentra, devolver un mensaje de error
    }
});

rutas.post("/nuevaVenta", async (req, res) => {
    const ventaValida = await nuevaVenta(req.body);
    res.json(ventaValida);
});

rutas.put("/cancelarVenta/:id", async (req, res) => {
    const ventaCancelada = await cambiarEstatusVenta(req.params.id, "cancelado");
    res.json(ventaCancelada);
});

rutas.put("/editarVenta/:id", async (req, res) => {
    const ventaActualizada = await editarVenta(req.params.id, req.body);
    if (ventaActualizada) {
        res.json(ventaActualizada); // Si se actualiza correctamente, devolver la venta actualizada
    } else {
        res.status(404).json({ mensaje: "Venta no encontrada" }); // Si no se encuentra, devolver un mensaje de error
    }
});


module.exports = rutas;
