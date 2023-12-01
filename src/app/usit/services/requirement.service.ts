import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  constructor(private apiServ: ApiService) { }

  // get max require number 
  getReqNumber() {
    return this.apiServ.get("requirement/getmaxnumber");
  }

  getVendorCompanies(flg:string) {
    return this.apiServ.get("recruiter/venodorCompanies/" + flg);
  }

  getAllRequirementData(userid: number,  size: any, field: any) {
    return this.apiServ.get( "requirement/all/" + userid  + "/" + size + "/" + field);
  }

  deleteEntity(id: number) {
    return this.apiServ.delete("requirement/delete/" + id);
  }

}
