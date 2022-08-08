const { Router } = require('express');
const { check } = require('express-validator');
const { prueba, crearCategoria,obtenerCategorias, actualizarCategoria, obtenerCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdmin } = require('../middlewares/validar-roles');

const router = Router();


router.get('/',obtenerCategorias);

router.get('/:id' , [
    check('id','No es id de mongo').isMongoId(),
    check('id','obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
] ,obtenerCategoria);

router.post('/' ,[ 
    validarJWT,
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('estado','estado obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

router.put('/:id',[
    validarJWT,
    check('nombre','Nombre obligatorio').not().isEmpty(),
    check('id','obligatorio').not().isEmpty(),
], actualizarCategoria);

router.delete('/:id',[
    validarJWT,
    esAdmin,
    check('id','No es id de mongo').isMongoId(),
    validarCampos,
    check('id','obligatorio').not().isEmpty(),
    validarCampos
],eliminarCategoria);

module.exports = router;