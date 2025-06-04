import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UiState } from '../app.state';

export const selectUiState = createFeatureSelector<UiState>('ui');

export const selectCurrentTitle = createSelector(
  selectUiState,
  (state: UiState) => state.currentTitle
);

export const selectUiLoading = createSelector(
  selectUiState,
  (state: UiState) => state.loading
); 