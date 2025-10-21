const bcrypt = require('bcrypt');
const { buscarPorUsuario, crearUsuario } = require('../services/usuario.service');

const registrarUsuario = async (req, res) => {
  const { nombre, mail, usuario, contrasena, rol_id } = req.body;

  try {
    const existe = await buscarPorUsuario(usuario);
    if (existe) {
      return res.status(400).json({ msg: 'Ese nombre de usuario ya está en uso' });
    }

    const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

    await crearUsuario({
      nombre,
      mail,
      usuario,
      contrasenaEncriptada,
      rol_id,
      usuario_alta: req.usuario.uid // en el futuro, sacar del JWT
    });

    res.status(201).json({ msg: 'Usuario creado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

module.exports = { registrarUsuario };
