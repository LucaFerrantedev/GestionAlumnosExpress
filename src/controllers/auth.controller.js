const bcrypt = require('bcrypt');
const generarJWT = require('../utils/generarJWT');
const { buscarUsuarioPorUsuario } = require('../services/auth.service');

const login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const usuarioDB = await buscarUsuarioPorUsuario(usuario);

    if (!usuarioDB) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(contrasena, usuarioDB.contrasena);

    if (!validPassword) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    const token = await generarJWT(usuarioDB.id, usuarioDB.rol_id);

    res.json({
      usuario: usuarioDB.usuario,
      rol: usuarioDB.rol_id,
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

module.exports = { login };
// Este controlador maneja el inicio de sesión de un usuario
// Verifica las credenciales y genera un JWT si son válidas