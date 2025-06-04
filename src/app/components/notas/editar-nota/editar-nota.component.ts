import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { NotasService } from '../../../services/notas.service';
import { AlumnosService } from '../../../services/alumnos.service';
import { CursosService } from '../../../services/cursos.service';

@Component({
  selector: 'app-editar-nota',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Editar Nota</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="alumno && curso" class="info-section">
            <p><strong>Alumno:</strong> {{alumno.nombre}} {{alumno.apellido}}</p>
            <p><strong>Curso:</strong> {{curso.nombre}}</p>
          </div>

          <form [formGroup]="notaForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Calificación</mat-label>
              <input matInput type="number" formControlName="calificacion" min="0" max="5" step="0.1">
              <mat-error *ngIf="notaForm.get('calificacion')?.hasError('required')">
                La calificación es requerida
              </mat-error>
              <mat-error *ngIf="notaForm.get('calificacion')?.hasError('min')">
                La calificación mínima es 0
              </mat-error>
              <mat-error *ngIf="notaForm.get('calificacion')?.hasError('max')">
                La calificación máxima es 5
              </mat-error>
            </mat-form-field>

            <div class="button-container">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="notaForm.invalid">
                Guardar
              </button>
              <button mat-button type="button" (click)="cancelar()">
                Cancelar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    .info-section {
      margin-bottom: 1.5rem;
    }
    .info-section p {
      margin: 0.5rem 0;
    }
    .button-container {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
  `]
})
export class EditarNotaComponent implements OnInit {
  notaForm: FormGroup;
  alumnoId!: number;
  cursoId!: number;
  alumno: any;
  curso: any;

  constructor(
    private fb: FormBuilder,
    private notasService: NotasService,
    private alumnosService: AlumnosService,
    private cursosService: CursosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.notaForm = this.fb.group({
      calificacion: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.alumnoId = +params['alumnoId'];
      this.cursoId = +params['cursoId'];
      
      this.alumno = this.alumnosService.getAlumnoById(this.alumnoId);
      this.curso = this.cursosService.getCursoById(this.cursoId);
      
      const nota = this.notasService.getNotaPorAlumnoYCurso(this.alumnoId, this.cursoId);
      if (nota) {
        this.notaForm.patchValue({ calificacion: nota.calificacion });
      }
    });
  }

  onSubmit(): void {
    if (this.notaForm.valid) {
      const calificacion = this.notaForm.get('calificacion')?.value;
      
      this.notasService.guardarNota({
        alumnoId: this.alumnoId,
        cursoId: this.cursoId,
        calificacion
      });
      
      this.router.navigate(['/notas']);
    }
  }

  cancelar(): void {
    this.router.navigate(['/notas']);
  }
} 