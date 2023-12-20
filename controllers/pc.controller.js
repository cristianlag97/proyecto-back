const { response } = require("express");
const { Pc, User } = require("../database/dbConnection");

const getPc = async (req, res = response) => {
  const {limit = 15, since = 0} = req.query;
  const userId = req.user.id;
  const [pcs, total] = await Promise.all([
    Pc.findAll({
      offset: since,
      limit: limit,
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    }),
    Pc.count({
      where: {
        state: true
      }
    })
  ]);
  res.json({
    pcs,
    total
  });
  
}

const getPcById = async (req, res) => { 
  const { id } = req.params;

  const updatedPcs = await Pc.findOne({
    where: { id }, include: [
    {
      model: User,
      attributes: ['id', 'name', 'email'],
    },], 
  });

  res.json({
    estadoPeticion: true,
    pc: updatedPcs
  });
}

const pcPost = async (req, res) => {

  const {
    activo_pantalla,
    service_tag_pantalla,
    service_tag_equipo,
    activo_del_equipo
  } = req.body;
  const adminId = req.user.id;
  
  const pc = await Pc.create({
    activo_pantalla,
    service_tag_pantalla,
    service_tag_equipo,
    activo_del_equipo,
    adminId,
  });
  await pc.save()

  res.json({
    estadoPeticion: true,
    pc
  });
}

const assignComputerEquipment = async (req, res = response) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const updatedPcs = await Pc.findOne({ where: { id } });
    if (updatedPcs) {
      await updatedPcs.update({ userId: userId,
        status: 'asignado',
      });
      console.log('pc asignado con éxito');
    } else {
      console.log('pc no encontrado');
    }
  
    res.json({
      estadoPeticion: true,
      pc: updatedPcs
    });
  } catch (error) {
    res.json({
      msg: `Hable con el administrador: ${error}`
    })
  }

}

const pcDelete = async (req, res = response) => {

  const { id } = req.params;

  const uid = req.uid;

  const updatedPc = await Pc.findOne({ where: { id } });

  try {
    if (updatedPc) {
      await updatedPc.update({ state: false });
      console.log('Laptop desactivado con éxito');
    } else {
      console.log('Laptop no encontrado');
    }
  
    res.json({
      estadoPeticion: true,
      pc: updatedPc
    });
  } catch (error) {
    res.json({
      msg: `Hable con el administrador: ${error}`
    })
  }
}

const pcPut = async (req, res = response) => {

  const {id} = req.params;

  const {
    activo_pantalla,
    service_tag_pantalla,
    service_tag_equipo,
    activo_del_equipo,
    ...resto
  } = req.body;


  const pc = await Pc.findOne({ where: { id } });

  console.log(`========> pc: ${pc}`);

  //* cambiar estado de usuario *//
  try {
    if (pc) {
      await pc.update(req.body);
      console.log('Pc actualizado con éxito');
    } else {
      console.log('Pc no encontrado');
    }

    res.json({
      estadoPeticion: true,
      pc
    });
  } catch (error) {
    console.log(`Error => ${error}`)
    res.json({
      msg: `Hable con el administrador: ${error}`
    })
  }
}

module.exports = {
  getPc,
  getPcById,
  pcPost,
  pcDelete,
  pcPut,
  assignComputerEquipment
}