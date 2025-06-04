import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import * as UiSelectors from '../../../store/ui/ui.selectors';
import * as AuthActions from '../../../store/auth/auth.actions';
import { User } from '../../services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [mode]="'side'"
          [opened]="true">
        <mat-toolbar>Menú</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/alumnos" routerLinkActive="active">
            <mat-icon>people</mat-icon>
            <span>Alumnos</span>
          </a>
          <a mat-list-item routerLink="/cursos" routerLinkActive="active">
            <mat-icon>school</mat-icon>
            <span>Cursos</span>
          </a>
          <a mat-list-item routerLink="/inscripciones" routerLinkActive="active">
            <mat-icon>assignment</mat-icon>
            <span>Inscripciones</span>
          </a>
          <a mat-list-item routerLink="/notas" routerLinkActive="active">
            <mat-icon>grade</mat-icon>
            <span>Notas</span>
          </a>
          <ng-container *ngIf="isAdmin$ | async">
            <a mat-list-item routerLink="/usuarios" routerLinkActive="active">
              <mat-icon>admin_panel_settings</mat-icon>
              <span>Usuarios</span>
            </a>
          </ng-container>
          <a mat-list-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Cerrar Sesión</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span>Academia</span>
          <span class="toolbar-spacer"></span>
          <span>{{ currentTitle$ | async }}</span>
          <span class="toolbar-spacer"></span>
          <span>{{ (currentUser$ | async)?.username }}</span>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    .sidenav {
      width: 250px;
    }
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 20px;
    }
    mat-nav-list a {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .active {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class LayoutComponent implements OnInit {
  currentUser$ = this.store.select(AuthSelectors.selectCurrentUser);
  currentTitle$ = this.store.select(UiSelectors.selectCurrentTitle);
  isAdmin$ = this.store.select(AuthSelectors.selectCurrentUser).pipe(
    map((user: User | null) => user?.role === 'admin')
  );

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si hay un usuario en el localStorage al iniciar
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.store.dispatch(AuthActions.setCurrentUser({ user: JSON.parse(storedUser) }));
    }
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
} 