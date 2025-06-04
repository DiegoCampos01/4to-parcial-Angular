export interface Inscripcion {
  id: number;
  alumnoId: number;
  cursoId: number;
  fechaInscripcion: Date | string;
  estado: 'activa' | 'cancelada';
} 