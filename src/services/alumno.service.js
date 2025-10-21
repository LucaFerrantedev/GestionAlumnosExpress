const db = require('../db/db');
const bcrypt = require('bcrypt');

async function obtenerAlumnos(incluirInactivos = false) {
  const baseQuery = `
    SELECT id, nombre, mail, usuario, rol_id, fecha_baja
    FROM usuarios
    WHERE rol_id = 3
  `;

  const query = incluirInactivos
    ? baseQuery
    : baseQuery + ` AND fecha_baja IS NULL`;

  const [rows] = await db.query(query);
  return rows;
}

async function obtenerAlumnoPorId(id) {
  const query = `
    SELECT id, nombre, mail, usuario, rol_id, fecha_baja
    FROM usuarios
    WHERE id = ? AND rol_id = 3
  `;
  const [rows] = await db.query(query, [id]);
  return rows[0];
}

async function crearAlumno(data) {
  const { nombre, mail, usuario, contrasena, usuario_alta } = data;

  const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

  const query = `
    INSERT INTO usuarios 
    (nombre, mail, usuario, contrasena, rol_id, fecha_alta, usuario_alta)
    VALUES (?, ?, ?, ?, 3, NOW(), ?)
  `;

  await db.query(query, [nombre, mail, usuario, contrasenaEncriptada, usuario_alta]);
}

async function editarAlumno(id, data) {
  const { nombre, mail, usuario, usuario_modificacion } = data;

  const query = `
    UPDATE usuarios
    SET nombre = ?, mail = ?, usuario = ?, fecha_modificacion = NOW(), usuario_modificacion = ?
    WHERE id = ? AND rol_id = 3
  `;

  await db.query(query, [nombre, mail, usuario, usuario_modificacion, id]);
}

async function bajaLogicaAlumno(id, usuario_baja) {
  const query = `
    UPDATE usuarios
    SET fecha_baja = NOW(), usuario_baja = ?
    WHERE id = ? AND rol_id = 3
  `;
  await db.query(query, [usuario_baja, id]);
}


module.exports = { obtenerAlumnos, obtenerAlumnoPorId, crearAlumno, editarAlumno,bajaLogicaAlumno };
