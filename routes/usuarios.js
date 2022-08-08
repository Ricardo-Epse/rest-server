const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');
const { rolValido, emailExiste, UsuarioExistePorId } = require('../helpers/db-validators');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdmin , tieneRole} = require('../middlewares/validar-roles');


const { validarCampos, validarJWT, esAdmin, tieneRole } = require('../middlewares')

const router = Router();

    router.get('/', usuariosGet);

    router.put('/:id',[
        check('id','No es ID válido').isMongoId(),
        check('id').custom( UsuarioExistePorId ),
        check('rol').custom( rolValido ),
        validarCampos
    ] , usuariosPut);

    router.post('/',[
        check('nombre','Nombre obligatorio').not().isEmpty(),
        check('password','Password obligatorio y tiene que tener más de 6 letras').isLength({min : 6}),
        check('correo','El correo no es valido').isEmail(),
        check('correo').custom( emailExiste ),
        //check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('rol').custom( rolValido ),
        validarCampos
    ] , usuariosPost);

    router.delete('/:id',[        
        validarJWT,
        //esAdmin,
        tieneRole('ADMIN_ROLE','USER_ROLE'),
        check('id','No es ID válido').isMongoId(),
        check('id').custom( UsuarioExistePorId ),
        validarCampos
    ],usuariosDelete);

    router.patch('/', usuariosPatch);

module.exports = router;