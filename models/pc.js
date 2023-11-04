// Pc.js

const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class Pc extends Model {}

  Pc.init(
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
      activo_pantalla: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      service_tag_pantalla: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      service_tag_equipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      activo_del_equipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('asignado', 'sin_asignar'),
        defaultValue: 'sin_asignar',
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
      modelName: 'Pc', // Nombre del modelo
    }
  );

  return Pc;
};