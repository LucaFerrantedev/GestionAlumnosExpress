const { obtenerAlumnos } = require('../services/alumno.service');
const { crearAlumno } = require('../services/alumno.service');
const { buscarPorUsuario } = require('../services/usuario.service');
const { editarAlumno } = require('../services/alumno.service');
const { bajaLogicaAlumno } = require('../services/alumno.service');

const listarAlumnos = async (req, res) => {
  const rol = req.usuario.rol;
  const incluirInactivos = req.query.todos === 'true';

  // Solo admin (1) y coordinador (2) pueden ver inactivos
  if (incluirInactivos && !(rol === 1 || rol === 2)) {
    return res.status(403).json({ msg: 'No tenés permisos para ver todos los alumnos' });
  }

  try {
    const alumnos = await obtenerAlumnos(incluirInactivos);
    res.json(alumnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener alumnos' });
  }
};

const { obtenerAlumnoPorId } = require('../services/alumno.service');

const verAlumnoPorId = async (req, res) => {
  const { id } = req.params;
  const usuarioSolicitante = req.usuario;

  try {
    const alumno = await obtenerAlumnoPorId(id);

    if (!alumno || alumno.fecha_baja !== null) {
      return res.status(404).json({ msg: 'Alumno no encontrado o dado de baja' });
    }

    const esAdminOCoord = usuarioSolicitante.rol === 1 || usuarioSolicitante.rol === 2;
    const esElMismo = usuarioSolicitante.uid == id;

    if (!esAdminOCoord && !esElMismo) {
      return res.status(403).json({ msg: 'No tenés permiso para ver este alumno' });
    }

    res.json(alumno);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el alumno' });
  }
};

const crearAlumnoController = async (req, res) => {
  const { nombre, mail, usuario, contrasena } = req.body;

  try {
    const existe = await buscarPorUsuario(usuario);
    if (existe) {
      return res.status(400).json({ msg: 'El nombre de usuario ya existe' });
    }

    await crearAlumno({
      nombre,
      mail,
      usuario,
      contrasena,
      usuario_alta: req.usuario.uid
    });

    res.status(201).json({ msg: 'Alumno creado correctamente' });
  } catch (error) {
  console.error('Error al crear alumno:', error);
  res.status(500).json({ msg: 'Error al crear el alumno', error: error.message });
}
};

const editarAlumnoController = async (req, res) => {
  const { id } = req.params;
  const { nombre, mail, usuario } = req.body;
  const usuarioToken = req.usuario;

  try {
    const alumno = await obtenerAlumnoPorId(id);

    if (!alumno || alumno.fecha_baja !== null) {
      return res.status(404).json({ msg: 'Alumno no encontrado o dado de baja' });
    }

    const esAdmin = usuarioToken.rol === 1;
    const esElMismo = usuarioToken.uid == id;

    if (!esAdmin && !esElMismo) {
      return res.status(403).json({ msg: 'No tenés permisos para editar este alumno' });
    }

    await editarAlumno(id, {
      nombre,
      mail,
      usuario,
      usuario_modificacion: usuarioToken.uid
    });

    res.json({ msg: 'Alumno actualizado correctamente' });
  } catch (error) {
    console.error('Error al editar alumno:', error);
    res.status(500).json({ msg: 'Error al editar alumno', error: error.message });
  }
};

const eliminarAlumnoController = async (req, res) => {
  const { id } = req.params;
  const usuarioToken = req.usuario;

  try {
    const alumno = await obtenerAlumnoPorId(id);

    if (!alumno || alumno.fecha_baja !== null) {
      return res.status(404).json({ msg: 'Alumno no encontrado o ya dado de baja' });
    }

    if (usuarioToken.rol !== 1) {
      return res.status(403).json({ msg: 'Solo un administrador puede dar de baja a un alumno' });
    }

    await bajaLogicaAlumno(id, usuarioToken.uid);

    res.json({ msg: 'Alumno dado de baja correctamente' });
  } catch (error) {
    console.error('Error al dar de baja:', error);
    res.status(500).json({ msg: 'Error al dar de baja', error: error.message });
  }
};

const reactivarAlumnoController = async (req, res) => {
  const { id } = req.params;
  const usuarioToken = req.usuario;

  try {
    const alumno = await obtenerAlumnoPorId(id);

    if (!alumno) {
      return res.status(404).json({ msg: 'Alumno no encontrado' });
    }

    if (alumno.fecha_baja === null) {
      return res.status(400).json({ msg: 'El alumno ya está activo' });
    }

    if (usuarioToken.rol !== 1) {
      return res.status(403).json({ msg: 'Solo un administrador puede reactivar un alumno' });
    }

    const actualizado = await reactivarAlumno(id);
    
    if (!actualizado) {
      return res.status(500).json({ msg: 'No se pudo reactivar el alumno' });
    }

    res.json({ msg: 'Alumno reactivado correctamente' });
  } catch (error) {
    console.error('Error al reactivar alumno:', error);
    res.status(500).json({ msg: 'Error al reactivar alumno', error: error.message });
  }
};

module.exports = { 
  listarAlumnos, 
  verAlumnoPorId, 
  crearAlumnoController,
  editarAlumnoController, 
  eliminarAlumnoController,
  reactivarAlumnoController 
};