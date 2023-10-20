import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Employee } from '../usit/models/employee';
import { Observable, map } from 'rxjs';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private baseUrl = "http://69.216.19.140:8080/usit/";
  private apiServ = inject(ApiService);
  constructor(private http: HttpClient) { }

  // login controller signin method
  login(user: Partial<Employee>): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'login/signin', user,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(map((resp) => {
        return resp;
      }));
  }

  // loginv2
  loginV2(user: Partial<Employee>): Observable<any> {
    return this.apiServ.post(  'login/signin', user)
  }

  // send forgot password reset link
  // myprofileresetlink
  sendresetlink(user: any) {
    return this.apiServ.post("login/sendlink", user);
  }
  // reset user profile password
  resetpassword(user: any) {
    return this.apiServ.post("login/reset_password", user);
  }

  // from external mail server
  change_password(user: any) {
    return this.apiServ.post("login/change_password", user);
  }

  // roles management
   // roles management
  //register role
  addRole(entity: any) {
    return this.apiServ.post("roles/save", entity);
  }

  //used for get one resource
  getRoleById(id: number) {
    return this.apiServ.get("roles/getrole/" + id);
  }

  //update role
  updateRole(entity: any) {
    return this.apiServ.put("roles/updaterole", entity);
  }
  // get all roles
  getAllRoles() {
    return this.apiServ.get("roles/all");
  }
  // get roles based on page num
  getRolesBasedOnPageNum(page: any, size: any) {
    return this.apiServ.get(this.baseUrl + "roles/all2/"+page+"/"+size);
  }

  // delete role
  deleteRole(id: number) {
    return this.apiServ.delete("roles/delete/" + id);
  }
  //used for delete the resource
  updateRoleStatus(entity: any) {
    return this.http.patch(this.baseUrl + "roles/status", entity);
  }
}
