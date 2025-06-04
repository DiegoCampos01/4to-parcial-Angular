import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { NotasService, Nota } from '../../../services/notas.service';
import { AlumnosService } from '../../../services/alumnos.service';
import { CursosService } from '../../../services/cursos.service';
import { InscripcionesService } from '../../../services/inscripciones.service';
import { forkJoin, map, switchMap } from 'rxjs';

interface NotaConDetalles extends Nota {
  nombreAlumno: string;
  nombreCurso: string;
}

@Component({
  selector: 'app-lista-notas',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="container">
      <h2>Lista de Notas</h2>

      <table mat-table [dataSource]="notasConDetalles" class="mat-elevation-z8">
        <!-- Alumno Column -->
        <ng-container matColumnDef="alumno">
          <th mat-header-cell *matHeaderCellDef>Alumno</th>
          <td mat-cell *matCellDef="let nota">{{nota.nombreAlumno}}</td>
        </ng-container>

        <!-- Curso Column -->
        <ng-container matColumnDef="curso">
          <th mat-header-cell *matHeaderCellDef>Curso</th>
          <td mat-cell *matCellDef="let nota">{{nota.nombreCurso}}</td>
        </ng-container>

        <!-- Calificación Column -->
        <ng-container matColumnDef="calificacion">
          <th mat-header-cell *matHeaderCellDef>Calificación</th>
          <td mat-cell *matCellDef="let nota" [ngClass]="getCalificacionColor(nota.calificacion)">
            {{nota.calificacion === 0 ? 'Sin calificar' : nota.calificacion}} 
            {{nota.calificacion > 0 ? '- ' + getCalificacionEstado(nota.calificacion) : ''}}
          </td>
        </ng-container>

        <!-- Acciones Column -->
        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let nota">
            <button mat-icon-button color="primary" 
                    [routerLink]="['/notas/editar', nota.alumnoId, nota.cursoId]">
              <mat-icon>edit</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    table {
      width: 100%;
    }
    .success {
      color: green;
    }
    .danger {
      color: red;
    }
    .pending {
      color: gray;
      font-style: italic;
    }
  `]
})
export class ListaNotasComponent implements OnInit {
  displayedColumns: string[] = ['alumno', 'curso', 'calificacion', 'acciones'];
  notasConDetalles: NotaConDetalles[] = [];

  constructor(
    private notasService: NotasService,
    private alumnosService: AlumnosService,
    private cursosService: CursosService,
    private inscripcionesService: InscripcionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarNotas();
  }

  cargarNotas(): void {
    // Primero obtenemos todas las inscripciones
    this.inscripcionesService.getInscripciones().subscribe(inscripciones => {
      // Por cada inscripción, creamos o recuperamos una nota
      const notasPromesas = inscripciones.map(inscripcion => {
        const alumno = this.alumnosService.getAlumnoById(inscripcion.alumnoId);
        const curso = this.cursosService.getCursoById(inscripcion.cursoId);
        
        // Si no existe una nota, creamos una con calificación 0
        let nota = this.notasService.getNotaPorAlumnoYCurso(inscripcion.alumnoId, inscripcion.cursoId);
        if (!nota) {
          nota = {
            alumnoId: inscripcion.alumnoId,
            cursoId: inscripcion.cursoId,
            calificacion: 0
          };
          this.notasService.guardarNota(nota);
        }

        return {
          ...nota,
          nombreAlumno: alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Alumno no encontrado',
          nombreCurso: curso ? curso.nombre : 'Curso no encontrado'
        };
      });

      this.notasConDetalles = notasPromesas;
    });
  }

  getCalificacionColor(calificacion: number): string {
    if (calificacion === 0) return 'pending';
    return calificacion >= 3.0 ? 'success' : 'danger';
  }

  getCalificacionEstado(calificacion: number): string {
    return calificacion >= 3.0 ? 'APROBADO' : 'REPROBADO';
  }
} 