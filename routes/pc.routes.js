const { Router } = require('express');
const { check } = require('express-validator');
const { validateInput, validateJWT } = require('../middlewares');
const {
  getPc,
  getPcById,
  pcPost,
  pcDelete,
  pcPut,
  assignComputerEquipment
} = require('../controllers/pc.controller');
const { existPcById, isRoleValidate } = require('../helpers/db-validators');

const router = Router();

router.get('/', [
  validateJWT,
  validateInput,
], getPc);

router.get('/:id', [
  validateJWT,
  check('id').custom(existPcById),
  validateInput,
], getPcById);

router.post('/', [
  validateJWT,
  isRoleValidate,
  check('activo_pantalla', 'El activo de la pantalla es obligatorio').not().isEmpty(),
  check('service_tag_pantalla', 'El service tag de pantalla es obligatorio').not().isEmpty(),
  check('service_tag_equipo', 'El service tag de equipo es obligatorio').not().isEmpty(),
  check('activo_del_equipo', 'El activo del equipo es obligatorio').not().isEmpty(),
  // check('rol').custom( isRoleValidate ),
  validateInput ,
], pcPost);

router.delete('/:id', [
  validateJWT,
  isRoleValidate,
  check('id').custom(existPcById),
  validateInput,
], pcDelete);

router.put('/assign/:id', [
  validateJWT,
  isRoleValidate,
  check('id').custom(existPcById),
  validateInput,
], assignComputerEquipment);

router.put('/:id', [
  validateJWT,
  isRoleValidate,
  check('id').custom(existPcById),
  validateInput,
], pcPut);


module.exports = router;