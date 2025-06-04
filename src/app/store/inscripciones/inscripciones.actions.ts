import { createAction, props } from '@ngrx/store';
import { Inscripcion } from '../../shared/models/inscripcion.model';

export const loadInscripciones = createAction(
  '[Inscripciones] Load Inscripciones'
);

export const loadInscripcionesSuccess = createAction(
  '[Inscripciones] Load Inscripciones Success',
  props<{ inscripciones: Inscripcion[] }>()
);

export const loadInscripcionesFailure = createAction(
  '[Inscripciones] Load Inscripciones Failure',
  props<{ error: string }>()
);

export const desinscribirAlumno = createAction(
  '[Inscripciones] Desinscribir Alumno',
  props<{ cursoId: number; alumnoId: number }>()
);

export const desinscribirAlumnoSuccess = createAction(
  '[Inscripciones] Desinscribir Alumno Success',
  props<{ cursoId: number; alumnoId: number }>()
);

export const desinscribirAlumnoFailure = createAction(
  '[Inscripciones] Desinscribir Alumno Failure',
  props<{ error: string }>()
); 