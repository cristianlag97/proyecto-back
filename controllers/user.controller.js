const { responde: response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { User } = require('../database/dbConnection');


const userGet = async (req = request, res = response) => {

  try {
    const { limit = 5, since = 0 } = req.query;

    const [users, total] = await Promise.all([
      User.findAll({
        offset: since,
        limit: limit,
        attributes: { exclude: ['password'] } 
      }),
      User.count({
        where: {
          state: true
        }
      })
    ]);
    res.json({
      users,
      total
    });
  } catch (error) {
    res.json({
      msg: `Hable con el administrador: ${error}`
    })
  }
}

const userDelete = async (req, res = response) => {

  const { id } = req.params;

  const uid = req.uid;

  //* se elimina fisicamente *//
  // const user = await User.destroy({
  //   where: {id}
  // });

  const updatedUser = await User.findOne({ where: { id } });

  //* cambiar estado de usuario *//
  try {
    if (updatedUser) {
      await updatedUser.update({ state: false });
      console.log('Usuario desactivado con éxito');
    } else {
      console.log('Usuario no encontrado');
    }
  
    res.json({
      estadoPeticion: true,
      user: updatedUser
    });
  } catch (error) {
    res.json({
      msg: `Hable con el administrador: ${error}`
    })
  }
}

const userPut = async (req, res = response) => {

  const {id} = req.params;

  const {_id, password, google, email, ...resto} = req.body;

  if(password) {
    //* enctriptar contraseña *//
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync( password, salt );
  }

  // const user = await User.findByIdAndUpdate(id, resto);

  const updatedUser = await User.findOne({ where: { id } });

  //* cambiar estado de usuario *//
  try {
    if (updatedUser) {
      await updatedUser.update(resto);
      console.log('Usuario desactivado con éxito');
    } else {
      console.log('Usuario no encontrado');
    }

    res.json({
      estadoPeticion: true,
      user: resto
    });
  } catch (error) {
    res.json({
      msg: `Hable con el administrador: ${error}`
    })
  }
}

const userPost = async (req, res) => {

  const {name, email} = req.body;
  // const user = new User({name, email, password});
  const user = await User.create({ name, email, password: req.body.password });

  //* enctriptar contraseña *//
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync( req.body.password, salt );

  //* guardar en base de datos *//
  await user.save();

  delete user.dataValues.password;

  res.json({
    estadoPeticion: true,
    user
  });
}

const userPatch = (req, res) => {
  res.json({
    estadoPeticion: true,
    msn: 'Post API'
  });
}

module.exports = {
  userGet,
  userDelete,
  userPut,
  userPost,
  userPatch
}