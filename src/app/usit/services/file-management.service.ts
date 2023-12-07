import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {
  private apiServ = inject(ApiService);
  private http = inject(HttpClient);

  constructor() { }

  uploadFile(formData:any, id: number) {
    return this.http.post(this.apiServ.apiUrl + `auth/users/uploadMultiple/${id}`, formData, {observe: "response"});
  }

  removefile(id: number, flg: string) {
    return this.apiServ.get(`auth/users/removefile/${id}/${flg}`);
  }

  removefiles(id: number) {
    return this.apiServ.get(`auth/users/removefiles/${id}`);
  }

  downloadresume(id: number, flg: string): Observable<Blob> {
    return this.http.get(`${this.apiServ.apiUrl}auth/users/download/${id}/${flg}`, {
      responseType: 'blob',
    });
  }

  downloadfile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiServ.apiUrl}auth/users/downloadfiles/${id}`, {
      responseType: 'blob',
    });
  }
}
