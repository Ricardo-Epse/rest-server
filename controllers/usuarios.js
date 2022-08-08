const { response } = require('express');
const  Usuario  = require('../models/user');
const bcryptjs = require('bcryptjs');
const { emailExiste } = require('../helpers/db-validators');
//const { remove } = require('../models/user');



const usuariosGet = async(req, res = response) => {

    const {limite = 5, desde = 0} = req.params

    const [usuarios , total ] = await Promise.all([
        Usuario.find({estado : true})
                    .skip(Number(desde))
                    .limit(Number(limite)),
        Usuario.countDocuments({estado : true})
    ])

    res.json({
        total,
        usuarios
    })
    }

const usuariosPut = async(req, res) => {

    const { id } = req.params;
    const { _id, password, google ,correo , ...resto } = req.body;

    if ( password ) {
        const salt = bcryptjs.genSaltSync(10) // 10 por default
        resto.password = bcryptjs.hashSync( password , salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto)

        res.json({
            msg:'put API',
            usuario
        })

}

const usuariosPost =  async(req, res) => {

    const { nombre , correo , password , rol } = req.body;
    const usuario = new Usuario({nombre , correo , password , rol });

    const salt = bcryptjs.genSaltSync(10) // 10 por default
    usuario.password = bcryptjs.hashSync( password , salt);
    
    await usuario.save();
    
    try {
        res.json({
            msg:'post API',
            usuario,
        })   
    } catch (error) {
        throw new Error("Error al momento de hacer post")
    }
}

const usuariosDelete =  async(req, res) => {

    const { id } = req.params;

    //const uid = req.uid;
    //borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id)

    const usuario = await Usuario.findByIdAndUpdate(id, { estado : false })
    const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
        usuarioAutenticado
    })
    }

const usuariosPatch = (req, res) => {
    res.json({
        msg:'patch API'
    })
    }



module.exports = {
    usuariosGet,
    usuariosDelete,
    usuariosPatch,
    usuariosPost,
    usuariosPut
}