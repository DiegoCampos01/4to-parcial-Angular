import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { CursosService } from '../../../services/cursos.service';
import { InscripcionesService } from '../../../services/inscripciones.service';
import { AlumnosService } from '../../../services/alumnos.service';
import { Curso } from '../../../models/curso.model';
import { Alumno } from '../../../models/alumno.model';
import { Subscription, forkJoin, of, combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import * as InscripcionesActions from '../../../store/inscripciones/inscripciones.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

interface CursoConEstado extends Curso {
  inscrito: boolean;
  cuposDisponibles: number;
  alumnosInscritos: number;
  cupo: number;
  inscripcionesAlumnos?: { alumnoId: number; nombre: string }[];
  alumnoSeleccionado?: number;
}

@Component({
  selector: 'app-lista-inscripciones',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './lista-inscripciones.component.html',
  styleUrls: ['./lista-inscripciones.component.scss']
})
export class ListaInscripcionesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['nombre', 'profesor', 'duracion', 'cuposDisponibles', 'acciones'];
  cursosDisponibles: CursoConEstado[] = [];
  alumnoId: number | null = null;
  alumno: Alumno | null = null;
  private subscriptions: Subscription[] = [];
  private ultimaInscripcion: { cursoId: number; timestamp: number } | null = null;
  private readonly TIEMPO_DOBLE_CLICK = 300; // milisegundos para considerar doble click

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private cursosService: CursosService,
    private alumnosService: AlumnosService,
    private inscripcionesService: InscripcionesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.alumnoId = params['id'] ? +params['id'] : null;
        if (this.alumnoId) {
          this.cargarDatosAlumno();
        } else {
          this.cargarCursosDisponibles();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  cargarDatosAlumno(): void {
    if (this.alumnoId) {
      const alumno = this.alumnosService.getAlumnoById(this.alumnoId);
      if (alumno) {
        this.alumno = alumno;
        this.cargarCursosDisponibles();
      } else {
        this.router.navigate(['/alumnos']);
      }
    }
  }

  cargarCursosDisponibles(): void {
    this.subscriptions.push(
      this.cursosService.getCursos().pipe(
        switchMap(cursos => {
          return combineLatest([
            of(cursos),
            this.inscripcionesService.getInscripciones(),
            this.alumnosService.getAlumnos()
          ]).pipe(
            map(([cursos, inscripciones, todosAlumnos]) => {
              return cursos.map(curso => {
                const inscripcionesCurso = inscripciones.filter(i => i.cursoId === curso.id);
                const alumnosInscritos = inscripcionesCurso.length;
                const cuposDisponibles = curso.cupo - alumnosInscritos;
                const inscrito = this.alumnoId ? 
                  inscripcionesCurso.some(i => i.alumnoId === this.alumnoId) : 
                  false;

                // Obtener información de los alumnos inscritos
                const inscripcionesAlumnos = inscripcionesCurso.map(inscripcion => {
                  const alumnoEncontrado = todosAlumnos.find((a: Alumno) => a.id === inscripcion.alumnoId);
                  return {
                    alumnoId: inscripcion.alumnoId,
                    nombre: alumnoEncontrado ? `${alumnoEncontrado.nombre} ${alumnoEncontrado.apellido}` : 'Alumno no encontrado'
                  };
                });

                return {
                  ...curso,
                  inscrito,
                  alumnosInscritos,
                  cuposDisponibles: cuposDisponibles >= 0 ? cuposDisponibles : 0,
                  cupo: curso.cupo || 0,
                  inscripcionesAlumnos,
                  alumnoSeleccionado: undefined
                };
              });
            })
          );
        })
      ).subscribe(cursosConEstado => {
        this.cursosDisponibles = cursosConEstado;
      })
    );
  }

  manejarInscripcion(curso: CursoConEstado): void {
    const ahora = Date.now();
    
    if (this.ultimaInscripcion && 
        this.ultimaInscripcion.cursoId === curso.id && 
        ahora - this.ultimaInscripcion.timestamp < this.TIEMPO_DOBLE_CLICK) {
      // Es un doble click, desinscribir
      if (curso.inscrito) {
        this.desinscribirse(curso);
      }
      this.ultimaInscripcion = null;
    } else {
      // Primer click
      if (!curso.inscrito && curso.cuposDisponibles > 0) {
        this.inscribirse(curso);
      }
      this.ultimaInscripcion = {
        cursoId: curso.id,
        timestamp: ahora
      };
    }
  }

  desinscribirAlumnoSeleccionado(curso: CursoConEstado): void {
    if (curso.alumnoSeleccionado) {
      this.store.dispatch(InscripcionesActions.desinscribirAlumno({ 
        cursoId: curso.id, 
        alumnoId: curso.alumnoSeleccionado 
      }));

      this.inscripcionesService.desinscribirAlumno(curso.id, curso.alumnoSeleccionado)
        .pipe(take(1))
        .subscribe(() => {
          this.snackBar.open('Desinscripción realizada con éxito', 'Cerrar', {
            duration: 3000
          });
          curso.alumnoSeleccionado = undefined;
          this.cargarCursosDisponibles();
        });
    } else {
      this.snackBar.open('Por favor selecciona un alumno para desinscribir', 'Cerrar', {
        duration: 3000
      });
    }
  }

  inscribirse(curso: CursoConEstado): void {
    if (this.alumnoId && curso.cuposDisponibles > 0 && !curso.inscrito) {
      this.inscripcionesService.inscribirAlumno(curso.id, this.alumnoId)
        .pipe(take(1))
        .subscribe(() => {
          this.snackBar.open('Inscripción realizada con éxito', 'Cerrar', {
            duration: 3000
          });
          this.cargarCursosDisponibles();
        });
    } else if (!this.alumnoId) {
      this.router.navigate(['/alumnos']);
    }
  }

  desinscribirse(curso: CursoConEstado): void {
    if (this.alumnoId && curso.inscrito) {
      this.store.dispatch(InscripcionesActions.desinscribirAlumno({ 
        cursoId: curso.id, 
        alumnoId: this.alumnoId 
      }));

      this.inscripcionesService.desinscribirAlumno(curso.id, this.alumnoId)
        .pipe(take(1))
        .subscribe(() => {
          this.snackBar.open('Desinscripción realizada con éxito', 'Cerrar', {
            duration: 3000
          });
          this.cargarCursosDisponibles();
        });
    }
  }

  volver(): void {
    if (this.alumnoId) {
      this.router.navigate(['/alumnos']);
    } else {
      this.router.navigate(['/']);
    }
  }

  irAInscribir(curso: CursoConEstado): void {
    this.router.navigate(['/alumnos']);
  }
}
