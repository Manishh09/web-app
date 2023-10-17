import { Role } from './role';

export class Employee {
  userid!: number;
  firstname!: string;
  lastLogin!: any;
  lastLogout!: any;
  lastname!: string;
  fullname!: string;
  pseudoname!: string;
  email!: string;
  personalcontactnumber!: any;
  companycontactnumber!: any;
  password!: string;
  designation!: string;
  manager!: number;
  teamlead!: number;
  createddate!: string;
  role = new Role();
  status = 'Active';
  remarks!: string;
  technology!: string;
  experience!: number;
  location!: string;
  department!: string;
  addedby = localStorage.getItem('userid');
  updatedby = localStorage.getItem('userid');
  joiningdate!: string;
  relievingdate!: string;
  personalemail!: string;
  aadharno!: string;
  panno!: string;
  bankname!: string;
  accno!: string;
  ifsc!: string;
  branch!: string;
}
