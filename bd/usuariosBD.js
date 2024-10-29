const usuariosBD = require("./conexion").usuarios;
const Usuario=require("../modelos/UsuarioModelo");
const {encriptarPassword, validarPassword, usuarioAutorisado, adminAutorizado}=require("../middlewares/funcionesPassword");

function validarDatos(usuario){
    var valido=false;
    if(usuario.nombre!=undefined && usuario.usuario!=undefined && usuario.password!=undefined){
        valido=true;
    }
    return valido;
}

async function mostrarUsuarios(){
    const usuarios = await usuariosBD.get();
    usuariosValidos=[];
    usuarios.forEach(usuario => {
        const usuario1=new Usuario({id:usuario.id,...usuario.data()});
        if(validarDatos(usuario1.getUsuario)){
            usuariosValidos.push(usuario1.getUsuario);
        }
    });

    return usuariosValidos;
}

async function buscarPorID(id) {
    const usuario=await usuariosBD.doc(id).get();

    
    const usuario1=new Usuario({id:usuario.id,...usuario.data()});
    var usuarioValido;

    
    if(validarDatos(usuario1.getUsuario)){
        usuarioValido=usuario1.getUsuario;
    }

    return usuarioValido;
}

async function nuevoUsuario(data) {

    
    const {salt,hash}=encriptarPassword(data.password);
    data.password=hash;
    data.salt=salt;
    data.tipoUsuario="usuario";
    const usuario1=new Usuario(data);

    var usuarioValido=false;
    if(validarDatos(usuario1.getUsuario)){
        await usuariosBD.doc().set(usuario1.getUsuario);
        usuarioValido=true;
    }
    return usuarioValido;
}

async function borrarUsuario(id){
    var usuarioValido = await buscarPorID(id);
    var usuarioBorrado = false;
    if(usuarioValido){
        await usuariosBD.doc(id).delete();
        usuarioBorrado=true;
    }
    return usuarioBorrado;
}

// FUNCIÓN PARA EDITAR
async function editarUsuario(id, data) {
    const usuarioExistente = await buscarPorID(id); // Verifica si el usuario existe
    if (!usuarioExistente) {
        return false; // Retorna falso si el usuario no existe
    }

    // Si existe y se proporciona una nueva contraseña, encriptarla
    if (data.password) {
        const { salt, hash } = encriptarPassword(data.password);
        data.password = hash;
        data.salt = salt;
    } else {
        // Si no se proporciona una nueva contraseña, usa la existente
        data.password = usuarioExistente.password;
        data.salt = usuarioExistente.salt;
    }

    const usuarioActualizado = {
        nombre: data.nombre || usuarioExistente.nombre,
        usuario: data.usuario || usuarioExistente.usuario,
        password: data.password,
        salt: data.salt,
        tipoUsuario: data.tipoUsuario || usuarioExistente.tipoUsuario
    };

    await usuariosBD.doc(id).update(usuarioActualizado); // Actualiza los datos en la BD
    return usuarioActualizado;
}


module.exports={
    mostrarUsuarios,
    nuevoUsuario,
    borrarUsuario,
    buscarPorID,
    editarUsuario,
};

