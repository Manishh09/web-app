import { Consultantinfo } from "./consultantinfo";
import { Employee } from "./employee";
import { Recruiter } from "./recruiter";
import { Requirements } from "./requirements";
import { Vms } from "./vms";

export class SubmissionInfo {

    consultant = new Consultantinfo()
    empcontact!: string;
    empmail!: string;
    endclient!: string;
    submissionflg!: string;
    implpartner!: string;
    position!: string;
    projectlocation!: string;
    ratetype!: string;
    recmaxno!: number;
    recruiter = new Recruiter();
    relocationassistance!: string;
    remarks!: string;
    requirements = new Requirements();
    salesmaxno!: number;
    source!: string;
    status!: string;
    submissionid!: number;
    submissionrate!: string;
    subno!: string;
    substatus!: string;
    updatedby = new Employee();
    user = new Employee();
    vendor!: number;
}