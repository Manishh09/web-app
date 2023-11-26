import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {
  private readonly apiUrl = 'http://69.216.19.140:8080/usit/';
  private apiServ = inject(ApiService);
  private http = inject(HttpClient);

  constructor() { }

  uploadFile(formData:any, id: number) {
    return this.http.post(this.apiUrl + `/users/uploadmultipleFiles/${id}`, formData, {observe: "response"});
  }

  removefile(id: number, flg: string) {
    return this.apiServ.get(`/users/removefile/${id}/${flg}`);
  }

  removefiles(id: number) {
    return this.apiServ.get(`/users/removefiles/${id}`);
  }

  downloadresume(id: number, flg: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/users/download/${id}/${flg}`, {
      responseType: 'blob',
    });
  }

  downloadfile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/users/downloadfiles/${id}`, {
      responseType: 'blob',
    });
  }
}
