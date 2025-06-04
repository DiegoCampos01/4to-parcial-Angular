import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inscripcion } from '../models/inscripcion.model';
import { BaseService } from 'src/app/core/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService extends BaseService<Inscripcion> {
  protected override storageKey = 'inscripciones';
  protected override endpoint = 'inscripciones';

  constructor(protected override http: HttpClient) {
    super(http);
    this.initializeService();
  }

  // Métodos específicos para inscripciones
  getInscripcionesPorAlumno(alumnoId: number): Inscripcion[] {
    return this.dataSubject.value.filter(inscripcion => inscripcion.alumnoId === alumnoId);
  }

  getInscripcionesPorCurso(cursoId: number): Inscripcion[] {
    return this.dataSubject.value.filter(inscripcion => inscripcion.cursoId === cursoId);
  }

  async cancelarInscripcion(inscripcionId: number): Promise<void> {
    const inscripcion = this.getById(inscripcionId);
    if (inscripcion) {
      await this.actualizar({
        ...inscripcion,
        estado: 'cancelada'
      });
    }
  }

  async completarInscripcion(inscripcionId: number): Promise<void> {
    const inscripcion = this.getById(inscripcionId);
    if (inscripcion) {
      await this.actualizar({
        ...inscripcion,
        estado: 'completada'
      });
    }
  }
} 