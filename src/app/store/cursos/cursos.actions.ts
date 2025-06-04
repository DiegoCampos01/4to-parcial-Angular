import { createAction, props } from '@ngrx/store';
import { Curso } from '../../core/services/cursos.service';

// Cargar cursos
export const loadCursos = createAction(
  '[Cursos] Load Cursos'
);

export const loadCursosSuccess = createAction(
  '[Cursos] Load Cursos Success',
  props<{ cursos: Curso[] }>()
);

export const loadCursosFailure = createAction(
  '[Cursos] Load Cursos Failure',
  props<{ error: string }>()
);

// Obtener curso por ID
export const loadCursoById = createAction(
  '[Cursos] Load Curso By Id',
  props<{ id: number }>()
);

export const loadCursoByIdSuccess = createAction(
  '[Cursos] Load Curso By Id Success',
  props<{ curso: Curso }>()
);

export const loadCursoByIdFailure = createAction(
  '[Cursos] Load Curso By Id Failure',
  props<{ error: string }>()
);

// Crear curso
export const createCurso = createAction(
  '[Cursos] Create Curso',
  props<{ curso: Omit<Curso, 'id' | 'alumnos'> }>()
);

export const createCursoSuccess = createAction(
  '[Cursos] Create Curso Success',
  props<{ curso: Curso }>()
);

export const createCursoFailure = createAction(
  '[Cursos] Create Curso Failure',
  props<{ error: string }>()
);

// Actualizar curso
export const updateCurso = createAction(
  '[Cursos] Update Curso',
  props<{ id: number; curso: Partial<Curso> }>()
);

export const updateCursoSuccess = createAction(
  '[Cursos] Update Curso Success',
  props<{ curso: Curso }>()
);

export const updateCursoFailure = createAction(
  '[Cursos] Update Curso Failure',
  props<{ error: string }>()
);

// Eliminar curso
export const deleteCurso = createAction(
  '[Cursos] Delete Curso',
  props<{ id: number }>()
);

export const deleteCursoSuccess = createAction(
  '[Cursos] Delete Curso Success',
  props<{ id: number }>()
);

export const deleteCursoFailure = createAction(
  '[Cursos] Delete Curso Failure',
  props<{ error: string }>()
);

// Inscribir alumno
export const inscribirAlumno = createAction(
  '[Cursos] Inscribir Alumno',
  props<{ cursoId: number; alumnoId: number }>()
);

export const inscribirAlumnoSuccess = createAction(
  '[Cursos] Inscribir Alumno Success',
  props<{ curso: Curso }>()
);

export const inscribirAlumnoFailure = createAction(
  '[Cursos] Inscribir Alumno Failure',
  props<{ error: string }>()
);

// Desinscribir alumno
export const desinscribirAlumno = createAction(
  '[Cursos] Desinscribir Alumno',
  props<{ cursoId: number; alumnoId: number }>()
);

export const desinscribirAlumnoSuccess = createAction(
  '[Cursos] Desinscribir Alumno Success',
  props<{ curso: Curso }>()
);

export const desinscribirAlumnoFailure = createAction(
  '[Cursos] Desinscribir Alumno Failure',
  props<{ error: string }>()
); 