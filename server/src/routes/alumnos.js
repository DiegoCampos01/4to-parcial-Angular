const express = require('express');
const router = express.Router();

// Base de datos en memoria (temporal)
let alumnos = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@example.com',
    fechaNacimiento: new Date('1995-05-15'),
    cursos: []
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    email: 'maria@example.com',
    fechaNacimiento: new Date('2001-05-14'),
    cursos: []
  }
];

// GET /api/alumnos
router.get('/', (req, res) => {
  res.json(alumnos);
});

// GET /api/alumnos/:id
router.get('/:id', (req, res) => {
  const alumno = alumnos.find(a => a.id === parseInt(req.params.id));
  if (!alumno) {
    return res.status(404).json({ error: 'Alumno no encontrado' });
  }
  res.json(alumno);
});

// POST /api/alumnos
router.post('/', (req, res) => {
  const nuevoAlumno = {
    ...req.body,
    id: alumnos.length > 0 ? Math.max(...alumnos.map(a => a.id)) + 1 : 1,
    cursos: req.body.cursos || [],
    fechaNacimiento: new Date(req.body.fechaNacimiento)
  };
  alumnos.push(nuevoAlumno);
  res.status(201).json(nuevoAlumno);
});

// PATCH /api/alumnos/:id
router.patch('/:id', (req, res) => {
  const index = alumnos.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Alumno no encontrado' });
  }

  const alumnoActualizado = {
    ...alumnos[index],
    ...req.body,
    id: alumnos[index].id,
    fechaNacimiento: req.body.fechaNacimiento ? new Date(req.body.fechaNacimiento) : alumnos[index].fechaNacimiento
  };
  
  alumnos[index] = alumnoActualizado;
  res.json(alumnoActualizado);
});

// DELETE /api/alumnos/:id
router.delete('/:id', (req, res) => {
  const index = alumnos.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Alumno no encontrado' });
  }
  
  alumnos = alumnos.filter(a => a.id !== parseInt(req.params.id));
  res.status(204).send();
});

module.exports = router; 