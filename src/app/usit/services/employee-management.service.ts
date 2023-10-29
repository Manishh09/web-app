import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {

  private baseUrl = "http://69.216.19.140:8080/usit/";
  private apiServ = inject(ApiService);
  constructor(private http: HttpClient) { }
   /*** EMPOLOYEE SERVICES _ START */
   //employee management
   getRolesDropdown() {
    return this.http.get(this.baseUrl + "users/getroles");
  }

  getManagerDropdown() {
    return this.http.get(this.baseUrl + "users/manageDropDown");
  }

  getTLdropdown(id: number) {
    return this.http.get(this.baseUrl + "users/TlDropDown/" + id);
  }

  //register EMployee
  registerEmployee(entity: any) {
    return this.http.post(this.baseUrl + "users/save", entity)

  }
  //used for get the resource
  getAllEmployees() {
    return this.http.get(this.baseUrl + "users/all");
  }

  deleteEmployeeById(id: number) {
    return this.http.delete(this.baseUrl + "users/delete/" + id);
  }

  //used for delete the resource
  changeEmployeeStatus(entity: any) {
    return this.http.patch(this.baseUrl + "users/status", entity);
  }
  //used for delete the resource
  unlockEmployee(entity: any) {
    return this.http.patch(this.baseUrl + "users/unlock", entity);
  }
  //used for get one resource
  getEmployeeById(id: number) {
    return this.http.get(this.baseUrl + "users/userbyid/" + id);
  }

  //used for get one resource
  getEmployeeInfoById(id: number) {
    return this.http.get(this.baseUrl + "users/userinfo/" + id);
  }
  //Update Employee
  public updateEmployee(entity: any) {
    return this.http.put(this.baseUrl + "users/update", entity);
  }

   //Update Employee
   public getAllTLBench() {
    return this.http.get(this.baseUrl + "users/teamleads");
  }

  addOrUpdateEmployee(entity: any, action: string){
   return action === "edit-employee" ? this.updateEmployee(entity) : this.registerEmployee(entity);

  }
  /** EMPLOYEE SERVICES - END */
}
