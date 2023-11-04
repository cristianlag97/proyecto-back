const { User, Task } = require("../database/dbConnection");


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

//* valida si el task existe *//
const existTaskById = async (id) => {
  const existTask = await Task.findOne({where: {id}});
  if(!existTask) throw new Error(`El id ${id} no existe`);
}


module.exports = {
  emailExist,
  existUserById,
  existTaskById
}