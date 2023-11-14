import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiServ = inject(ApiService);

  getCompanies() {
    return this.apiServ.get("vendor/venodorCompanies");
  }

  //register vms
  public registerEntity(entity: any) {
    return this.apiServ.post("vendor/save", entity);
  }

  public duplicatecheck(vendor: string,id:number) {
    return this.apiServ.get("vendor/duplicatecheck/" + vendor+"/"+id);
  }

  //used for get the resource
  getAll() {
    return this.apiServ.get("vendor/all");
  }

  getAllVendors(access: string, userid: number) {
    return this.apiServ.get("vendor/all/" + access + "/" + userid);
  }

  getAllVendorsByPagination(access: string, userid: number, page: any, size: any, field: any) {
    return this.apiServ.get("vendor/all/" + access + "/" + userid + "/" + page + "/" + size + "/" + field);
  }

  deleteEntity(id: number) {
    return this.apiServ.delete("vendor/delete/" + id);
  }

  getEntity(id: number) {
    return this.apiServ.get("vendor/vendor/" + id);
  }

  //register vms
  public updateEntity(entity: any) {
    return this.apiServ.put("vendor/vendor", entity);
  }
  approvevms(action: string, id: number,userid:number) { //this.role,action,id
    return this.apiServ.get("vendor/approve?stat=" + action + "&id=" + id+"&userid="+userid);
  }

  //used for delete the resource
  changeStatus(entity: any) {
    return this.apiServ.patch("vendor/status", entity);
  }

  changeStatus2(id: number, status: string, remarks: string) {
    return this.apiServ.get("vendor/status?id=" + id + "&status=" + status + "&remarks=" + remarks);
  }

  rejectVendor(id: number, remarks: string, userid:number) {
    return this.apiServ.get("vendor/reject?id=" + id + "&remarks=" + remarks+"&userid="+userid);
  }

  search(keyword: string) {
    return this.apiServ.get("users/search2/" + keyword);
  }

  uploadexcel(file: any) {
    return this.apiServ.post("vendor/upload", file);
  }

  addORUpdateVendor(entity: any, action: 'edit-vendor' | 'add-vendor'){
    return action === 'edit-vendor' ? this.updateEntity(entity): this.registerEntity(entity);
  }

  approveORRejectVendor(entity: any, action: 'Approved' | 'Reject'){
    return action === 'Approved' ? this.approvevms(entity.action, entity.id, entity.userid): this.rejectVendor(entity.id, entity.remarks, entity.userid);
  }
}
