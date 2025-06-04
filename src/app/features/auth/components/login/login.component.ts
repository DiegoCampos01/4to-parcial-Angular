import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.state';
import * as AuthActions from '../../../../store/auth/auth.actions';
import * as AuthSelectors from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        
        <mat-card class="credentials-card">
          <mat-card-header>
            <mat-card-title>Credenciales de Prueba</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="credentials-section">
              <h3>Administrador</h3>
              <p><strong>Usuario:</strong> admin&#64;admin.com</p>
              <p><strong>Contraseña:</strong> admin123</p>
            </div>
            <div class="credentials-section">
              <h3>Usuario Normal</h3>
              <p><strong>Usuario:</strong> usuario&#64;usuario.com</p>
              <p><strong>Contraseña:</strong> user123</p>
            </div>
          </mat-card-content>
        </mat-card>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Usuario</mat-label>
            <input matInput formControlName="username" required>
            <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
              El usuario es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password" required>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="loginForm.invalid || (loading$ | async)" 
                  class="full-width">
            {{ (loading$ | async) ? 'Iniciando sesión...' : 'Ingresar' }}
          </button>

          <div *ngIf="error$ | async as error" class="error-message">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
    }
    .login-card {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }
    .credentials-card {
      margin-bottom: 2rem;
      background-color: #f8f9fa;
    }
    .credentials-section {
      margin-bottom: 1rem;
    }
    .credentials-section h3 {
      color: #1976d2;
      margin-bottom: 0.5rem;
    }
    .credentials-section p {
      margin: 0.25rem 0;
    }
    .error-message {
      color: #f44336;
      text-align: center;
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading$ = this.store.select(AuthSelectors.selectAuthLoading);
  error$ = this.store.select(AuthSelectors.selectAuthError);

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Reset any previous error state
    this.store.dispatch(AuthActions.loginFailure({ error: '' }));
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ username, password }));
    }
  }
} 