// task.js

const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class Task extends Model {}

  Task.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false, 
        validate: {
          isUUID: {
            args: 4,
            msg: 'No es un ID válido',
          },
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dueDate: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pendiente', 'en_progreso', 'completada'),
        defaultValue: 'pendiente',
        allowNull: false,
      },
      state: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
    },
    {
      sequelize, // Instancia de Sequelize
      modelName: 'Task', // Nombre del modelo
    }
  );

  return Task;
};