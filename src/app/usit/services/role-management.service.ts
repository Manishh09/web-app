import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {

  private baseUrl = "http://69.216.19.140:8080/usit/";
  private apiServ = inject(ApiService);
  constructor(private http: HttpClient) { }

  /**************ROLES SERVICES -  STARTS************* */
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

  // add or update role bases on action edit => update; add=> add
  addOrUpdateRole(entity: any, action: string){
    return action === "update-role" ? this.updateRole(entity) : this.addRole(entity);
  }
  /**************ROLES SERVICES -  ENDS************* */

}
