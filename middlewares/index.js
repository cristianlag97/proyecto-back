
const validateInputs = require('../middlewares/validate-inputs');
const validateJWT = require('../middlewares/validate-jwt');

module.exports = {
  ...validateInputs,
  ...validateJWT,
}