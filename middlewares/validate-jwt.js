const { response } = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../database/dbConnection');

const validateJWT = async (req, res = response, next) => {

  const token = req.header('x-token');
  console.log('token perron: ', token);

  if(!token) return res.status(401).json({
    msg: 'No hay token en la petición'
  })

  try {

    const {uid} = jwt.verify(token, process.env.SECRET_KEY);

    // req.user = await User.findById(uid)
    const user = await User.findOne({ where: { id: uid } });
    // const user = await User.findById(uid);
    if(!user) return res.status(401).json({
      msg: 'Token no valido - usuario no existente'
    })

    //* verificar si el uid tiene estado true *//
    if(!user.state) return res.status(401).json({
      msg: 'Token no valido - usuario con estado false'
    })

    req.user = user;
    req.uid = uid;//* para poder procesar el uid en los controladores *//

    next();
  } catch (error) {
    console.log( `ERROR de TOKEN: ${error}` );
    res.status(401).json({
      msg: 'Token no válido'
    })
  }

}


module.exports = {
  validateJWT
}