const { response } = require("express");
const Producto = require('../models/producto')


const obtenerProductos = async( req , res = response) => {
    const {limite = 5, desde = 0} = req.params

    const [Productos , total ] = await Promise.all([
    Producto.find({estado : true})
                    .populate('usuario','nombre')
                    .skip(Number(desde))
                    .limit(Number(limite)),
    Producto.countDocuments({estado : true})
    ])

    res.json({
        total,
        Productos
    })
}

const obtenerProductoPorId = async ( req , res = response ) =>  {
    const { id } = req.params;

    const producto = await Producto.findById(id).
                                populate('usuario','nombre').
                                populate('categoria','nombre')

    res.json({
        producto
    })

}

const crearProducto = async( req, res = response ) => {
    const { estado , usuario , ...body }= req.body;

    const productoDB = await Producto.findOne({nombre : body.nombre})

    if(productoDB){
        return res.status(400).json({
            msg : 'Producto ya existe',
        })
    }

    const data = {
        nombre : body.nombre.toUpperCase(), 
        usuario : req.usuario._id,
        ...body
    }

    const producto = new Producto(data);

    await producto.save()

    res.status(200).json({
        msg : 'producto creado',
        producto
    })

}

const actualizarProducto = async( req, res = response) => {
    const { id } = req.params
    const { estado, usuario , ...data } = req.body;


    if(data.nombre){

        data.nombre = data.nombre.toUpperCase();

    }

    // data.precio = data.precio;
    data.usuario = req.usuario._id;
    // data.descripcion = req.descripcion

    const productoNuevo = await Producto.findByIdAndUpdate( id, data, { new : true } );
    
    res.json({
        msg : 'actualizado',
        productoNuevo
    })
}

const eliminarProducto = async( req , res = response ) => {
    const { id } = req.params

    const eliminarProducto = await Producto.findByIdAndUpdate( id, { disponible : false } );
    const usuarioAutenticado = req.usuario

    res.json({
        eliminarProducto,
        usuarioAutenticado
    })

} 

module.exports = {
    obtenerProductos,
    crearProducto,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
}