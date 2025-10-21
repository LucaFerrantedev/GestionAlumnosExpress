const express = require('express');
const { registrarUsuario } = require('../controllers/usuario.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');


const router = express.Router();

// Solo ADMIN (rol_id === 1) puede registrar usuarios
router.post('/usuarios', verificarToken, verificarRol(1), registrarUsuario);
module.exports = router;
