import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../usit/models/employee';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private baseUrl = "http://69.216.19.140:8080/usit/";
  constructor(private http: HttpClient) { }

  // login controller signin method
  login(user: Partial<Employee>): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'login/signin', user,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(map((resp) => {
        return resp;
      }));
  }

  // send forgot password reset link
  // myprofileresetlink
  sendresetlink(user: any) {
    return this.http.post(this.baseUrl + "login/sendlink", user);
  }
  // reset user profile password
  resetpassword(user: any) {
    return this.http.post(this.baseUrl + "login/reset_password", user);
  }

  // from external mail server
  change_password(user: any) {
    return this.http.post(this.baseUrl + "login/change_password", user);
  }

  // roles management
  //register role
  public addrole(entity: any) {
    return this.http.post(this.baseUrl + "roles/save", entity);
  }

  //used for get one resource
  getrolebyid(id: number) {
    return this.http.get(this.baseUrl + "roles/getrole/" + id);
  }
}
