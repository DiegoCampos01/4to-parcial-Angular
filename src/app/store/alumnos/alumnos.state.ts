import { EntityState } from '@ngrx/entity';
import { Alumno } from '../../core/services/alumnos.service';

export interface AlumnosState extends EntityState<Alumno> {
  selectedAlumnoId: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const alumnosFeatureKey = 'alumnos'; 