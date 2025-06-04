import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, concatMap } from 'rxjs/operators';
import { AlumnosService } from '../../core/services/alumnos.service';
import * as AlumnosActions from './alumnos.actions';

@Injectable()
export class AlumnosEffects {
  loadAlumnos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlumnosActions.loadAlumnos),
      mergeMap(() =>
        this.alumnosService.getAlumnos().pipe(
          map(alumnos => AlumnosActions.loadAlumnosSuccess({ alumnos })),
          catchError(error => of(AlumnosActions.loadAlumnosFailure({ error: error.message })))
        )
      )
    )
  );

  loadAlumnoById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlumnosActions.loadAlumnoById),
      mergeMap(({ id }) =>
        this.alumnosService.getAlumnoById(id).pipe(
          map(alumno => {
            if (!alumno) throw new Error('Alumno no encontrado');
            return AlumnosActions.loadAlumnoByIdSuccess({ alumno });
          }),
          catchError(error => of(AlumnosActions.loadAlumnoByIdFailure({ error: error.message })))
        )
      )
    )
  );

  createAlumno$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlumnosActions.createAlumno),
      concatMap(({ alumno }) =>
        this.alumnosService.agregarAlumno(alumno).pipe(
          map(nuevoAlumno => AlumnosActions.createAlumnoSuccess({ alumno: nuevoAlumno })),
          catchError(error => of(AlumnosActions.createAlumnoFailure({ error: error.message })))
        )
      )
    )
  );

  updateAlumno$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlumnosActions.updateAlumno),
      concatMap(({ id, alumno }) =>
        this.alumnosService.actualizarAlumno(id, alumno).pipe(
          map(alumnoActualizado => AlumnosActions.updateAlumnoSuccess({ alumno: alumnoActualizado })),
          catchError(error => of(AlumnosActions.updateAlumnoFailure({ error: error.message })))
        )
      )
    )
  );

  deleteAlumno$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlumnosActions.deleteAlumno),
      mergeMap(({ id }) =>
        this.alumnosService.eliminarAlumno(id).pipe(
          map(() => AlumnosActions.deleteAlumnoSuccess({ id })),
          catchError(error => of(AlumnosActions.deleteAlumnoFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private alumnosService: AlumnosService
  ) {}
} 