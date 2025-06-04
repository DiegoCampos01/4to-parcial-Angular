import { createFeatureSelector, createSelector } from '@ngrx/store';
import { cursosAdapter } from './cursos.reducer';
import { CursosState, cursosFeatureKey } from './cursos.state';

export const selectCursosState = createFeatureSelector<CursosState>(cursosFeatureKey);

const { selectIds, selectEntities, selectAll, selectTotal } = cursosAdapter.getSelectors();

export const selectAllCursos = createSelector(
  selectCursosState,
  selectAll
);

export const selectCursosEntities = createSelector(
  selectCursosState,
  selectEntities
);

export const selectSelectedCursoId = createSelector(
  selectCursosState,
  (state: CursosState) => state.selectedCursoId
);

export const selectSelectedCurso = createSelector(
  selectCursosEntities,
  selectSelectedCursoId,
  (cursosEntities, selectedId) => selectedId ? cursosEntities[selectedId] : null
);

export const selectCursosLoading = createSelector(
  selectCursosState,
  (state: CursosState) => state.loading
);

export const selectCursosError = createSelector(
  selectCursosState,
  (state: CursosState) => state.error
);

export const selectLastUpdated = createSelector(
  selectCursosState,
  (state: CursosState) => state.lastUpdated
);

export const selectFiltroActivo = createSelector(
  selectCursosState,
  (state: CursosState) => state.filtroActivo
);

export const selectCursosFiltrados = createSelector(
  selectAllCursos,
  selectFiltroActivo,
  (cursos, filtro) => {
    if (!filtro) return cursos;
    return cursos.filter(curso => 
      curso.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  }
);

// Selector para obtener los cursos con cupos disponibles
export const selectCursosConCuposDisponibles = createSelector(
  selectAllCursos,
  (cursos) => cursos.filter(curso => curso.alumnos.length < curso.cupo)
);

// Selector para obtener los cursos de un alumno
export const selectCursosDeAlumno = (alumnoId: number) => createSelector(
  selectAllCursos,
  (cursos) => cursos.filter(curso => curso.alumnos.includes(alumnoId))
); 