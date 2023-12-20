const { User, Laptop, Pc } = require("../database/dbConnection");


const isRoleValidate = async(req , res = response, next) => {
  
  if(!req.user) {
    return res.status(500).json({
      'msg': 'Se quiere validar el rol sin validar el token primero'
    });
  }

  const { status, name } = req.user;
  if(status !== 'admin') {
    return res.status(401).json({
      'msg': `El usuario ${name} no es administrador - no tiene estos permisos`
    });
  }

  next();
  
}

//* valida si el correo está registrado o no *//
const emailExist = async (email = '') => {
  const existEmail = await User.findOne({ where: {email} });
  console.log({email, existEmail});
  if(existEmail) throw new Error(`El correo ${email} ya se encuentra registrado`)
}

//* valida si el usuario existe *//
const existUserById = async (id) => {
  const existUser = await User.findOne({where: {id}});
  if(!existUser) throw new Error(`El id ${id} no existe`);
}

//* valida si el laptop existe *//
const existLaptopById = async (id) => {
  const existTask = await Laptop.findOne({where: {id}});
  if(!existTask) throw new Error(`El id ${id} no existe`);
}

//* valida si el pc existe *//
const existPcById = async (id) => {
  const existTask = await Pc.findOne({where: {id}});
  if(!existTask) throw new Error(`El id ${id} no existe`);
}

module.exports = {
  isRoleValidate,
  emailExist,
  existUserById,
  existLaptopById,
  existPcById
}