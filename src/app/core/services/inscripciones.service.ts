import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Inscripcion {
  id: number;
  cursoId: number;
  alumnoId: number;
  fechaInscripcion: Date;
}

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {
  private apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.inscripciones}`;

  constructor(private http: HttpClient) {}

  getInscripciones(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(this.apiUrl).pipe(
      map(inscripciones => inscripciones.map(inscripcion => ({
        ...inscripcion,
        fechaInscripcion: new Date(inscripcion.fechaInscripcion)
      })))
    );
  }

  getInscripcionesPorAlumno(alumnoId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.apiUrl}?alumnoId=${alumnoId}`).pipe(
      map(inscripciones => inscripciones.map(inscripcion => ({
        ...inscripcion,
        fechaInscripcion: new Date(inscripcion.fechaInscripcion)
      })))
    );
  }

  getInscripcionesPorCurso(cursoId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.apiUrl}?cursoId=${cursoId}`).pipe(
      map(inscripciones => inscripciones.map(inscripcion => ({
        ...inscripcion,
        fechaInscripcion: new Date(inscripcion.fechaInscripcion)
      })))
    );
  }

  inscribirAlumno(cursoId: number, alumnoId: number): Observable<Inscripcion> {
    const nuevaInscripcion = {
      cursoId,
      alumnoId,
      fechaInscripcion: new Date()
    };
    return this.http.post<Inscripcion>(this.apiUrl, nuevaInscripcion).pipe(
      map(inscripcion => ({
        ...inscripcion,
        fechaInscripcion: new Date(inscripcion.fechaInscripcion)
      }))
    );
  }

  eliminarInscripcion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  estaInscrito(cursoId: number, alumnoId: number): Observable<boolean> {
    return this.http.get<Inscripcion[]>(`${this.apiUrl}?cursoId=${cursoId}&alumnoId=${alumnoId}`).pipe(
      map(inscripciones => inscripciones.length > 0)
    );
  }
} 