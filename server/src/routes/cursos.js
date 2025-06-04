const express = require('express');
const router = express.Router();

// Base de datos en memoria (temporal)
let cursos = [
  {
    id: 1,
    nombre: 'Matemáticas Avanzadas',
    descripcion: 'Curso avanzado de matemáticas',
    profesor: 'Dr. García',
    duracion: 60,
    alumnos: [],
    cupo: 30
  },
  {
    id: 2,
    nombre: 'Programación Web',
    descripcion: 'Desarrollo web moderno',
    profesor: 'Ing. Martínez',
    duracion: 40,
    alumnos: [],
    cupo: 30
  }
];

// GET /api/cursos
router.get('/', (req, res) => {
  res.json(cursos);
});

// GET /api/cursos/:id
router.get('/:id', (req, res) => {
  const curso = cursos.find(c => c.id === parseInt(req.params.id));
  if (!curso) {
    return res.status(404).json({ error: 'Curso no encontrado' });
  }
  res.json(curso);
});

// POST /api/cursos
router.post('/', (req, res) => {
  const nuevoCurso = {
    ...req.body,
    id: cursos.length > 0 ? Math.max(...cursos.map(c => c.id)) + 1 : 1,
    alumnos: [],
    cupo: req.body.cupo || 30
  };
  cursos.push(nuevoCurso);
  res.status(201).json(nuevoCurso);
});

// PATCH /api/cursos/:id
router.patch('/:id', (req, res) => {
  const index = cursos.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Curso no encontrado' });
  }

  const cursoActualizado = {
    ...cursos[index],
    ...req.body,
    id: cursos[index].id,
    cupo: req.body.cupo || cursos[index].cupo
  };
  
  cursos[index] = cursoActualizado;
  res.json(cursoActualizado);
});

// DELETE /api/cursos/:id
router.delete('/:id', (req, res) => {
  const index = cursos.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Curso no encontrado' });
  }
  
  cursos = cursos.filter(c => c.id !== parseInt(req.params.id));
  res.status(204).send();
});

module.exports = router; 