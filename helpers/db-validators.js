const Categoria = require('../models/categoria');
const Role = require('../models/role')
const Usuario = require('../models/user');
const Producto = require('../models/producto');


const rolValido  = async (rol = '') => {
    const ExisteRol = await Role.findOne({rol});
    if( !ExisteRol ){
        throw new Error('El rol no está registrado en la BD');
    }
}

const emailExiste = async ( correo = '' ) => {
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail){
        throw new Error (' El correo ya existe ')
    }
}

const UsuarioExistePorId = async ( id ) => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error (' El usuario no existe ')
    }
}

const existeCategoriaPorId = async ( id ) => {
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error (' Categoria no existe ')
    }
}

const existeProductoPorId = async ( id ) => {
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error (' Producto no existe ')
    }
}

const coleccionesPermitidas = ( coleccion = '' , colecciones = []) => {
    const incluida = colecciones.includes( coleccion );

    if( !incluida ){
        throw new Error(`Colecciones permitidas : ${colecciones}`);
    }

    return true;

}


module.exports = {
    rolValido,
    emailExiste,
    UsuarioExistePorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}