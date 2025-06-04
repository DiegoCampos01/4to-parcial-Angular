import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alumno } from '../models/alumno.model';
import { environment } from 'src/environments/environment';
import { BaseService } from 'src/app/core/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService extends BaseService<Alumno> {
  protected override storageKey = 'alumnos';
  protected override endpoint = 'alumnos';

  constructor(protected override http: HttpClient) {
    super(http);
    this.initializeService();
  }

  private readonly API_URL = `${environment.apiUrl}/alumnos`;
  private alumnosSubject = new BehaviorSubject<Alumno[]>([]);
  alumnos$ = this.alumnosSubject.asObservable();

  private async cargarAlumnos(): Promise<void> {
    try {
      const alumnos = await this.http.get<Alumno[]>(this.API_URL).toPromise();
      this.alumnosSubject.next(alumnos || []);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
      // Fallback a localStorage
      const alumnosGuardados = localStorage.getItem('alumnos');
      if (alumnosGuardados) {
        this.alumnosSubject.next(JSON.parse(alumnosGuardados));
      }
    }
  }

  async agregarAlumno(alumno: Omit<Alumno, 'id'>): Promise<void> {
    try {
      const nuevoAlumno = await this.http.post<Alumno>(this.API_URL, alumno).toPromise();
      if (nuevoAlumno) {
        const alumnosActuales = this.alumnosSubject.value;
        this.alumnosSubject.next([...alumnosActuales, nuevoAlumno]);
      }
    } catch (error) {
      console.error('Error al agregar alumno:', error);
      throw error;
    }
  }

  async actualizarAlumno(alumno: Alumno): Promise<void> {
    try {
      await this.http.put(`${this.API_URL}/${alumno.id}`, alumno).toPromise();
      const alumnosActuales = this.alumnosSubject.value;
      const index = alumnosActuales.findIndex(a => a.id === alumno.id);
      if (index !== -1) {
        alumnosActuales[index] = alumno;
        this.alumnosSubject.next([...alumnosActuales]);
      }
    } catch (error) {
      console.error('Error al actualizar alumno:', error);
      throw error;
    }
  }

  async eliminarAlumno(id: number): Promise<void> {
    try {
      await this.http.delete(`${this.API_URL}/${id}`).toPromise();
      const alumnosActuales = this.alumnosSubject.value;
      this.alumnosSubject.next(alumnosActuales.filter(alumno => alumno.id !== id));
    } catch (error) {
      console.error('Error al eliminar alumno:', error);
      throw error;
    }
  }

  getAlumnos(): Observable<Alumno[]> {
    return this.alumnos$;
  }

  getAlumnoPorId(id: number): Alumno | undefined {
    return this.alumnosSubject.value.find(alumno => alumno.id === id);
  }

  getAlumnosPorCurso(cursoId: number): Alumno[] {
    return this.dataSubject.value.filter(alumno => 
      // Aquí necesitarías acceder a las inscripciones para filtrar
      // Este es solo un ejemplo
      true // Implementar la lógica real
    );
  }
} 