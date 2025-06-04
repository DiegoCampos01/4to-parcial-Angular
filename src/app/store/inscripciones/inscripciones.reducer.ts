import { createReducer, on } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Inscripcion } from '../../shared/models/inscripcion.model';
import * as InscripcionesActions from './inscripciones.actions';

export interface InscripcionesState extends EntityState<Inscripcion> {
  loading: boolean;
  error: string | null;
}

export const inscripcionesAdapter = createEntityAdapter<Inscripcion>();

export const initialState: InscripcionesState = inscripcionesAdapter.getInitialState({
  loading: false,
  error: null
});

export const inscripcionesReducer = createReducer(
  initialState,
  on(InscripcionesActions.loadInscripciones, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(InscripcionesActions.loadInscripcionesSuccess, (state, { inscripciones }) => 
    inscripcionesAdapter.setAll(inscripciones, {
      ...state,
      loading: false
    })
  ),
  on(InscripcionesActions.loadInscripcionesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(InscripcionesActions.desinscribirAlumnoSuccess, (state, { cursoId, alumnoId }) => {
    // Encontrar la inscripción que coincida con el cursoId y alumnoId
    const inscripcionAEliminar = Object.values(state.entities)
      .find(inscripcion => 
        inscripcion?.cursoId === cursoId && 
        inscripcion?.alumnoId === alumnoId
      );

    if (inscripcionAEliminar) {
      // Si encontramos la inscripción, la eliminamos usando su ID
      return inscripcionesAdapter.removeOne(inscripcionAEliminar.id, state);
    }
    
    // Si no encontramos la inscripción, devolvemos el estado sin cambios
    return state;
  })
); 