import { createFeatureSelector, createSelector } from '@ngrx/store';
import { inscripcionesAdapter } from './inscripciones.reducer';
import { InscripcionesState, inscripcionesFeatureKey } from './inscripciones.state';

export const selectInscripcionesState = createFeatureSelector<InscripcionesState>(inscripcionesFeatureKey);

const { selectIds, selectEntities, selectAll, selectTotal } = inscripcionesAdapter.getSelectors();

export const selectAllInscripciones = createSelector(
  selectInscripcionesState,
  selectAll
);

export const selectInscripcionesEntities = createSelector(
  selectInscripcionesState,
  selectEntities
);

export const selectSelectedInscripcionId = createSelector(
  selectInscripcionesState,
  (state: InscripcionesState) => state.selectedInscripcionId
);

export const selectSelectedInscripcion = createSelector(
  selectInscripcionesEntities,
  selectSelectedInscripcionId,
  (inscripcionesEntities, selectedId) => selectedId ? inscripcionesEntities[selectedId] : null
);

export const selectInscripcionesLoading = createSelector(
  selectInscripcionesState,
  (state: InscripcionesState) => state.loading
);

export const selectInscripcionesError = createSelector(
  selectInscripcionesState,
  (state: InscripcionesState) => state.error
);

export const selectLastUpdated = createSelector(
  selectInscripcionesState,
  (state: InscripcionesState) => state.lastUpdated
);

export const selectFiltros = createSelector(
  selectInscripcionesState,
  (state: InscripcionesState) => state.filtros
);

export const selectInscripcionesFiltradas = createSelector(
  selectAllInscripciones,
  selectFiltros,
  (inscripciones, filtros) => {
    return inscripciones.filter(inscripcion => {
      if (filtros.cursoId && inscripcion.cursoId !== filtros.cursoId) return false;
      if (filtros.alumnoId && inscripcion.alumnoId !== filtros.alumnoId) return false;
      return true;
    });
  }
);

export const selectInscripcionesPorCurso = (cursoId: number) => createSelector(
  selectAllInscripciones,
  (inscripciones) => inscripciones.filter(inscripcion => inscripcion.cursoId === cursoId)
);

export const selectInscripcionesPorAlumno = (alumnoId: number) => createSelector(
  selectAllInscripciones,
  (inscripciones) => inscripciones.filter(inscripcion => inscripcion.alumnoId === alumnoId)
); 