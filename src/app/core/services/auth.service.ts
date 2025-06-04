import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private readonly TEST_USERS = {
    admin: {
      user: {
        id: 1,
        username: 'admin@admin.com',
        email: 'admin@admin.com',
        role: 'admin' as const
      },
      password: 'admin123'
    },
    user: {
      user: {
        id: 2,
        username: 'usuario@usuario.com',
        email: 'usuario@usuario.com',
        role: 'user' as const
      },
      password: 'user123'
    }
  };

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): Observable<User> {
    const testUser = Object.values(this.TEST_USERS).find(
      u => u.user.username === username && u.password === password
    );

    if (testUser) {
      localStorage.setItem('currentUser', JSON.stringify(testUser.user));
      this.currentUserSubject.next(testUser.user);
      return of(testUser.user);
    }

    return throwError(() => new Error('Credenciales inválidas'));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
} 