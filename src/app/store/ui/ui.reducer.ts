import { createReducer, on } from '@ngrx/store';
import { UiState } from '../app.state';
import * as UiActions from './ui.actions';

export const initialState: UiState = {
  currentTitle: '',
  loading: false
};

export const uiReducer = createReducer(
  initialState,
  on(UiActions.setTitle, (state, { title }) => ({
    ...state,
    currentTitle: title
  })),
  on(UiActions.setLoading, (state, { loading }) => ({
    ...state,
    loading
  }))
); 