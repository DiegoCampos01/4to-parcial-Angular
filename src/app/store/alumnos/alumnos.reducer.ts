import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Alumno } from '../../core/services/alumnos.service';
import * as AlumnosActions from './alumnos.actions';

export interface AlumnosState extends EntityState<Alumno> {
  selectedAlumnoId: number | null;
  loading: boolean;
  error: string | null;
}

export const alumnosAdapter: EntityAdapter<Alumno> = createEntityAdapter<Alumno>();

export const initialState: AlumnosState = alumnosAdapter.getInitialState({
  selectedAlumnoId: null,
  loading: false,
  error: null
});

export const alumnosReducer = createReducer(
  initialState,
  
  // Load Alumnos
  on(AlumnosActions.loadAlumnos, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AlumnosActions.loadAlumnosSuccess, (state, { alumnos }) => 
    alumnosAdapter.setAll(alumnos, {
      ...state,
      loading: false
    })
  ),
  
  on(AlumnosActions.loadAlumnosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Alumno by ID
  on(AlumnosActions.loadAlumnoById, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AlumnosActions.loadAlumnoByIdSuccess, (state, { alumno }) => 
    alumnosAdapter.upsertOne(alumno, {
      ...state,
      selectedAlumnoId: alumno.id,
      loading: false
    })
  ),

  on(AlumnosActions.loadAlumnoByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Alumno
  on(AlumnosActions.createAlumno, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AlumnosActions.createAlumnoSuccess, (state, { alumno }) =>
    alumnosAdapter.addOne(alumno, {
      ...state,
      loading: false
    })
  ),

  on(AlumnosActions.createAlumnoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Alumno
  on(AlumnosActions.updateAlumno, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AlumnosActions.updateAlumnoSuccess, (state, { alumno }) =>
    alumnosAdapter.updateOne(
      { id: alumno.id, changes: alumno },
      {
        ...state,
        loading: false
      }
    )
  ),

  on(AlumnosActions.updateAlumnoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Alumno
  on(AlumnosActions.deleteAlumno, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AlumnosActions.deleteAlumnoSuccess, (state, { id }) =>
    alumnosAdapter.removeOne(id, {
      ...state,
      loading: false
    })
  ),

  on(AlumnosActions.deleteAlumnoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

// Selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = alumnosAdapter.getSelectors(); 