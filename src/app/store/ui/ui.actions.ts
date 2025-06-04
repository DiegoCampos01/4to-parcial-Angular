import { createAction, props } from '@ngrx/store';

export const setTitle = createAction(
  '[UI] Set Title',
  props<{ title: string }>()
);

export const setLoading = createAction(
  '[UI] Set Loading',
  props<{ loading: boolean }>()
); 