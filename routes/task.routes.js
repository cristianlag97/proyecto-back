const { Router } = require('express');
const { check } = require('express-validator');
const { validateInput, validateJWT } = require('../middlewares');
const { getTask, taskPost, taskDelete, taskPut, getTaskById } = require('../controllers/task.controller');
const { existTaskById } = require('../helpers/db-validators');

const router = Router();

router.get('/', [
  validateJWT,
  validateInput
], getTask);

router.get('/:id', [
  validateJWT,
  check('id').custom(existTaskById),
  validateInput
], getTaskById);

router.post('/', [
  validateJWT,
  check('title', 'El titulo es obligatorio').not().isEmpty(),
  validateInput 
], taskPost);

router.delete('/:id', [
  validateJWT,
  check('id').custom(existTaskById),
], taskDelete);

router.put('/:id', [
  validateJWT,
  check('id').custom(existTaskById),
], taskPut);


module.exports = router;