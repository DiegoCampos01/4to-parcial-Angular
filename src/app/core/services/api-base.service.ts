import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable()
export abstract class ApiBaseService<T> {
  protected baseUrl: string;

  constructor(
    protected http: HttpClient
  ) {
    this.baseUrl = `${API_CONFIG.baseUrl}${this.getEndpoint()}`;
  }

  protected abstract getEndpoint(): string;

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(item: Partial<T>): Observable<T> {
    return this.http.post<T>(this.baseUrl, item);
  }

  update(id: number, item: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
} 