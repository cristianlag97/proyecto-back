const dbValidator = require('./db-validators');
const genmerateJWT = require('./generate-jwt');

module.exports = {
  ...dbValidator,
  ...genmerateJWT,
}