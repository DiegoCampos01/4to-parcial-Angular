import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NotasService, Nota } from '../../../../core/services/notas.service';
import { AlumnosService, Alumno } from '../../../../core/services/alumnos.service';
import { CursosService, Curso } from '../../../../core/services/cursos.service';
import { InscripcionesService, Inscripcion } from '../../../../core/services/inscripciones.service';
import { Subscription, forkJoin, Observable, of, switchMap, map, catchError } from 'rxjs';

interface NotaViewModel {
  id?: number;
  alumnoId: number;
  cursoId: number;
  nombreAlumno: string;
  nombreCurso: string;
  calificacion: number | null;
  estado?: string;
}

interface NotaResult {
  alumno: Alumno | undefined;
  curso: Curso | undefined;
  nota: Nota | undefined;
}

@Component({
  selector: 'app-lista-notas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './lista-notas.component.html',
  styleUrls: ['./lista-notas.component.scss']
})
export class ListaNotasComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['alumno', 'curso', 'calificacion', 'estado', 'acciones'];
  notas: NotaViewModel[] = [];
  notaSeleccionada: NotaViewModel | null = null;
  nuevaNota: number | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private notasService: NotasService,
    private alumnosService: AlumnosService,
    private cursosService: CursosService,
    private inscripcionesService: InscripcionesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarNotas();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  cargarNotas(): void {
    this.subscriptions.push(
      this.inscripcionesService.getInscripciones().pipe(
        switchMap((inscripciones: Inscripcion[]) => {
          const notasPromises = inscripciones.map(inscripcion => 
            forkJoin({
              alumno: this.alumnosService.getAlumnoById(inscripcion.alumnoId).pipe(
                catchError(() => of(undefined))
              ),
              curso: this.cursosService.getCursoById(inscripcion.cursoId).pipe(
                catchError(() => of(undefined))
              ),
              nota: this.notasService.getNotaPorAlumnoYCurso(inscripcion.alumnoId, inscripcion.cursoId).pipe(
                catchError(() => of(undefined))
              )
            })
          );
          return forkJoin(notasPromises);
        }),
        map((resultados: NotaResult[]) => {
          return resultados.map(({ alumno, curso, nota }) => {
            if (!alumno || !curso) return null;
            
            return {
              id: nota?.id,
              alumnoId: alumno.id,
              cursoId: curso.id,
              nombreAlumno: `${alumno.nombre} ${alumno.apellido}`,
              nombreCurso: curso.nombre,
              calificacion: nota?.calificacion || null,
              estado: nota ? this.notasService.getEstadoNota(nota.calificacion) : 'Pendiente'
            };
          }).filter((nota): nota is NotaViewModel => nota !== null);
        })
      ).subscribe(
        (notas: NotaViewModel[]) => {
          this.notas = notas;
        },
        (error: Error) => {
          console.error('Error al cargar las notas:', error);
          this.snackBar.open('Error al cargar las notas', 'Cerrar', {
            duration: 3000
          });
        }
      )
    );
  }

  getEstadoNota(calificacion: number | null): string {
    if (calificacion === null) return 'Pendiente';
    return calificacion >= 3.0 ? 'APROBADO' : 'REPROBADO';
  }

  getColorNota(calificacion: number | null): string {
    if (calificacion === null) return 'pendiente';
    return calificacion >= 3.0 ? 'aprobado' : 'reprobado';
  }

  seleccionarNota(nota: NotaViewModel): void {
    this.notaSeleccionada = nota;
    this.nuevaNota = nota.calificacion;
  }

  guardarNota(): void {
    if (!this.notaSeleccionada || this.nuevaNota === null) return;

    if (this.nuevaNota < 0 || this.nuevaNota > 5) {
      this.snackBar.open('La calificación debe estar entre 0 y 5', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const guardarObservable = this.notaSeleccionada.id
      ? this.notasService.actualizarNota(this.notaSeleccionada.id, this.nuevaNota)
      : this.notasService.agregarNota(
          this.notaSeleccionada.alumnoId,
          this.notaSeleccionada.cursoId,
          this.nuevaNota
        );

    this.subscriptions.push(
      guardarObservable.subscribe(
        () => {
          this.cargarNotas();
          this.notaSeleccionada = null;
          this.nuevaNota = null;
          this.snackBar.open('Nota guardada correctamente', 'Cerrar', {
            duration: 3000
          });
        },
        (error: Error) => {
          console.error('Error al guardar la nota:', error);
          this.snackBar.open('Error al guardar la nota', 'Cerrar', {
            duration: 3000
          });
        }
      )
    );
  }

  cancelarEdicion(): void {
    this.notaSeleccionada = null;
    this.nuevaNota = null;
  }
} 