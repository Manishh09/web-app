import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {

  private apiServ = inject(ApiService);
  private privileges: string[] = [];

  setPrivileges(privileges: string[]): void {
    this.privileges = privileges;
  }

  getPrivileges(): string[] {
    return this.privileges;
  }

  // for registering privilages
  public registerprevilage(entity: any) {
    return this.apiServ.post("priviliges/savePrevileges", entity);
  }

  getAllPrivileges() {
    return this.apiServ.get("priviliges/getPrivileges/");
  }

  getPrivilegesById(roleId: number) {
    return this.apiServ.get("priviliges/getPrivilegesById/" + roleId);
  }

  addPrevilegeToRole(entity: any) {
    return this.apiServ.post("priviliges/addprevtorole", entity);
  }

}
