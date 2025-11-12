const express = require('express');
const { listarAlumnos, verAlumnoPorId, crearAlumnoController, editarAlumnoController,eliminarAlumnoController, reactivarAlumnoController } = require('../controllers/alumno.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');

const router = express.Router();

// Solo admin (1), coordinador (2) o alumno (3) puede acceder (alumno ve solo activos)
router.get('/alumnos', verificarToken, verificarRol(1, 2, 3), listarAlumnos);

router.get('/alumnos/:id', verificarToken, verificarRol(1, 2, 3), verAlumnoPorId);

// Solo admin puede crear alumnos
router.post('/alumnos', verificarToken, verificarRol(1),
  crearAlumnoController
);

router.put('/alumnos/:id', verificarToken, verificarRol(1, 3),
  editarAlumnoController
);

router.delete('/alumnos/:id', verificarToken, verificarRol(1),
  eliminarAlumnoController
);

// Reactivar Alumno
router.put('/alumnos/:id/reactivar', verificarToken, verificarRol(1),
  reactivarAlumnoController
);

module.exports = router;
// Este archivo define las rutas relacionadas con los alumnos.
// Utiliza el controlador 'alumno.controller' para manejar las solicitudes.