const { response } = require("express");
const { Laptop, User } = require("../database/dbConnection");

const getLaptop = async (req, res = response) => {
  const {limit = 15, since = 0} = req.query;
  const userId = req.user.id;
  const [laptops, total] = await Promise.all([
    Laptop.findAll({
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
    Laptop.count({
      where: {
        state: true
      }
    })
  ]);
  res.json({
    laptops,
    total
  });
  
}

const getLaptopById = async (req, res) => { 
  const { id } = req.params;

  const updatedLaptop = await Laptop.findOne({
    where: { id }, include: [
    {
      model: User,
      attributes: ['id', 'name', 'email'],
    },], 
  });

  res.json({
    estadoPeticion: true,
    laptop: updatedLaptop
  });
}

const laptopPost = async (req, res) => {

  const {
    activo_pantalla,
    service_tag_pantalla,
    service_tag_equipo,
    activo_del_equipo
  } = req.body;
  const adminId = req.user.id;
  
  const laptop = await Laptop.create({
    activo_pantalla,
    service_tag_pantalla,
    service_tag_equipo,
    activo_del_equipo,
    adminId,
  
  });
  await laptop.save()

  res.json({
    estadoPeticion: true,
    laptop
  });
}

const assignComputerEquipment = async (req, res = response) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const updatedLaptop = await Laptop.findOne({ where: { id } });
    if (updatedLaptop) {
      await updatedLaptop.update({ userId: userId,
        status: 'asignado',
      });
      console.log('Laptop asignado con éxito');
    } else {
      console.log('Laptop no encontrado');
    }
  
    res.json({
      estadoPeticion: true,
      laptop: updatedLaptop
    });
  } catch (error) {
    res.json({
      msg: `Hable con el administrador: ${error}`
    })
  }

}

const laptopDelete = async (req, res = response) => {

  const { id } = req.params;

  const uid = req.uid;

  const updatedLaptop = await Laptop.findOne({ where: { id } });

  try {
    if (updatedLaptop) {
      await updatedLaptop.update({ state: false });
      console.log('Laptop desactivado con éxito');
    } else {
      console.log('Laptop no encontrado');
    }
  
    res.json({
      estadoPeticion: true,
      laptop: updatedLaptop
    });
  } catch (error) {
    res.json({
      msg: `Hable con el administrador: ${error}`
    })
  }
}

const laptopPut = async (req, res = response) => {

  const {id} = req.params;

  const {
    activo_pantalla,
    service_tag_pantalla,
    service_tag_equipo,
    activo_del_equipo,
    ...resto
  } = req.body;


  const laptop = await Laptop.findOne({ where: { id } });

  //* cambiar estado de usuario *//
  try {
    if (laptop) {
      await laptop.update(req.body);
      console.log('Laptop actualizado con éxito');
    } else {
      console.log('Laptop no encontrado');
    }

    res.json({
      estadoPeticion: true,
      Laptop
    });
  } catch (error) {
    res.json({
      msg: `Hable con el administrador: ${error}`
    })
  }
}

module.exports = {
  getLaptop,
  getLaptopById,
  laptopPost,
  laptopDelete,
  assignComputerEquipment,
  laptopPut
}