const sequelize = require('./config.db');
const User = require('../models/user.js')(sequelize);
// const Task = require('../models/task')(sequelize);
const Laptop = require('../models/laptop.js')(sequelize);
const Pc = require('../models/pc.js')(sequelize);

User.hasMany(Laptop, { as: 'laptops', foreignKey: 'userId' });
Laptop.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Pc, { as: 'pcs', foreignKey: 'userId' });
Pc.belongsTo(User, { foreignKey: 'userId' });

const dbConnection = async () => {    
    try {
      await sequelize.authenticate();
      console.log('Base de datos Online.');
      await sequelize.sync();
      console.log('Tabla creada');
    } catch (error) {
      console.error('Error al crear la tabla User:', error);
    }
}

module.exports = {
  dbConnection,
  sequelize,
  User,
  Laptop,
  Pc,
  // Task,
};