import { Company } from "./company";
import { Employee } from "./employee";
import { Qualification } from "./qualification";
import { Requirements } from "./requirements";

import { Technology } from "./technology";
import { Visa } from "./visa";

export class Consultantinfo {
    consultantid!:number;
    consultantno!:string;
    consultantname!:string;
    currentlocation!:string;
    firstname!:string;
    lastname!:string;
    contactnumber!:number;
    consultantemail!:string;
    comment!:string;
    position!:string;
    company = new Company();
    linkedin!:string;
    passportnumber!:string;
    projectavailabity!:string;
    availabilityforinterviews!:string;
    qualification = new Qualification();
    experience!:number;
    ratetype!:string;
    hourlyrate!:number;
    relocation!:string;
    relocatOther!:string;
    skills!:string;
    summary!:string;
    priority!:string;
   // specialization!:string;
    university!:string;
    yop!:number;
    resume!:string;
    h1bcopy!:string;
    dlcopy!:string;
    companyname!:string;
    salesemp!:string;
    empcontact!:number;
    empemail!:string;
    remarks!:string;
    consultantflg!:string;
    isactive!:boolean;
    updatedby = new Employee();
    requirements = new Requirements();
    technology = new Technology();
    visa = new Visa();
    addedby = new Employee();

    technologyarea!:string;
    visa_status!:string;
    companyemail!:number;
    companymobile!:string;
    createddate!:string;
    fullname!:string;
    status!:string;

    refname!:string;
    refcont!:string;
    refemail!:string;
    emprefname!:string;
    emprefemail!:string;
    emprefcont!:string;
    number!:any;
    
}


