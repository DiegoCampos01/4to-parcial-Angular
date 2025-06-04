import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Curso } from '../../../models/curso.model';
import { CursosService } from '../../../services/cursos.service';
import { InscripcionesService } from '../../../services/inscripciones.service';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

interface CursoConCupos extends Curso {
  cuposDisponibles: number;
  alumnosInscritos: number;
}

@Component({
  selector: 'app-lista-cursos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './lista-cursos.component.html',
  styleUrls: ['./lista-cursos.component.scss']
})
export class ListaCursosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'profesor', 'duracion', 'cupos', 'acciones'];
  cursos: CursoConCupos[] = [];

  constructor(
    private cursosService: CursosService,
    private inscripcionesService: InscripcionesService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.cursosService.getCursos(),
      this.inscripcionesService.getInscripciones()
    ]).pipe(
      map(([cursos, inscripciones]) => {
        return cursos.map(curso => {
          const inscripcionesCurso = inscripciones.filter(i => i.cursoId === curso.id);
          const alumnosInscritos = inscripcionesCurso.length;
          const cuposDisponibles = curso.cupo - alumnosInscritos;

          return {
            ...curso,
            alumnosInscritos,
            cuposDisponibles: cuposDisponibles >= 0 ? cuposDisponibles : 0
          };
        });
      })
    ).subscribe(cursosConCupos => {
      this.cursos = cursosConCupos;
    });
  }

  editarCurso(curso: Curso): void {
    console.log('Editar curso:', curso);
  }

  eliminarCurso(curso: Curso): void {
    if (confirm(`¿Está seguro de eliminar el curso ${curso.nombre}?`)) {
      this.cursosService.eliminarCurso(curso.id);
    }
  }

  verAlumnos(curso: Curso): void {
    console.log('Ver alumnos del curso:', curso);
  }
} 