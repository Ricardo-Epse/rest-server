const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarArchivo } = require('../middlewares');
const { validarCampos } = require('../middlewares');

const router = Router();


router.post('/', validarArchivo ,cargarArchivo)

router.put('/:coleccion/:id' ,[
    validarArchivo,
    check('id','El id debe de ser de mongo ').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c ,  ['usuarios' , 'productos'] ) ),
    validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', mostrarImagen )


module.exports = router