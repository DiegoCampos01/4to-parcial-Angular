import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  private readonly API_URL = 'http://tu-api-backend.com/api'; // Ajusta esta URL a tu backend real

  constructor(private http: HttpClient) {}

  async migrateAllData(): Promise<void> {
    try {
      // Obtener todos los datos del localStorage
      const notas = JSON.parse(localStorage.getItem('notas_data') || '[]');
      const inscripciones = JSON.parse(localStorage.getItem('inscripciones') || '[]');
      const clases = JSON.parse(localStorage.getItem('clases') || '[]');
      const alumnos = JSON.parse(localStorage.getItem('alumnos') || '[]');
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const cursos = JSON.parse(localStorage.getItem('cursos') || '[]');

      // Migrar datos al backend
      await Promise.all([
        this.migrateData('notas', notas),
        this.migrateData('inscripciones', inscripciones),
        this.migrateData('clases', clases),
        this.migrateData('alumnos', alumnos),
        this.migrateData('usuarios', usuarios),
        this.migrateData('cursos', cursos)
      ]);

      console.log('Migración completada exitosamente');
    } catch (error) {
      console.error('Error durante la migración:', error);
      throw error;
    }
  }

  private async migrateData(endpoint: string, data: any[]): Promise<void> {
    if (data.length === 0) return;
    
    try {
      await firstValueFrom(this.http.post(`${this.API_URL}/${endpoint}/bulk`, data));
      console.log(`Datos de ${endpoint} migrados correctamente`);
    } catch (error) {
      console.error(`Error migrando ${endpoint}:`, error);
      throw error;
    }
  }
} 