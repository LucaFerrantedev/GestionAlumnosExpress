const express = require('express');
const { 
  listarAlumnos, 
  verAlumnoPorId, 
  crearAlumnoController, 
  editarAlumnoController,
  eliminarAlumnoController,
  reactivarAlumnoController 
} = require('../controllers/alumno.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');

const router = express.Router();

// Solo admin (1), coordinador (2) o alumno (3) puede acceder (alumno ve solo activos)
router.get('/alumnos', verificarToken, verificarRol(1, 2, 3), listarAlumnos);

router.get('/alumnos/:id', verificarToken, verificarRol(1, 2, 3), verAlumnoPorId);

router.post('/alumnos', verificarToken, verificarRol(1), // Solo admin
  crearAlumnoController
);

router.put('/alumnos/:id', verificarToken, verificarRol(1, 2, 3), // permitimos que el middleware pase, y el control fino lo hace el controller
  editarAlumnoController
);

router.delete('/alumnos/:id', verificarToken, verificarRol(1),
  eliminarAlumnoController
);

// Solo admin puede reactivar alumnos
router.patch('/alumnos/:id/reactivar', verificarToken, verificarRol(1),
  reactivarAlumnoController
);

module.exports = router;
// Este archivo define las rutas relacionadas con los alumnos.
// Utiliza el controlador 'alumno.controller' para manejar las solicitudes.