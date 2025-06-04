import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiBaseService } from '../core/services/api-base.service';
import { Alumno } from '../models/alumno.model';
import { API_CONFIG } from '../core/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService extends ApiBaseService<Alumno> {
  private readonly STORAGE_KEY = 'alumnos';
  private alumnosSubject = new BehaviorSubject<Alumno[]>([]);

  constructor(http: HttpClient) {
    super(http);
    this.cargarAlumnos();
  }

  protected getEndpoint(): string {
    return API_CONFIG.endpoints.alumnos;
  }

  private cargarAlumnos(): void {
    const alumnosGuardados = localStorage.getItem(this.STORAGE_KEY);
    if (alumnosGuardados) {
      const alumnos = JSON.parse(alumnosGuardados);
      this.alumnosSubject.next(alumnos.map((alumno: any) => ({
        ...alumno,
        fechaNacimiento: new Date(alumno.fechaNacimiento)
      })));
    } else {
      // Datos iniciales si no hay datos guardados
      const alumnosIniciales: Alumno[] = [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com',
          fechaNacimiento: new Date('1995-05-15'),
          cursos: []
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'González',
          email: 'maria@example.com',
          fechaNacimiento: new Date('1998-08-20'),
          cursos: []
        }
      ];
      this.alumnosSubject.next(alumnosIniciales);
      this.guardarAlumnos();
    }
  }

  private guardarAlumnos(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alumnosSubject.value));
  }

  private generarNuevoId(): number {
    const alumnos = this.alumnosSubject.value;
    return alumnos.length > 0 ? Math.max(...alumnos.map(a => a.id)) + 1 : 1;
  }

  getAlumnos(): Observable<Alumno[]> {
    return this.alumnosSubject.asObservable();
  }

  getAlumnoById(id: number): Alumno | undefined {
    return this.alumnosSubject.value.find(alumno => alumno.id === id);
  }

  agregarAlumno(alumno: Omit<Alumno, 'id' | 'cursos'>): void {
    const nuevoAlumno: Alumno = {
      ...alumno,
      id: this.generarNuevoId(),
      cursos: []
    };
    const alumnos = [...this.alumnosSubject.value, nuevoAlumno];
    this.alumnosSubject.next(alumnos);
    this.guardarAlumnos();
  }

  actualizarAlumno(alumno: Alumno): void {
    const alumnos = this.alumnosSubject.value.map(a => 
      a.id === alumno.id ? alumno : a
    );
    this.alumnosSubject.next(alumnos);
    this.guardarAlumnos();
  }

  eliminarAlumno(id: number): void {
    const alumnos = this.alumnosSubject.value.filter(a => a.id !== id);
    this.alumnosSubject.next(alumnos);
    this.guardarAlumnos();
  }

  inscribirEnCurso(alumnoId: number, cursoId: number): void {
    const alumnos = this.alumnosSubject.value.map(alumno => {
      if (alumno.id === alumnoId && !alumno.cursos.includes(cursoId)) {
        return {
          ...alumno,
          cursos: [...alumno.cursos, cursoId]
        };
      }
      return alumno;
    });
    this.alumnosSubject.next(alumnos);
    this.guardarAlumnos();
  }

  desinscribirDeCurso(alumnoId: number, cursoId: number): void {
    const alumnos = this.alumnosSubject.value.map(alumno => {
      if (alumno.id === alumnoId) {
        return {
          ...alumno,
          cursos: alumno.cursos.filter(id => id !== cursoId)
        };
      }
      return alumno;
    });
    this.alumnosSubject.next(alumnos);
    this.guardarAlumnos();
  }

  getAlumnosPorCurso(cursoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${this.baseUrl}?cursoId=${cursoId}`);
  }
} 