const express = require('express');
const { listarMaterias, verMateriaPorId,crearMateriaController  } = require('../controllers/materia.controller');
const { verificarToken,verificarRol } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/materias', verificarToken, listarMaterias);
router.get('/materias/:id', verificarToken, verMateriaPorId);
router.post('/materias', verificarToken, verificarRol(1), crearMateriaController);

module.exports = router;
