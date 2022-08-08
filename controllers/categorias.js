const { response, json } = require("express");
const { Categoria } = require("../models");


const prueba = ( req , res = response ) => {

    res.status(200).json({
        msg : 'Hemos tenido exito'
    })

}
// obtener categorias - total - populate

const obtenerCategorias = async( req , res = response ) => {
    
    const {limite = 5, desde = 0} = req.params

    const [Categorias , total ] = await Promise.all([
        Categoria.find({estado : true})
                    .populate('usuario','nombre')
                    .skip(Number(desde))
                    .limit(Number(limite)),
        Categoria.countDocuments({estado : true})
    ])

    res.json({
        total,
        Categorias
    })

}

// obtener categoria . populate {objeto de la cat}
const obtenerCategoria = async ( req, res = response ) => {
    const { id } = req.params;

    const categoria = await Categoria.findById(id).
                                        populate('usuario','nombre')

    res.json({
        categoria
    })
}

// actualizar categoria 
const actualizarCategoria = async ( req , res = response ) => {
    const { id } = req.params;
    const { estado, usuario , ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoriaNueva = await Categoria.findByIdAndUpdate( id, data, { new : true } );
    
    res.json({
        msg : 'actualizado',
        categoriaNueva
    })
}

const eliminarCategoria = async ( req , res = response ) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado : false })
    const usuarioAutenticado = req.usuario;

    res.json({
        categoria,
        usuarioAutenticado
    })
    }

const crearCategoria = async( req , res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB){
        return res.status(400).json({
            msg : 'Categoría ya existe',
        })
    }

    const data = {
        nombre, 
        usuario : req.usuario._id
    }

    console.log(data)
    const categoria = new Categoria( data );

    await categoria.save();

    res.status(201).json(categoria)
}


module.exports = {
     prueba ,
     crearCategoria,
     obtenerCategorias,
     obtenerCategoria,
     actualizarCategoria,
     eliminarCategoria
}
























// const Categoria = require("../models/categoria");
//const categoria = require("../models/categoria");
// const  Categoria  = require("../models");
// const  Categoria  = require('../models/categoria');
// const  {Categoria } = require("../models");
//const categoria = require("../models/categoria");
//const  Categoria  = require('../models/categoria');