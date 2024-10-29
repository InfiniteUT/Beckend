var rutas = require("express").Router();

var{mostrarUsuarios, nuevoUsuario, borrarUsuario, buscarPorID,  editarUsuario} = require("../bd/usuariosBD");


rutas.get("/",async(req,res)=>{

    var usuariosValidos = await mostrarUsuarios();
    console.log(usuariosValidos);
    res.json(usuariosValidos);
});

rutas.get("/buscarPorId/:id",async(req,res)=>{
    var usuarioValido = await buscarPorID(req.params.id);
    res.json(usuarioValido);
});

rutas.delete("/borrarUsuario/:id",async(req,res)=>{
    var usuarioBorrado = await borrarUsuario(req.params.id);
    res.json(usuarioBorrado);
});

rutas.post("/nuevoUsuario",async(req,res)=>{
    var usuarioValido = await nuevoUsuario(req.body);
    res.json(usuarioValido);
});

// Nueva ruta para editar usuario
rutas.put("/editarUsuario/:id", async (req, res) => {
    var usuarioActualizado = await editarUsuario(req.params.id, req.body);
    res.json(usuarioActualizado ? usuarioActualizado : { error: "Usuario no encontrado o no válido" });
});


module.exports=rutas;