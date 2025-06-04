import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, of } from 'rxjs';
import { Curso } from '../models/curso.model';
import { CursosService } from './cursos.service';
import { AlumnosService } from './alumnos.service';
import { NotasService } from './notas.service';
import { Inscripcion } from '../shared/models/inscripcion.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {
  private readonly STORAGE_KEY = 'inscripciones';
  private inscripcionesSubject = new BehaviorSubject<Inscripcion[]>([]);
  private apiUrl = `${environment.apiUrl}/inscripciones`;

  constructor(
    private cursosService: CursosService,
    private alumnosService: AlumnosService,
    private notasService: NotasService,
    private http: HttpClient
  ) {
    this.cargarInscripciones();
  }

  private cargarInscripciones(): void {
    const inscripcionesGuardadas = localStorage.getItem(this.STORAGE_KEY);
    if (inscripcionesGuardadas) {
      const inscripciones = JSON.parse(inscripcionesGuardadas);
      this.inscripcionesSubject.next(inscripciones);
    }
  }

  private guardarInscripciones(inscripciones: Inscripcion[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(inscripciones));
    this.inscripcionesSubject.next(inscripciones);
  }

  private generarNuevoId(): number {
    const inscripciones = this.inscripcionesSubject.value;
    return inscripciones.length > 0 ? Math.max(...inscripciones.map(i => i.id)) + 1 : 1;
  }

  getInscripciones(): Observable<Inscripcion[]> {
    return this.inscripcionesSubject.asObservable();
  }

  getInscripcionesPorAlumno(alumnoId: number): Observable<Inscripcion[]> {
    return this.inscripcionesSubject.pipe(
      map(inscripciones => inscripciones.filter(i => i.alumnoId === alumnoId))
    );
  }

  getInscripcionesPorCurso(cursoId: number): Observable<Inscripcion[]> {
    return this.inscripcionesSubject.pipe(
      map(inscripciones => inscripciones.filter(i => i.cursoId === cursoId))
    );
  }

  inscribirAlumno(cursoId: number, alumnoId: number): Observable<void> {
    const nuevaInscripcion: Inscripcion = {
      id: this.generarNuevoId(),
      cursoId,
      alumnoId,
      fechaInscripcion: new Date(),
      estado: 'activa'
    };

    const inscripciones = [...this.inscripcionesSubject.value, nuevaInscripcion];
    this.guardarInscripciones(inscripciones);
    
    this.cursosService.agregarAlumno(cursoId, alumnoId);
    this.alumnosService.inscribirEnCurso(alumnoId, cursoId);
    
    // Crear nota inicial
    this.notasService.guardarNota({
      alumnoId,
      cursoId,
      calificacion: 0 // Calificación inicial
    });

    return of(void 0);
  }

  desinscribirAlumno(cursoId: number, alumnoId: number): Observable<void> {
    const inscripciones = this.inscripcionesSubject.value;
    const nuevasInscripciones = inscripciones.filter(
      i => !(i.cursoId === cursoId && i.alumnoId === alumnoId)
    );
    
    this.guardarInscripciones(nuevasInscripciones);
    
    this.cursosService.removerAlumno(cursoId, alumnoId);
    this.alumnosService.desinscribirDeCurso(alumnoId, cursoId);
    
    // Eliminar la nota asociada
    this.notasService.eliminarNota(alumnoId, cursoId);

    return of(void 0);
  }

  estaInscrito(cursoId: number, alumnoId: number): Observable<boolean> {
    return this.inscripcionesSubject.pipe(
      map(inscripciones => inscripciones.some(
        i => i.cursoId === cursoId && i.alumnoId === alumnoId
      ))
    );
  }
} 