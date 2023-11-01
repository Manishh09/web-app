import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {

  private apiServ = inject(ApiService);
   /*** EMPOLOYEE SERVICES _ START */
   //employee management
   getRolesDropdown() {
    return this.apiServ.get("users/getroles");
  }

  getManagerDropdown() {
    return this.apiServ.get("users/manageDropDown");
  }

  getTLdropdown(id: number) {
    return this.apiServ.get("users/TlDropDown/" + id);
  }

  //register EMployee
  registerEmployee(entity: any) {
    return this.apiServ.post("users/save", entity)

  }
  //used for get the resource
  getAllEmployees() {
    return this.apiServ.get("users/all");
  }

  deleteEmployeeById(id: number) {
    return this.apiServ.delete("users/delete/" + id);
  }

  //used for delete the resource
  changeEmployeeStatus(entity: any) {
    return this.apiServ.patch("users/status", entity);
  }
  //used for delete the resource
  unlockEmployee(entity: any) {
    return this.apiServ.patch("users/unlock", entity);
  }
  //used for get one resource
  getEmployeeById(id: number) {
    return this.apiServ.get("users/userbyid/" + id);
  }

  //used for get one resource
  getEmployeeInfoById(id: number) {
    return this.apiServ.get("users/userinfo/" + id);
  }
  //Update Employee
  public updateEmployee(entity: any) {
    return this.apiServ.put("users/update", entity);
  }

   //Update Employee
   public getAllTLBench() {
    return this.apiServ.get("users/teamleads");
  }

  addOrUpdateEmployee(entity: any, action: string){
   return action === "edit-employee" ? this.updateEmployee(entity) : this.registerEmployee(entity);

  }
  /** EMPLOYEE SERVICES - END */
}
