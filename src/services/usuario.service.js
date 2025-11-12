const db = require('../db/db');

async function buscarPorUsuario(usuario) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
  return rows[0];
}

async function crearUsuario(data) {
  const { nombre, mail, usuario, contrasenaEncriptada, rol_id, usuario_alta } = data;

  const query = `
    INSERT INTO usuarios 
      (nombre, mail, usuario, contrasena, rol_id, fecha_alta, usuario_alta) 
    VALUES (?, ?, ?, ?, ?, NOW(), ?)
  `;
  await db.query(query, [nombre, mail, usuario, contrasenaEncriptada, rol_id, usuario_alta]);
}
module.exports = { buscarPorUsuario, crearUsuario };