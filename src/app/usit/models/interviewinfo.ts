import { Employee } from "./employee";
import { SubmissionInfo } from "./submissioninfo";

export class InterviewInfo {
    closure!: any;
    feedback!: string;
    interviewflg!:string;
    interviewdate!: string;
    interviewno!: string;
    interviewstatus!: string;
    intrid!: number;
    mode!: string;
    recmaxno!: number;
    round!: string;
    salesmaxno!: number;
    submission= new SubmissionInfo();
    timezone!: string;
    updatedby = new Employee();
    users = new Employee();
}