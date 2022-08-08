const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerProductos, crearProducto, obtenerProductoPorId, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdmin } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', obtenerProductos)

router.get('/:id', [
    check('id','No es id de mongo').isMongoId(),
    check('id','obligatorio').not().isEmpty(),
    check('id').custom( existeProductoPorId ),
    validarCampos
] , obtenerProductoPorId)

router.put('/:id',[ 
    validarJWT,
    //check('categoria','No es id de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId),
    validarCampos
], actualizarProducto)

router.post('/',[    
    validarJWT,
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('categoria','No es id de mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId),
    validarCampos
], crearProducto)

router.delete('/:id',[
    validarJWT,
    esAdmin,
    check('id','No es id de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId),
    validarCampos,
], eliminarProducto)

module.exports = router;