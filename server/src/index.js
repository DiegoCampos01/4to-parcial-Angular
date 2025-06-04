const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const alumnosRoutes = require('./routes/alumnos');
const cursosRoutes = require('./routes/cursos');
const notasRoutes = require('./routes/notas');
const inscripcionesRoutes = require('./routes/inscripciones');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/notas', notasRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Ha ocurrido un error en el servidor',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 