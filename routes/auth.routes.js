const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, register, refreshToken, onAuthStateChanged } = require('../controllers/auth.controller');
const { validateInput } = require('../middlewares/validate-inputs');
const { emailExist } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/login',[
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validateInput
], login);

router.post('/google',[
  check('id_token', 'El token de Google es necesario').not().isEmpty(),
  validateInput
], googleSignIn);

router.post('/register', [
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email').custom( emailExist ),
  validateInput
], register);

router.post('/refresh', [
  validateJWT,
  validateInput
], refreshToken);

router.post('/active', [
  validateJWT,
  validateInput
], onAuthStateChanged);

module.exports = router;