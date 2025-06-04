import { EntityState } from '@ngrx/entity';
import { Curso } from '../../models/curso.model';

export interface CursosState extends EntityState<Curso> {
  selectedCursoId: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  filtroActivo: string | null;
}

export const cursosFeatureKey = 'cursos'; 