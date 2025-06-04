import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  profesor: string;
  duracion: number;
  alumnos: number[];
  cupo: number;
}

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cursos}`;

  constructor(private http: HttpClient) {}

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  getCursoById(id: number): Observable<Curso | undefined> {
    return this.http.get<Curso>(`${this.apiUrl}/${id}`);
  }

  agregarCurso(curso: Omit<Curso, 'id' | 'alumnos'>): Observable<Curso> {
    const nuevoCurso = {
      ...curso,
      alumnos: []
    };
    return this.http.post<Curso>(this.apiUrl, nuevoCurso);
  }

  actualizarCurso(id: number, curso: Partial<Curso>): Observable<Curso> {
    return this.http.patch<Curso>(`${this.apiUrl}/${id}`, curso);
  }

  eliminarCurso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  inscribirAlumno(cursoId: number, alumnoId: number): Observable<Curso> {
    return this.getCursoById(cursoId).pipe(
      map(curso => {
        if (!curso) throw new Error('Curso no encontrado');
        if (!curso.alumnos.includes(alumnoId)) {
          return {
            ...curso,
            alumnos: [...curso.alumnos, alumnoId]
          };
        }
        return curso;
      }),
      switchMap(curso => this.actualizarCurso(cursoId, { alumnos: curso.alumnos }))
    );
  }

  desinscribirAlumno(cursoId: number, alumnoId: number): Observable<Curso> {
    return this.getCursoById(cursoId).pipe(
      map(curso => {
        if (!curso) throw new Error('Curso no encontrado');
        return {
          ...curso,
          alumnos: curso.alumnos.filter(id => id !== alumnoId)
        };
      }),
      switchMap(curso => this.actualizarCurso(cursoId, { alumnos: curso.alumnos }))
    );
  }

  getCuposDisponibles(curso: Curso): number {
    return curso.cupo - curso.alumnos.length;
  }
} 