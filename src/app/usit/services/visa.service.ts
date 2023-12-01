import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class VisaService {

  private apiServ = inject(ApiService);

  constructor() { }

  //register visa
  addVisa(entity: any) {
    return this.apiServ.post("visa/save", entity);
  }

  // get all visas
  getAllVisas() {
    return this.apiServ.get("visa/all");
  }

  //used for get one resource
  getVisaById(id: number) {
    return this.apiServ.get("visa/getbyid/" + id);
  }

  //update visa
  updateVisa(entity: any) {
    return this.apiServ.post("visa/save", entity);
  }

  // delete visa
  deleteVisa(id: number) {
    return this.apiServ.delete("visa/delete/" + id);
  }

  addOrUpdateVisa(entity: any, action: string) {
    return action === "update-visa" ? this.updateVisa(entity) : this.addVisa(entity);
  }
}
