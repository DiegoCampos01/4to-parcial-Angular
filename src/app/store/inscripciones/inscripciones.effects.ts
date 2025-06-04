import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { InscripcionesService } from '../../services/inscripciones.service';
import * as InscripcionesActions from './inscripciones.actions';

@Injectable()
export class InscripcionesEffects {
  loadInscripciones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InscripcionesActions.loadInscripciones),
      mergeMap(() =>
        this.inscripcionesService.getInscripciones().pipe(
          map(inscripciones => InscripcionesActions.loadInscripcionesSuccess({ inscripciones })),
          catchError(error => of(InscripcionesActions.loadInscripcionesFailure({ error: error.message })))
        )
      )
    )
  );

  desinscribirAlumno$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InscripcionesActions.desinscribirAlumno),
      mergeMap(({ cursoId, alumnoId }) =>
        this.inscripcionesService.desinscribirAlumno(cursoId, alumnoId).pipe(
          map(() => InscripcionesActions.desinscribirAlumnoSuccess({ cursoId, alumnoId })),
          catchError(error => of(InscripcionesActions.desinscribirAlumnoFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private inscripcionesService: InscripcionesService
  ) {}
} 