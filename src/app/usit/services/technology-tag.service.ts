import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TechnologyTagService {

  private apiServ = inject(ApiService);

  constructor() { }

  //register technology
  addTechnology(entity: any) {
    return this.apiServ.post("technology/save", entity);
  }

  //update technology
  updateTechnology(entity: any) {
    return this.apiServ.put("technology/technologies", entity);
  }
  
  // get all technologies
  getAllTechnologies() {
    return this.apiServ.get("technology/all");
  }

  //used for get the resource
  getTechnologiesByPagination(pageno: number) {
    return this.apiServ.get("technology/pagination/" + pageno);
  }

  // delete technology
  deleteTechnology(id: number) {
    return this.apiServ.delete("technology/delete/" + id);
  }

  addOrUpdateTechnology(entity: any, action: string) {
    return action === "update-technology" ? this.updateTechnology(entity) : this.addTechnology(entity);
  }
}
