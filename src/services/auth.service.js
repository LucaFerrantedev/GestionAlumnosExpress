const db = require('../db/db');
const bcrypt = require('bcrypt');

async function buscarUsuarioPorUsuario(usuario) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ? AND fecha_baja IS NULL', [usuario]);
  return rows[0];
}

module.exports = {
  buscarUsuarioPorUsuario
};
