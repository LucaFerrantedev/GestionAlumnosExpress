// define las rutas relacionadas con las inscripciones de alumnos a materias
// inscripcion.controller para manejar las solicitudes.
const express = require('express');
const { inscribirController } = require('../controllers/inscripcion.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const { listarMateriasDeAlumno } = require('../controllers/inscripcion.controller');
const { listarAlumnosDeMateria } = require('../controllers/inscripcion.controller');
const { eliminarInscripcionController } = require('../controllers/inscripcion.controller');

const router = express.Router();

router.post('/inscripciones', verificarToken, verificarRol(1, 3), inscribirController);

router.get('/alumnos/:id/materias', verificarToken, verificarRol(1, 2, 3), listarMateriasDeAlumno);

router.get('/materias/:id/alumnos', verificarToken, verificarRol(1, 2), listarAlumnosDeMateria);

router.delete('/inscripciones', verificarToken, verificarRol(1, 3), eliminarInscripcionController);

module.exports = router;