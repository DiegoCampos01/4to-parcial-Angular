import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Curso } from '../../core/services/cursos.service';
import * as CursosActions from './cursos.actions';

export interface CursosState extends EntityState<Curso> {
  selectedCursoId: number | null;
  loading: boolean;
  error: string | null;
}

export const cursosAdapter: EntityAdapter<Curso> = createEntityAdapter<Curso>();

export const initialState: CursosState = cursosAdapter.getInitialState({
  selectedCursoId: null,
  loading: false,
  error: null
});

export const cursosReducer = createReducer(
  initialState,
  
  // Load Cursos
  on(CursosActions.loadCursos, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CursosActions.loadCursosSuccess, (state, { cursos }) => 
    cursosAdapter.setAll(cursos, {
      ...state,
      loading: false
    })
  ),
  
  on(CursosActions.loadCursosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Curso by ID
  on(CursosActions.loadCursoById, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CursosActions.loadCursoByIdSuccess, (state, { curso }) => 
    cursosAdapter.upsertOne(curso, {
      ...state,
      selectedCursoId: curso.id,
      loading: false
    })
  ),

  on(CursosActions.loadCursoByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Curso
  on(CursosActions.createCurso, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CursosActions.createCursoSuccess, (state, { curso }) =>
    cursosAdapter.addOne(curso, {
      ...state,
      loading: false
    })
  ),

  on(CursosActions.createCursoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Curso
  on(CursosActions.updateCurso, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CursosActions.updateCursoSuccess, (state, { curso }) =>
    cursosAdapter.updateOne(
      { id: curso.id, changes: curso },
      {
        ...state,
        loading: false
      }
    )
  ),

  on(CursosActions.updateCursoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Curso
  on(CursosActions.deleteCurso, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CursosActions.deleteCursoSuccess, (state, { id }) =>
    cursosAdapter.removeOne(id, {
      ...state,
      loading: false
    })
  ),

  on(CursosActions.deleteCursoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Inscribir Alumno
  on(CursosActions.inscribirAlumno, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CursosActions.inscribirAlumnoSuccess, (state, { curso }) =>
    cursosAdapter.updateOne(
      { id: curso.id, changes: curso },
      {
        ...state,
        loading: false
      }
    )
  ),

  on(CursosActions.inscribirAlumnoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Desinscribir Alumno
  on(CursosActions.desinscribirAlumno, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CursosActions.desinscribirAlumnoSuccess, (state, { curso }) =>
    cursosAdapter.updateOne(
      { id: curso.id, changes: curso },
      {
        ...state,
        loading: false
      }
    )
  ),

  on(CursosActions.desinscribirAlumnoFailure, (state, { error }) => ({
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
} = cursosAdapter.getSelectors(); 