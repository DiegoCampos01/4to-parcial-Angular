import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { Usuario } from '../../models/usuario.model';
import { Alumno } from '../../models/alumno.model';
import { Curso } from '../../models/curso.model';
import { Inscripcion } from '../../models/inscripcion.model';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  constructor(private http: HttpClient) {}

  // Método genérico para manejar errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Mantener la aplicación funcionando retornando un resultado vacío/seguro
      return of(result as T);
    };
  }

  // Usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.usuarios}`).pipe(
      catchError(this.handleError<Usuario[]>('getUsuarios', []))
    );
  }

  // Alumnos
  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.alumnos}`).pipe(
      catchError(this.handleError<Alumno[]>('getAlumnos', []))
    );
  }

  // Cursos
  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cursos}`).pipe(
      catchError(this.handleError<Curso[]>('getCursos', []))
    );
  }

  // Inscripciones
  getInscripciones(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.inscripciones}`).pipe(
      catchError(this.handleError<Inscripcion[]>('getInscripciones', []))
    );
  }

  // Métodos para crear registros
  createUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.usuarios}`, usuario).pipe(
      catchError(this.handleError<Usuario>('createUsuario'))
    );
  }

  createAlumno(alumno: Partial<Alumno>): Observable<Alumno> {
    return this.http.post<Alumno>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.alumnos}`, alumno).pipe(
      catchError(this.handleError<Alumno>('createAlumno'))
    );
  }

  createCurso(curso: Partial<Curso>): Observable<Curso> {
    return this.http.post<Curso>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.cursos}`, curso).pipe(
      catchError(this.handleError<Curso>('createCurso'))
    );
  }

  createInscripcion(inscripcion: Partial<Inscripcion>): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.inscripciones}`, inscripcion).pipe(
      catchError(this.handleError<Inscripcion>('createInscripcion'))
    );
  }
} 