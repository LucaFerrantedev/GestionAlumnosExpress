const db = require('../db/db');

async function inscribirAlumno({ alumno_id, materia_id, usuario_alta }) {
  const query = `
    INSERT INTO inscripciones (alumno_id, materia_id, fecha_alta, usuario_alta)
    VALUES (?, ?, NOW(), ?)
  `;
  await db.query(query, [alumno_id, materia_id, usuario_alta]);
}

async function existeInscripcion(alumno_id, materia_id) {
  const query = `
    SELECT * FROM inscripciones
    WHERE alumno_id = ? AND materia_id = ? AND fecha_baja IS NULL
  `;
  const [rows] = await db.query(query, [alumno_id, materia_id]);
  return rows.length > 0;
}

async function obtenerMateriasDeAlumno(alumno_id) {
  const query = `
    SELECT m.id, m.nombre AS materia, c.nombre AS carrera
    FROM inscripciones i
    JOIN materias m ON i.materia_id = m.id
    JOIN carreras c ON m.carrera_id = c.id
    WHERE i.alumno_id = ? AND i.fecha_baja IS NULL
  `;

  const [rows] = await db.query(query, [alumno_id]);
  return rows;
}

async function obtenerAlumnosDeMateria(materia_id) {
  const query = `
    SELECT u.id, u.nombre, u.mail, u.usuario
    FROM inscripciones i
    JOIN usuarios u ON i.alumno_id = u.id
    WHERE i.materia_id = ? AND i.fecha_baja IS NULL AND u.fecha_baja IS NULL
  `;

  const [rows] = await db.query(query, [materia_id]);
  return rows;
}

async function bajaLogicaInscripcion(alumno_id, materia_id, usuario_baja) {
  const query = `
    UPDATE inscripciones
    SET fecha_baja = NOW(), usuario_baja = ?
    WHERE alumno_id = ? AND materia_id = ? AND fecha_baja IS NULL
  `;
  await db.query(query, [usuario_baja, alumno_id, materia_id]);
}

module.exports = {
  inscribirAlumno,
  existeInscripcion,
  obtenerMateriasDeAlumno,
  obtenerAlumnosDeMateria,
  bajaLogicaInscripcion
};
