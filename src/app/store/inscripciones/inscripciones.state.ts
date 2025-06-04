import { EntityState } from '@ngrx/entity';
import { Inscripcion } from '../../shared/models/inscripcion.model';

export interface InscripcionesState extends EntityState<Inscripcion> {
  selectedInscripcionId: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  filtros: {
    cursoId?: number;
    alumnoId?: number;
  };
}

export const inscripcionesFeatureKey = 'inscripciones'; 