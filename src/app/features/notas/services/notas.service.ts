import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Nota } from '../models/nota.model';
import { BaseService } from 'src/app/core/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class NotasService extends BaseService<Nota> {
  protected override storageKey = 'notas';
  protected override endpoint = 'notas';

  constructor(protected override http: HttpClient) {
    super(http);
    this.initializeService();
  }

  // Métodos específicos para notas
  getNotasPorAlumno(alumnoId: number): Observable<Nota[]> {
    return this.getDatos().pipe(
      map(notas => notas.filter(nota => nota.alumnoId === alumnoId))
    );
  }

  getNotasPorCurso(cursoId: number): Observable<Nota[]> {
    return this.getDatos().pipe(
      map(notas => notas.filter(nota => nota.cursoId === cursoId))
    );
  }

  getNotaPorAlumnoYCurso(alumnoId: number, cursoId: number): Observable<Nota | undefined> {
    return this.getDatos().pipe(
      map(notas => notas.find(nota => 
        nota.alumnoId === alumnoId && nota.cursoId === cursoId
      ))
    );
  }

  async agregarOActualizarNota(alumnoId: number, cursoId: number, calificacion: number): Promise<void> {
    const notaExistente = await this.getNotaPorAlumnoYCurso(alumnoId, cursoId)
      .pipe(map(nota => nota))
      .toPromise();

    if (notaExistente) {
      await this.actualizar({
        ...notaExistente,
        calificacion,
        fecha: new Date()
      });
    } else {
      await this.agregar({
        alumnoId,
        cursoId,
        calificacion,
        fecha: new Date()
      });
    }
  }

  getEstadoNota(calificacion: number): string {
    return calificacion >= 3.0 ? 'APROBADO' : 'REPROBADO';
  }

  getColorNota(calificacion: number): string {
    return calificacion >= 3.0 ? 'success' : 'danger';
  }

  getPromedioAlumno(alumnoId: number): Observable<number> {
    return this.getNotasPorAlumno(alumnoId).pipe(
      map(notas => {
        if (notas.length === 0) return 0;
        const suma = notas.reduce((acc, nota) => acc + nota.calificacion, 0);
        return suma / notas.length;
      })
    );
  }

  getPromedioCurso(cursoId: number): Observable<number> {
    return this.getNotasPorCurso(cursoId).pipe(
      map(notas => {
        if (notas.length === 0) return 0;
        const suma = notas.reduce((acc, nota) => acc + nota.calificacion, 0);
        return suma / notas.length;
      })
    );
  }
} 