import { User } from '../core/services/auth.service';
import { InscripcionesState } from './inscripciones/inscripciones.reducer';

export interface AppState {
  auth: AuthState;
  ui: UiState;
  inscripciones: InscripcionesState;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UiState {
  currentTitle: string;
  loading: boolean;
} 