const { Router } = require('express');
const { check } = require('express-validator');
const { validateInput, validateJWT } = require('../middlewares');
const {
  getLaptop,
  getLaptopById,
  laptopPost,
  laptopDelete,
  laptopPut,
  assignComputerEquipment,

} = require('../controllers/laptop.controller');
const { existLaptopById, isRoleValidate } = require('../helpers/db-validators');

const router = Router();

router.get('/', [
  validateJWT,
  validateInput
], getLaptop);

router.get('/:id', [
  validateJWT,
  check('id').custom(existLaptopById),
  validateInput
], getLaptopById);

router.post('/', [
  validateJWT,
  isRoleValidate,
  check('activo_pantalla', 'El activo de la pantalla es obligatorio').not().isEmpty(),
  check('service_tag_pantalla', 'El service tag de pantalla es obligatorio').not().isEmpty(),
  check('service_tag_equipo', 'El service tag de equipo es obligatorio').not().isEmpty(),
  check('activo_del_equipo', 'El activo del equipo es obligatorio').not().isEmpty(),
  // check('rol').custom( isRoleValidate ), 
  // hasRole('admin'),
  validateInput,
], laptopPost);

router.delete('/:id', [
  validateJWT,
  isRoleValidate,
  check('id').custom(existLaptopById),
  // check('rol').custom( isRoleValidate ),
  validateInput,
], laptopDelete);

router.put('/assign/:id', [
  validateJWT,
  isRoleValidate,
  check('id').custom(existLaptopById),
  validateInput,
], assignComputerEquipment);

router.put('/:id', [
  validateJWT,
  isRoleValidate,
  check('id').custom(existLaptopById),
  validateInput,
], laptopPut);


module.exports = router;