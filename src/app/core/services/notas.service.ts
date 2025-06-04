import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Nota {
  id: number;
  alumnoId: number;
  cursoId: number;
  calificacion: number;
  fecha: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  private apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.notas}`;

  constructor(private http: HttpClient) {}

  getNotas(): Observable<Nota[]> {
    return this.http.get<Nota[]>(this.apiUrl).pipe(
      map(notas => notas.map(nota => ({
        ...nota,
        fecha: new Date(nota.fecha)
      })))
    );
  }

  getNotasPorAlumno(alumnoId: number): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${this.apiUrl}?alumnoId=${alumnoId}`).pipe(
      map(notas => notas.map(nota => ({
        ...nota,
        fecha: new Date(nota.fecha)
      })))
    );
  }

  getNotaPorAlumnoYCurso(alumnoId: number, cursoId: number): Observable<Nota | undefined> {
    return this.http.get<Nota[]>(`${this.apiUrl}?alumnoId=${alumnoId}&cursoId=${cursoId}`).pipe(
      map(notas => {
        const nota = notas[0];
        return nota ? { ...nota, fecha: new Date(nota.fecha) } : undefined;
      })
    );
  }

  agregarNota(alumnoId: number, cursoId: number, calificacion: number): Observable<Nota> {
    const nuevaNota = {
      alumnoId,
      cursoId,
      calificacion,
      fecha: new Date()
    };
    return this.http.post<Nota>(this.apiUrl, nuevaNota).pipe(
      map(nota => ({ ...nota, fecha: new Date(nota.fecha) }))
    );
  }

  actualizarNota(id: number, calificacion: number): Observable<Nota> {
    return this.http.patch<Nota>(`${this.apiUrl}/${id}`, { calificacion }).pipe(
      map(nota => ({ ...nota, fecha: new Date(nota.fecha) }))
    );
  }

  eliminarNota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEstadoNota(calificacion: number | null): string {
    if (calificacion === null) return 'Pendiente';
    return calificacion >= 3.0 ? 'APROBADO' : 'REPROBADO';
  }

  getColorNota(calificacion: number | null): string {
    if (calificacion === null) return 'pendiente';
    return calificacion >= 3.0 ? 'aprobado' : 'reprobado';
  }
} 