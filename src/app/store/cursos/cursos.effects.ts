import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, concatMap } from 'rxjs/operators';
import { CursosService } from '../../core/services/cursos.service';
import * as CursosActions from './cursos.actions';

@Injectable()
export class CursosEffects {
  loadCursos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CursosActions.loadCursos),
      mergeMap(() =>
        this.cursosService.getCursos().pipe(
          map(cursos => CursosActions.loadCursosSuccess({ cursos })),
          catchError(error => of(CursosActions.loadCursosFailure({ error: error.message })))
        )
      )
    )
  );

  loadCursoById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CursosActions.loadCursoById),
      mergeMap(({ id }) =>
        this.cursosService.getCursoById(id).pipe(
          map(curso => {
            if (!curso) throw new Error('Curso no encontrado');
            return CursosActions.loadCursoByIdSuccess({ curso });
          }),
          catchError(error => of(CursosActions.loadCursoByIdFailure({ error: error.message })))
        )
      )
    )
  );

  createCurso$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CursosActions.createCurso),
      concatMap(({ curso }) =>
        this.cursosService.agregarCurso(curso).pipe(
          map(nuevoCurso => CursosActions.createCursoSuccess({ curso: nuevoCurso })),
          catchError(error => of(CursosActions.createCursoFailure({ error: error.message })))
        )
      )
    )
  );

  updateCurso$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CursosActions.updateCurso),
      concatMap(({ id, curso }) =>
        this.cursosService.actualizarCurso(id, curso).pipe(
          map(cursoActualizado => CursosActions.updateCursoSuccess({ curso: cursoActualizado })),
          catchError(error => of(CursosActions.updateCursoFailure({ error: error.message })))
        )
      )
    )
  );

  deleteCurso$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CursosActions.deleteCurso),
      mergeMap(({ id }) =>
        this.cursosService.eliminarCurso(id).pipe(
          map(() => CursosActions.deleteCursoSuccess({ id })),
          catchError(error => of(CursosActions.deleteCursoFailure({ error: error.message })))
        )
      )
    )
  );

  inscribirAlumno$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CursosActions.inscribirAlumno),
      concatMap(({ cursoId, alumnoId }) =>
        this.cursosService.inscribirAlumno(cursoId, alumnoId).pipe(
          map(curso => CursosActions.inscribirAlumnoSuccess({ curso })),
          catchError(error => of(CursosActions.inscribirAlumnoFailure({ error: error.message })))
        )
      )
    )
  );

  desinscribirAlumno$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CursosActions.desinscribirAlumno),
      concatMap(({ cursoId, alumnoId }) =>
        this.cursosService.desinscribirAlumno(cursoId, alumnoId).pipe(
          map(curso => CursosActions.desinscribirAlumnoSuccess({ curso })),
          catchError(error => of(CursosActions.desinscribirAlumnoFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private cursosService: CursosService
  ) {}
} 