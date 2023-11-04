const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');
const { User } = require('../database/dbConnection');


const login = async (req, res = response) => {

  const {email, password} = req.body;

  try {

    //* verificar si el email existe *//
    let user = await User.findOne({where: { email: email }});
    if(!user) return res.status(400).json({
      msg: 'Usuario / Contraseña no son correctos - correo'
    });

    //* verificar si el usuario está activo *//
    if(!user.state) return res.status(400).json({
      msg: 'Usuario / Contraseña no son correctos - estado: false'
    });
    console.log('user: ', {user});
    //* verificar la contraseña *//
    const validatePassword = bcryptjs.compareSync(password, user.password)
    if(!validatePassword)return res.status(400).json({
      msg: 'Usuario / Contraseña no son correctos - contraseña'
    });

    //* generar JWT *//
    console.log('user con id: ', user.id);
    const token = await generateJWT(user.id);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });

  } catch (error) {
    return res.status(500).json({
      msg: `Hable con el administrador ${error.message}`
    })
  }


}

const googleSignIn = async (req, res = response) => {

  const { id_token } = req.body;

  try {
    // console.log( id_token );

    const {name, picture, email} = await googleVerify(id_token);
    // console.log({name,picture,email});

    //* generar referencia para verificar si el correo ya existe en la DB *//
    let user = await User.findOne({email});

    if(!user) {
      //* CREAR *//
      const data = {
        name,
        email,
        password: ':P',
        img: picture,
        google: true,
      };
      user = new User(data);
      await user.save();
    }

    //* Verificar si está activo el usuario *//
    if(!user.state) return res.status(401).json({
      msg: 'Hable con el administrador, Usuario bloqueado'
    });

    //* generar JWT *//
    const token = await generateJWT(user.id);

    res.json({
      estadoPeticion: true,
      user,
      token
    })
  } catch (error) {
    console.log( error );
    return res.status(400).json({
      estadoPeticion: false,
      msg: 'El token no se pudo verificar'
    })
  }


}

const register = async (req, res = response) => {
  const { name, email } = req.body;
  try {

    // const user = await User.create({ name, email, pass });
    const user = new User({
      name,
      email,
      password: req.body.password,
    });


    //* guardar en base de datos *//
    const newUser = await user.save();
    const {password, ...user_data } = newUser.toJSON();

    const token = await generateJWT(user.id);

    res.status(200).json({
      user: user_data,
      token
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error: comunicate con el administrador',
    })
  }
}

const refreshToken = async (req, res = response) => {
  const uid = req.uid;
  try {
    const token = await generateJWT(uid);
    res.status(200).json({
      token
    })
  } catch (error) {
    res.json({msg: 'comunicate con el admin'});
  }
}


module.exports = {
  login,
  googleSignIn,
  register,
  refreshToken
}