// define las rutas relacionadas con los alumnos.
// usa controlador alumno.controller para manejar las solicitudes.
const express = require('express');
const { listarAlumnos, verAlumnoPorId, crearAlumnoController, editarAlumnoController,eliminarAlumnoController, reactivarAlumnoController } = require('../controllers/alumno.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');

const router = express.Router();

// admin = 1, coordinador = 2, alumno = 3

// Todos pueden listar alumnos (alumno ve solo su info)
router.get('/alumnos', verificarToken, verificarRol(1, 2, 3), listarAlumnos);

// Todos pueden acceder (alumno ve solo su info)
router.get('/alumnos/:id', verificarToken, verificarRol(1, 2, 3), verAlumnoPorId);

// Solo admin y coordinadores puede crear alumnos
router.post('/alumnos', verificarToken, verificarRol(1),
  crearAlumnoController
);

// Solo admin y coordinador pueden editar alumnos
router.put('/alumnos/:id', verificarToken, verificarRol(1, 3),
  editarAlumnoController
);

// Solo ADMIN puede eliminar alumnos
router.delete('/alumnos/:id', verificarToken, verificarRol(1),
  eliminarAlumnoController
);

// Reactivar Alumno
router.put('/alumnos/:id/reactivar', verificarToken, verificarRol(1),
  reactivarAlumnoController
);

module.exports = router;
