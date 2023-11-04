const { response } = require("express");
const { Task, User } = require("../database/dbConnection");

const getTask = async (req, res = response) => {
  const {limit = 15, since = 0} = req.query;
  const userId = req.user.id;
  const [tasks, total] = await Promise.all([
    Task.findAll({
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
    Task.count({
      where: {
        state: true
      }
    })
  ]);
  res.json({
    tasks,
    total
  });
  
}

const getTaskById = async (req, res) => { 
  const { id } = req.params;

  const updatedTask = await Task.findOne({
    where: { id }, include: [
    {
      model: User,
      attributes: ['id', 'name', 'email'],
    },], 
  });

  res.json({
    estadoPeticion: true,
    task: updatedTask
  });
}

const taskPost = async (req, res) => {

  const {title, description, dueDate, status} = req.body;
  const userId = req.user.id;
  console.log('ESto es un id: ', userId);
  const task = await Task.create({ title, description, dueDate, status, userId });
  await task.save()

  res.json({
    estadoPeticion: true,
    task
  });
}

const taskDelete = async (req, res = response) => {

  const { id } = req.params;

  const uid = req.uid;

  const updatedTask = await Task.findOne({ where: { id } });

  try {
    if (updatedTask) {
      await updatedTask.update({ state: false });
      console.log('task desactivado con éxito');
    } else {
      console.log('task no encontrado');
    }
  
    res.json({
      estadoPeticion: true,
      task: updatedTask
    });
  } catch (error) {
    res.json({
      msg: `Hable con el administrador: ${error}`
    })
  }
}

const taskPut = async (req, res = response) => {

  const {id} = req.params;

  const {title, description, status, ...resto} = req.body;


  const task = await Task.findOne({ where: { id } });

  //* cambiar estado de usuario *//
  try {
    if (task) {
      await task.update(req.body);
      console.log('Usuario desactivado con éxito');
    } else {
      console.log('Usuario no encontrado');
    }

    res.json({
      estadoPeticion: true,
      task
    });
  } catch (error) {
    res.json({
      msg: `Hable con el administrador: ${error}`
    })
  }
}

module.exports = {
  getTask,
  getTaskById,
  taskPost,
  taskDelete,
  taskPut
}