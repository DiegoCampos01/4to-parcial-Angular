import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export abstract class BaseService<T extends { id: number }> {
  protected abstract storageKey: string;
  protected abstract endpoint: string;
  
  protected dataSubject: BehaviorSubject<T[]>;
  protected apiUrl!: string;

  constructor(protected http: HttpClient) {
    this.dataSubject = new BehaviorSubject<T[]>([]);
  }

  protected initializeService() {
    this.apiUrl = `${environment.apiUrl}/${this.endpoint}`;
    this.cargarDatos();
  }

  protected async cargarDatos(): Promise<void> {
    try {
      const datos = await this.http.get<T[]>(this.apiUrl).toPromise();
      this.dataSubject.next(datos || []);
    } catch (error) {
      console.error(`Error al cargar ${this.endpoint}:`, error);
      // Fallback a localStorage
      const datosGuardados = localStorage.getItem(this.storageKey);
      if (datosGuardados) {
        this.dataSubject.next(JSON.parse(datosGuardados));
      }
    }
  }

  async agregar(item: Omit<T, 'id'>): Promise<void> {
    try {
      const nuevoItem = await this.http.post<T>(this.apiUrl, item).toPromise();
      if (nuevoItem) {
        const itemsActuales = this.dataSubject.value;
        this.dataSubject.next([...itemsActuales, nuevoItem]);
      }
    } catch (error) {
      console.error(`Error al agregar ${this.endpoint}:`, error);
      throw error;
    }
  }

  async actualizar(item: T): Promise<void> {
    try {
      await this.http.put(`${this.apiUrl}/${item.id}`, item).toPromise();
      const itemsActuales = this.dataSubject.value;
      const index = itemsActuales.findIndex(i => i.id === item.id);
      if (index !== -1) {
        itemsActuales[index] = item;
        this.dataSubject.next([...itemsActuales]);
      }
    } catch (error) {
      console.error(`Error al actualizar ${this.endpoint}:`, error);
      throw error;
    }
  }

  async eliminar(id: number): Promise<void> {
    try {
      await this.http.delete(`${this.apiUrl}/${id}`).toPromise();
      const itemsActuales = this.dataSubject.value;
      this.dataSubject.next(itemsActuales.filter(item => item.id !== id));
    } catch (error) {
      console.error(`Error al eliminar ${this.endpoint}:`, error);
      throw error;
    }
  }

  getDatos(): Observable<T[]> {
    return this.dataSubject.asObservable();
  }

  getById(id: number): T | undefined {
    return this.dataSubject.value.find(item => item.id === id);
  }
} 