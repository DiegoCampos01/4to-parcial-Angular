import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      // Save the attempted URL
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Verificar si la ruta requiere rol de admin
    const requiereAdmin = route.data['requiereAdmin'] === true;
    if (requiereAdmin && !this.authService.isAdmin()) {
      this.router.navigate(['/acceso-denegado']);
      return false;
    }

    return true;
  }
} 