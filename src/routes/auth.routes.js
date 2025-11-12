// define la ruta del login e importa el controlador auth.controller para manejar la solicitud
const express = require('express');
const { login } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', login);

module.exports = router;
