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
        return { id: venta.id, ...venta.data() }; 
    } else {
        return null; 
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

//EDITAR VENTAS
async function editarVenta(id, data) {
    const ventaExistente = await buscarVentaPorId(id); // Verifica si la venta existe
    if (!ventaExistente) {
        return false; 
    }


    const ventaActualizada = {
        idUsuario: data.idUsuario || ventaExistente.idUsuario,
        idProducto: data.idProducto || ventaExistente.idProducto,
        fecha: data.fecha || ventaExistente.fecha,
        hora: data.hora || ventaExistente.hora,
        estatus: data.estatus || ventaExistente.estatus
    };

    await ventasBD.doc(id).update(ventaActualizada); 
    return { id: id, ...ventaActualizada }; 
}

module.exports = {
    nuevaVenta,
    buscarVentaPorId,
    mostrarVentas,
    cambiarEstatusVenta,
    editarVenta
};
