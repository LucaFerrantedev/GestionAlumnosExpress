const { obtenerMaterias, obtenerMateriaPorId,crearMateria  } = require('../services/materia.service');

const listarMaterias = async (req, res) => {
  const incluirInactivas = req.query.todos === 'true';

  try {
    const materias = await obtenerMaterias(incluirInactivas);
    res.json(materias);
  } catch (error) {
    console.error('Error al obtener materias:', error);
    res.status(500).json({ msg: 'Error al obtener materias' });
  }
};

const verMateriaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const materia = await obtenerMateriaPorId(id);

    if (!materia || materia.fecha_baja !== null) {
      return res.status(404).json({ msg: 'Materia no encontrada o inactiva' });
    }

    res.json(materia);
  } catch (error) {
    console.error('Error al obtener materia:', error);
    res.status(500).json({ msg: 'Error al obtener materia' });
  }
};

const crearMateriaController = async (req, res) => {
  const { nombre, carrera_id } = req.body;
  const usuarioToken = req.usuario;

  if (usuarioToken.rol !== 1) {
    return res.status(403).json({ msg: 'Solo un administrador puede crear materias' });
  }

  try {
    await crearMateria({
      nombre,
      carrera_id,
      usuario_alta: usuarioToken.uid
    });

    res.status(201).json({ msg: 'Materia creada correctamente' });
  } catch (error) {
    console.error('Error al crear materia:', error);
    res.status(500).json({ msg: 'Error al crear materia', error: error.message });
  }
};

module.exports = { listarMaterias, verMateriaPorId, crearMateriaController  };
