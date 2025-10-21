const express = require('express');
const dotenv = require('dotenv');
const app = express();

// maneja variables de entorno
dotenv.config();

app.use(express.json());

// Ruta para probar la API
app.get('/', (req, res) => {
  res.send('API Gestión de Alumnos funca');
});

// Levanta el srv express en port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

const db = require('./db/db');

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM roles');
    res.json(rows);
  } catch (error) {
    console.error('Error en test-db:', error);
    res.status(500).json({ error: 'Error de conexión a la base de datos' });
  }
});

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const usuarioRoutes = require('./routes/usuario.routes');
app.use('/api', usuarioRoutes);

const alumnoRoutes = require('./routes/alumno.routes');
app.use('/api', alumnoRoutes);

const materiaRoutes = require('./routes/materia.routes');
app.use('/api', materiaRoutes);

const inscripcionRoutes = require('./routes/inscripcion.routes');
app.use('/api', inscripcionRoutes);
