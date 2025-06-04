import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: Date;
  cursos: number[];
}

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
  private apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.alumnos}`;

  constructor(private http: HttpClient) {}

  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.apiUrl).pipe(
      map(alumnos => alumnos.map(alumno => ({
        ...alumno,
        fechaNacimiento: new Date(alumno.fechaNacimiento)
      })))
    );
  }

  getAlumnoById(id: number): Observable<Alumno | undefined> {
    return this.http.get<Alumno>(`${this.apiUrl}/${id}`).pipe(
      map(alumno => ({
        ...alumno,
        fechaNacimiento: new Date(alumno.fechaNacimiento)
      }))
    );
  }

  agregarAlumno(alumno: Omit<Alumno, 'id'>): Observable<Alumno> {
    return this.http.post<Alumno>(this.apiUrl, alumno).pipe(
      map(nuevoAlumno => ({
        ...nuevoAlumno,
        fechaNacimiento: new Date(nuevoAlumno.fechaNacimiento)
      }))
    );
  }

  actualizarAlumno(id: number, alumno: Partial<Alumno>): Observable<Alumno> {
    return this.http.patch<Alumno>(`${this.apiUrl}/${id}`, alumno).pipe(
      map(alumnoActualizado => ({
        ...alumnoActualizado,
        fechaNacimiento: new Date(alumnoActualizado.fechaNacimiento)
      }))
    );
  }

  eliminarAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  inscribirEnCurso(alumnoId: number, cursoId: number): Observable<Alumno> {
    return this.getAlumnoById(alumnoId).pipe(
      map(alumno => {
        if (!alumno) throw new Error('Alumno no encontrado');
        if (!alumno.cursos.includes(cursoId)) {
          return {
            ...alumno,
            cursos: [...alumno.cursos, cursoId]
          };
        }
        return alumno;
      }),
      switchMap(alumno => this.actualizarAlumno(alumnoId, { cursos: alumno.cursos }))
    );
  }
} 