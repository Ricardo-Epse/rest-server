const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Base de datos activa')
    } catch (error) {
        console.log('Error inicializando la base de datos');
    }
  }
  
  

module.exports = {dbConnection}