const ventasBD = require("./conexion").ventas;

async function nuevaVenta(data) {
    // Establecer el estatus inicial como "vendido"
    data.estatus = "vendido";
    await ventasBD.doc().set(data);
    return true;
}

async function buscarVentaPorId(id) {
    const venta = await ventasBD.doc(id).get(); // Buscar venta por ID
    if (venta.exists) {
        return { id: venta.id, ...venta.data() }; // Devolver la venta si existe
    } else {
        return null; // Si no existe, devolver null
    }
}

async function mostrarVentas() {
    const ventas = await ventasBD.get();
    let ventasValidas = [];
    ventas.forEach(venta => {
        ventasValidas.push({ id: venta.id, ...venta.data() });
    });
    return ventasValidas;
}

async function cambiarEstatusVenta(id, nuevoEstatus) {
    const venta = await ventasBD.doc(id).get();
    if (venta.exists) {
        await ventasBD.doc(id).update({ estatus: nuevoEstatus });
        return true;
    }
    return false;
}

module.exports = {
    nuevaVenta,
    buscarVentaPorId,
    mostrarVentas,
    cambiarEstatusVenta
};
