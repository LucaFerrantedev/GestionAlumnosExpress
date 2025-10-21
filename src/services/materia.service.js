const db = require('../db/db');

async function obtenerMaterias(incluirInactivas = false) {
  const baseQuery = `
    SELECT m.id, m.nombre AS materia, c.nombre AS carrera, m.fecha_baja
    FROM materias m
    JOIN carreras c ON m.carrera_id = c.id
  `;

  const query = incluirInactivas
    ? baseQuery
    : baseQuery + ` WHERE m.fecha_baja IS NULL`;

  const [rows] = await db.query(query);
  return rows;
}

async function obtenerMateriaPorId(id) {
  const query = `
    SELECT m.id, m.nombre AS materia, c.nombre AS carrera, m.fecha_baja
    FROM materias m
    JOIN carreras c ON m.carrera_id = c.id
    WHERE m.id = ?
  `;
  const [rows] = await db.query(query, [id]);
  return rows[0];
}

async function crearMateria(data) {
  const { nombre, carrera_id, usuario_alta } = data;

  const query = `
    INSERT INTO materias (nombre, carrera_id, fecha_alta, usuario_alta)
    VALUES (?, ?, NOW(), ?)
  `;

  await db.query(query, [nombre, carrera_id, usuario_alta]);
}

module.exports = { obtenerMaterias, obtenerMateriaPorId,crearMateria };
