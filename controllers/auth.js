const { response, json } = require("express");
const { findOne } = require("../models/user");
const  Usuario  = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async ( req , res = response ) => {

    const { correo , password } = req.body;


    try {

        //Email existe
        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg : 'Usuario o correo incorrectos'
            })
        }

        // usuario activo
        if(!usuario.estado){
            return res.status(400).json({
                msg : 'No activo'
            })
        }

        const token = await generarJWT( usuario.id );

        const validarPassword = bcryptjs.compareSync( password , usuario.password)
        if(!validarPassword){
            return res.status(400).json({
                msg : 'Contraseña incorrecta'
            })
        }

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg : 'Error'
        })
    }


}

const googleSignIn = async( req, res = response) => {
    
    const { id_token } = req.body;

    try {

        const { nombre , img , correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            const data = {
                    nombre,
                    correo,
                    password : 'PP',
                    img,
                    google : true,
                    rol : "USER_ROLE"

            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Usuario en false
        if(!usuario.estado){
            return res.status(401).json({
                msg : 'Hable con el administrador'
            })
        }

        const token = await generarJWT( usuario.id );

        res.json({
            usuario, 
            token
        })

    } 
    catch (error) {
        res.status(400).json({
            msg : 'token no se ha podido verificar',
            error
        })
        
    }

}

module.exports = {
    login,
    googleSignIn
}