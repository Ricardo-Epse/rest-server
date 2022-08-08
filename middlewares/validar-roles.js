const { response, request } = require('express');
const Usuario = require('../models/user');
const jwt = require('jsonwebtoken');

const esAdmin = async (req = request , res = response, next) => {

        if(!req.usuario){
            return res.status(500).json({
                msg : 'Verificar primero el token'
            })
        }

        console.log(req.usuario);
        const { rol } = req.usuario   
        
        if(rol !== 'ADMIN_ROLE') {
            return res.status(401).json({
                msg : 'No es un usuario autorizado',
            })
        }

        next()

}

const tieneRole = ( ...roles ) => {

    return ( req , res = response , next ) => {

        if(!req.usuario){
            return res.status(500).json({
                msg : 'Se requiere verificar el rol sin validar el token prmero'
            })
        }
        
        if( !roles.includes ( req.usuario.rol )){
            return res.status(401).json({
                msg : 'el servicio require uno de estos roles.'
            })
        }
        


        next();
    }

}

module.exports = { esAdmin , tieneRole }