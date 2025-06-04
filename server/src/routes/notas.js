const express = require('express');
const router = express.Router();

// Base de datos en memoria (temporal)
let notas = [
  {
    id: 1,
    alumnoId: 1,
    cursoId: 1,
    calificacion: 4.5,
    fecha: new Date()
  },
  {
    id: 2,
    alumnoId: 2,
    cursoId: 2,
    calificacion: 3.8,
    fecha: new Date()
  }
];

// GET /api/notas
router.get('/', (req, res) => {
  const { alumnoId, cursoId } = req.query;
  let notasFiltradas = notas;

  if (alumnoId) {
    notasFiltradas = notasFiltradas.filter(n => n.alumnoId === parseInt(alumnoId));
  }

  if (cursoId) {
    notasFiltradas = notasFiltradas.filter(n => n.cursoId === parseInt(cursoId));
  }

  res.json(notasFiltradas);
});

// GET /api/notas/:id
router.get('/:id', (req, res) => {
  const nota = notas.find(n => n.id === parseInt(req.params.id));
  if (!nota) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }
  res.json(nota);
});

// POST /api/notas
router.post('/', (req, res) => {
  const nuevaNota = {
    ...req.body,
    id: notas.length > 0 ? Math.max(...notas.map(n => n.id)) + 1 : 1,
    fecha: new Date()
  };
  notas.push(nuevaNota);
  res.status(201).json(nuevaNota);
});

// PATCH /api/notas/:id
router.patch('/:id', (req, res) => {
  const index = notas.findIndex(n => n.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }

  const notaActualizada = {
    ...notas[index],
    ...req.body,
    id: notas[index].id,
    fecha: new Date()
  };
  
  notas[index] = notaActualizada;
  res.json(notaActualizada);
});

// DELETE /api/notas/:id
router.delete('/:id', (req, res) => {
  const index = notas.findIndex(n => n.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }
  
  notas = notas.filter(n => n.id !== parseInt(req.params.id));
  res.status(204).send();
});

module.exports = router; 