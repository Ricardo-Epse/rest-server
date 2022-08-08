const { response, request } = require('express');
const Usuario = require('../models/user');
const jwt = require('jsonwebtoken');

const validarJWT = async (req = request , res = response, next) => {

    const token = req.header('Authorization');

    if( !token ){
        return res.status(401).json({
            msg : 'no hay token'
        })
    }

    try {

        const { uid } = jwt.verify(token , process.env.SECRET_KEY);

        const usuario = await Usuario.findById(uid);

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe DB'
            })
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg : 'token no valido'
            })
        }

        req.usuario = usuario
        
        next()

    } catch (error) {

        res.status(401).json({
            msg : 'no hay token'
        })
        
    }
}

module.exports = { validarJWT }