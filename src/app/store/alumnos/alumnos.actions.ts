import { createAction, props } from '@ngrx/store';
import { Alumno } from '../../core/services/alumnos.service';

// Cargar alumnos
export const loadAlumnos = createAction(
  '[Alumnos] Load Alumnos'
);

export const loadAlumnosSuccess = createAction(
  '[Alumnos] Load Alumnos Success',
  props<{ alumnos: Alumno[] }>()
);

export const loadAlumnosFailure = createAction(
  '[Alumnos] Load Alumnos Failure',
  props<{ error: string }>()
);

// Obtener alumno por ID
export const loadAlumnoById = createAction(
  '[Alumnos] Load Alumno By Id',
  props<{ id: number }>()
);

export const loadAlumnoByIdSuccess = createAction(
  '[Alumnos] Load Alumno By Id Success',
  props<{ alumno: Alumno }>()
);

export const loadAlumnoByIdFailure = createAction(
  '[Alumnos] Load Alumno By Id Failure',
  props<{ error: string }>()
);

// Crear alumno
export const createAlumno = createAction(
  '[Alumnos] Create Alumno',
  props<{ alumno: Omit<Alumno, 'id'> }>()
);

export const createAlumnoSuccess = createAction(
  '[Alumnos] Create Alumno Success',
  props<{ alumno: Alumno }>()
);

export const createAlumnoFailure = createAction(
  '[Alumnos] Create Alumno Failure',
  props<{ error: string }>()
);

// Actualizar alumno
export const updateAlumno = createAction(
  '[Alumnos] Update Alumno',
  props<{ id: number; alumno: Partial<Alumno> }>()
);

export const updateAlumnoSuccess = createAction(
  '[Alumnos] Update Alumno Success',
  props<{ alumno: Alumno }>()
);

export const updateAlumnoFailure = createAction(
  '[Alumnos] Update Alumno Failure',
  props<{ error: string }>()
);

// Eliminar alumno
export const deleteAlumno = createAction(
  '[Alumnos] Delete Alumno',
  props<{ id: number }>()
);

export const deleteAlumnoSuccess = createAction(
  '[Alumnos] Delete Alumno Success',
  props<{ id: number }>()
);

export const deleteAlumnoFailure = createAction(
  '[Alumnos] Delete Alumno Failure',
  props<{ error: string }>()
); 