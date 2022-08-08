const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../db/config');
const fileUpload = require('express-fileupload');

class Server {

        constructor(){
            this.app = express();
            this.port = process.env.PORT;
            
            this.authPath = '/api/auth';
            this.buscarPath = '/api/buscar';
            this.categoriasPath = '/api/categorias';
            this.productosPath = '/api/productos';
            this.usuariosPath = '/api/usuarios';
            this.uploadsPath = '/api/uploads'

            this.connectDB();

            //Middlewares
            this.middlewares();
            this.routes();         
        }

        async connectDB(){
            await dbConnection();
        }

        middlewares(){
            //cors
            this.app.use(cors());

            //parseo y lectura
            this.app.use(express.json());
            //directorio

            this.app.use(express.static('public'));

            this.app.use(fileUpload({
                useTempFiles : true,
                tempFileDir : '/tmp/',
                createParentPath : true,
            }));

        }
           
        routes(){
           this.app.use(this.authPath, require('../routes/auth'));
           this.app.use(this.usuariosPath, require('../routes/usuarios'));
           this.app.use(this.categoriasPath, require('../routes/categorias'));
           this.app.use(this.productosPath, require('../routes/productos'));
           this.app.use(this.buscarPath, require('../routes/buscar'));
           this.app.use(this.uploadsPath, require('../routes/uploads'));
        }

        listen(){
            this.app.get('/', (req, res) => {
                res.send('Hello World!')
              })
              
            this.app.listen(this.port, () =>{
                  console.log('Servidor corriendo',this.port);
              });
        }
          
}

module.exports = Server;