const express = require('express');
const router = express.Router();

// Base de datos en memoria (temporal)
let inscripciones = [
  {
    id: 1,
    cursoId: 1,
    alumnoId: 1,
    fechaInscripcion: new Date()
  },
  {
    id: 2,
    cursoId: 2,
    alumnoId: 2,
    fechaInscripcion: new Date()
  }
];

// GET /api/inscripciones
router.get('/', (req, res) => {
  const { alumnoId, cursoId } = req.query;
  let inscripcionesFiltradas = inscripciones;

  if (alumnoId) {
    inscripcionesFiltradas = inscripcionesFiltradas.filter(i => i.alumnoId === parseInt(alumnoId));
  }

  if (cursoId) {
    inscripcionesFiltradas = inscripcionesFiltradas.filter(i => i.cursoId === parseInt(cursoId));
  }

  res.json(inscripcionesFiltradas);
});

// GET /api/inscripciones/:id
router.get('/:id', (req, res) => {
  const inscripcion = inscripciones.find(i => i.id === parseInt(req.params.id));
  if (!inscripcion) {
    return res.status(404).json({ error: 'Inscripción no encontrada' });
  }
  res.json(inscripcion);
});

// POST /api/inscripciones
router.post('/', (req, res) => {
  const nuevaInscripcion = {
    ...req.body,
    id: inscripciones.length > 0 ? Math.max(...inscripciones.map(i => i.id)) + 1 : 1,
    fechaInscripcion: new Date()
  };
  inscripciones.push(nuevaInscripcion);
  res.status(201).json(nuevaInscripcion);
});

// DELETE /api/inscripciones/:id
router.delete('/:id', (req, res) => {
  const index = inscripciones.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Inscripción no encontrada' });
  }
  
  inscripciones = inscripciones.filter(i => i.id !== parseInt(req.params.id));
  res.status(204).send();
});

module.exports = router; 