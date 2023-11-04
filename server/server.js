const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/dbConnection');

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.path = {
      auth: '/api/auth',
      users: '/api/users',
      task: '/api/task',
      laptop: '/api/laptop',
      pc: '/api/pc'
    }

    //Conectar a base de datos
    this.connectDB();
    //Middlewares
    this.middlewares();

    //Rutas de mi aplicación
    this.routes();
  }

  async connectDB() {
    await dbConnection()
  }

  routes() {
    this.app.use(this.path.auth, require('../routes/auth.routes'));
    this.app.use(this.path.users, require('../routes/user.routes'));
    this.app.use(this.path.task, require('../routes/task.routes'));
    this.app.use(this.path.laptop, require('../routes/laptop.routes'));
    this.app.use(this.path.pc, require('../routes/pc.routes'));
  }

  middlewares() {
    //* CORS *//
    this.app.use(cors());

    //* Lectura y parse del body *//
    this.app.use(express.json());

    //* Directorio publico *//
    this.app.use(express.static('public'));

    // Note that this option available for versions 1.0.0 and newer.
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
    }));
  }

  listen() {

    this.app.listen(this.port, () => {
      console.log( 'El servidor se ha levantado en el puerto:', this.port );
    })
  }

}

module.exports = Server;