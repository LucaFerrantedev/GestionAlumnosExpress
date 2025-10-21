const { inscribirAlumno, existeInscripcion,obtenerMateriasDeAlumno,obtenerAlumnosDeMateria,bajaLogicaInscripcion  } = require('../services/inscripcion.service');

const inscribirController = async (req, res) => {
  const { materia_id, alumno_id: alumnoEnBody } = req.body;
  const usuarioToken = req.usuario;

  const esAdmin = usuarioToken.rol === 1;
  const alumno_id = esAdmin ? alumnoEnBody : usuarioToken.uid;

  if (!materia_id || (!esAdmin && alumnoEnBody && alumnoEnBody !== usuarioToken.uid)) {
    return res.status(400).json({ msg: 'Datos inválidos o intento de inscribir a otro alumno' });
  }

  try {
    const yaInscripto = await existeInscripcion(alumno_id, materia_id);
    if (yaInscripto) {
      return res.status(400).json({ msg: 'El alumno ya está inscripto en esta materia' });
    }

    await inscribirAlumno({
      alumno_id,
      materia_id,
      usuario_alta: usuarioToken.uid
    });

    res.status(201).json({ msg: 'Inscripción registrada correctamente' });
  } catch (error) {
    console.error('Error al inscribir:', error);
    res.status(500).json({ msg: 'Error al inscribir', error: error.message });
  }
};

const listarMateriasDeAlumno = async (req, res) => {
  const { id } = req.params;
  const usuarioToken = req.usuario;

  const esAdminOCoord = usuarioToken.rol === 1 || usuarioToken.rol === 2;
  const esElMismo = usuarioToken.uid == id;

  if (!esAdminOCoord && !esElMismo) {
    return res.status(403).json({ msg: 'No tenés permiso para ver estas materias' });
  }

  try {
    const materias = await obtenerMateriasDeAlumno(id);
    res.json(materias);
  } catch (error) {
    console.error('Error al listar materias del alumno:', error);
    res.status(500).json({ msg: 'Error al listar materias del alumno' });
  }
};

const listarAlumnosDeMateria = async (req, res) => {
  const { id } = req.params;
  const usuarioToken = req.usuario;

  const esAdminOCoord = usuarioToken.rol === 1 || usuarioToken.rol === 2;

  if (!esAdminOCoord) {
    return res.status(403).json({ msg: 'No tenés permiso para ver los alumnos de esta materia' });
  }

  try {
    const alumnos = await obtenerAlumnosDeMateria(id);
    res.json(alumnos);
  } catch (error) {
    console.error('Error al listar alumnos de la materia:', error);
    res.status(500).json({ msg: 'Error al listar alumnos de la materia' });
  }
};

const eliminarInscripcionController = async (req, res) => {
  const { alumno_id, materia_id } = req.body;
  const usuarioToken = req.usuario;

  if (!alumno_id || !materia_id) {
    return res.status(400).json({ msg: 'Faltan datos necesarios' });
  }

  const esAdmin = usuarioToken.rol === 1;
  const esElMismo = usuarioToken.uid == alumno_id;

  if (!esAdmin && !esElMismo) {
    return res.status(403).json({ msg: 'No tenés permiso para dar de baja esta inscripción' });
  }

  try {
    await bajaLogicaInscripcion(alumno_id, materia_id, usuarioToken.uid);
    res.json({ msg: 'Inscripción dada de baja correctamente' });
  } catch (error) {
    console.error('Error al dar de baja inscripción:', error);
    res.status(500).json({ msg: 'Error al dar de baja inscripción', error: error.message });
  }
};

module.exports = { inscribirController, listarMateriasDeAlumno,listarAlumnosDeMateria,eliminarInscripcionController };
