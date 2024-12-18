import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Environment } from '../environment/environment.model';
import { ENVIRONMENT } from '../environment/environment.token';
import { Observable } from 'rxjs';
import { GenerateResponse } from 'ollama/browser';
import { UploadRequestPayload } from './models/upload-request-payload';

@Injectable({
  providedIn: 'root',
})
export class LlamaService {
  constructor(public http: HttpClient, @Inject(ENVIRONMENT) public environment: Environment) {

  }

  query(query: string): Observable<GenerateResponse> {
    return this.http.post<GenerateResponse>(`${this.environment.apiUrl}/query`, {
      query
    });
  }

  getCollections(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.environment.apiUrl}/collections`);
  }

  getCollection(name: string): Observable<any> {
    return this.http.get<any>(`${this.environment.apiUrl}/collection/${name}`);
  }

  deleteCollection(name: string): Observable<any> {
    return this.http.delete(`${this.environment.apiUrl}/collection/${name}`);
  }

  reset(): Observable<any> {
    return this.http.get(`${this.environment.apiUrl}/reset`);
  }

  upload(payload: UploadRequestPayload, file: File): Observable<any> {
    const multipart = new FormData();
    multipart.append('file', file);
    multipart.append('name', file.name);
    multipart.append('metadata', payload.metadata);
    multipart.append('category', payload.category);
    return this.http.post(`${this.environment.apiUrl}/upload`, multipart);
  }

}
