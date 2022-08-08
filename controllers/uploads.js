const path = require('path')
const fs = require('fs')

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario , Producto } = require("../models");
const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL)

const cargarArchivo = async (req, res = response) => {
      try {
        const pathCompleto = await subirArchivo(req.files, undefined, "imgs");

        res.json({
          nombre: pathCompleto,
        });
      } catch (error) {
        res.status(400).json({
          error,
        });
      }
};

// const actualizarImagen = async(req, res = response) => {
//   const { coleccion, id } = req.params;

//   let modelo;

//   switch (coleccion) {
//     case 'usuarios':
//       modelo = await Usuario.findById( id );
//         if( !modelo ){
//           return res.status(400).json({
//             msg : 'No existe un usuario con ese id'
//           })
//         }
//       break;
    
//     case 'productos':
//       modelo = await Producto.findById( id );
//       if( !modelo ){
//         return res.status(400).json({
//           msg : 'No existe un producto con ese id'
//         })
//       }  
//       break;

//       default:
//       break;
//   }

//   if( modelo.img ) {

//     const pathImagen = path.join( __dirname , '../uploads' , coleccion , modelo.img );

//     if( fs.existsSync ( pathImagen ) ){
//       return fs.unlinkSync( pathImagen );
//     }

//   } 
//       res.json({ msg : 'falta place holder'})
// };


const actualizarImagenCloudinary = async(req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById( id );
        if( !modelo ){
          return res.status(400).json({
            msg : 'No existe un usuario con ese id'
          })
        }
      break;
    
    case 'productos':
      modelo = await Producto.findById( id );
      if( !modelo ){
        return res.status(400).json({
          msg : 'No existe un producto con ese id'
        })
      }  
      break;

      default:
      break;
  }

  if( modelo.img ) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length-1];
    const [ public_id ] = nombre.split('.')
    cloudinary.uploader.destroy(public_id)
  } 
      const { tempFilePath } = req.files.archivo;
      const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

      modelo.img = secure_url
      await modelo.save()
      res.json( modelo )
};


const mostrarImagen = async( req , res = response ) => {

  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById( id );
        if( !modelo ){
          return res.status(400).json({
            msg : 'No existe un usuario con ese id'
          })
        }
      break;
    
    case 'productos':
      modelo = await Producto.findById( id );
      if( !modelo ){
        return res.status(400).json({
          msg : 'No existe un producto con ese id'
        })
      }  
      break;

      default:
      break;
  }

  if( modelo.img ) {

    const pathImagen = path.join( __dirname , '../uploads' , coleccion , modelo.img );

    if( fs.existsSync ( pathImagen ) ){
      return res.sendFile( pathImagen );
    }

  }
    
  const pathNoImagen = path.join( __dirname ,'../assets/no-image.jpg' );
      return res.sendFile( pathNoImagen )
}

module.exports = {
  cargarArchivo,
  // actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary
};






