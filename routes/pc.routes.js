const { Router } = require('express');
const { check } = require('express-validator');
const { validateInput, validateJWT } = require('../middlewares');
const { getPc, getPcById, pcPost, pcDelete, pcPut } = require('../controllers/pc.controller');
const { existTaskById } = require('../helpers/db-validators');

const router = Router();

router.get('/', [
  validateJWT,
  validateInput
], getPc);

router.get('/:id', [
  validateJWT,
  check('id').custom(existTaskById),
  validateInput
], getPcById);

router.post('/', [
  validateJWT,
  check('activo_pantalla', 'El activo de la pantalla es obligatorio').not().isEmpty(),
  check('service_tag_pantalla', 'El service tag de pantalla es obligatorio').not().isEmpty(),
  check('service_tag_equipo', 'El service tag de equipo es obligatorio').not().isEmpty(),
  check('activo_del_equipo', 'El activo del equipo es obligatorio').not().isEmpty(),
  validateInput 
], pcPost);

router.delete('/:id', [
  validateJWT,
  check('id').custom(existTaskById),
], pcDelete);

router.put('/:id', [
  validateJWT,
  check('id').custom(existTaskById),
], pcPut);


module.exports = router;