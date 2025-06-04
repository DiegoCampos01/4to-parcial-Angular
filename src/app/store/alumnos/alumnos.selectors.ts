import { createFeatureSelector, createSelector } from '@ngrx/store';
import { alumnosAdapter } from './alumnos.reducer';
import { AlumnosState, alumnosFeatureKey } from './alumnos.state';

export const selectAlumnosState = createFeatureSelector<AlumnosState>(alumnosFeatureKey);

const { selectIds, selectEntities, selectAll, selectTotal } = alumnosAdapter.getSelectors();

export const selectAllAlumnos = createSelector(
  selectAlumnosState,
  selectAll
);

export const selectAlumnosEntities = createSelector(
  selectAlumnosState,
  selectEntities
);

export const selectSelectedAlumnoId = createSelector(
  selectAlumnosState,
  (state: AlumnosState) => state.selectedAlumnoId
);

export const selectSelectedAlumno = createSelector(
  selectAlumnosEntities,
  selectSelectedAlumnoId,
  (alumnosEntities, selectedId) => selectedId ? alumnosEntities[selectedId] : null
);

export const selectAlumnosLoading = createSelector(
  selectAlumnosState,
  (state: AlumnosState) => state.loading
);

export const selectAlumnosError = createSelector(
  selectAlumnosState,
  (state: AlumnosState) => state.error
);

export const selectLastUpdated = createSelector(
  selectAlumnosState,
  (state: AlumnosState) => state.lastUpdated
); 