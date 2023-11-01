import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {

  private apiServ = inject(ApiService);

  //register vms
  public registerEntity(entity: any) {
    return this.apiServ.post("recruiter/save", entity);
  }

  public duplicatecheckEmail(email: string) {
    return this.apiServ.get("recruiter/duplicateMail/" + email);
  }


  //used for get the resource
  getAll() {
    return this.apiServ.get("recruiter/all");
  }

  getAllRecruiters( access: string, userid: number) {
    return this.apiServ.get("recruiter/all/" + access + "/" + userid);
  }



  getAllRecruitersPagination( access: string, userid: number,page: any, size: any,field:any) {
    return this.apiServ.get("recruiter/all/" + access + "/" + userid+"/"+page+"/"+size+"/"+field);
  }

  deleteEntity(id: number) {
    return this.apiServ.delete("recruiter/delete/" + id);
  }
  getEntity(id: number) {
    return this.apiServ.get("recruiter/recruiter/" + id);
  }

  rejectRecruiter(id: number, remarks: string) {
    return this.apiServ.get("recruiter/reject?id=" + id +"&remarks=" + remarks);
  }

  getEntitybyCompany(id: number) {
    return this.apiServ.get("recruiter/recrbycompany/" + id);
  }

  //register vms
  public updateEntity(entity: any) {
    return this.apiServ.put("recruiter/recruiter", entity);
  }

  getCompanies(flg:string) {
    return this.apiServ.get("recruiter/venodorCompanies/"+flg);
  }

  //used for delete the resource
  changeStatus(entity: any) {
    return this.apiServ.patch("recruiter/status", entity);
  }

  changeStatus2(id: number, status: string, remarks: string) {
    return this.apiServ.get("recruiter/status?id=" + id + "&status=" + status + "&remarks=" + remarks);
  }

  approve(role: number, action: string, id: number) {//this.role,action,id
    return this.apiServ.get("recruiter/approve?stat=" + action + "&id=" + id);
  }

  uploadexcel(file: any) {
    return this.apiServ.post("recruiter/upload", file);
  }

  uploadexcels(file: any, id:number) {
    return this.apiServ.post("recruiter/excelUpload", file);
  }
}
