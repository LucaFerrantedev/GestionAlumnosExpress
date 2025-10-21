const express = require('express');
const { login } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', login);

module.exports = router;
// Este archivo define las rutas relacionadas con la autenticación de usuarios.
// Importa el controlador de autenticación y define la ruta para el inicio de sesión.