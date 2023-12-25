import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RolesListComponent } from './components/role-list/roles-list.component';
import { VendorListComponent } from './components/vendor-management/vendor-list/vendor-list.component';
import { RecruiterListComponent } from './components/vendor-management/recruiter-list/recruiter-list.component';
import { ConsultantListComponent } from './components/sales/consultant-list/consultant-list.component';
import { SubmissionListComponent } from './components/sales/submission-list/submission-list.component';
import { InterviewListComponent } from './components/sales/interview-list/interview-list.component';
import { VisaListComponent } from './components/masters/visa-list/visa-list.component';
import { QualificationListComponent } from './components/masters/qualification-list/qualification-list.component';
import { CompaniesListComponent } from './components/masters/companies-list/companies-list.component';
import { TechnologyTagListComponent } from './components/technology-tag-list/technology-tag-list.component';
import { RequirementListComponent } from './components/recruitment/requirement-list/requirement-list.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { AttemptQuizComponent } from './components/quiz/attempt-quiz/attempt-quiz.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'quiz',
    component: QuizComponent
  },
  {
    path: 'attempt-quiz',
    component: AttemptQuizComponent
  },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'vendors', component: VendorListComponent },
  { path: 'roles', component: RolesListComponent },
  { path: 'recruiters', component: RecruiterListComponent },
  {
    path: 'sales-submission', component: SubmissionListComponent,
    data: { isSaleSub: true }
  },
  {
    path: 'rec-submission', component: SubmissionListComponent,
    data: { isRecSub: true }
  },
  {
    path: 'dom-submission', component: SubmissionListComponent,
    data: { isDomSub: true }
  },
  {
    path: 'sales-interview', component: InterviewListComponent,
    data: { isSalesInt: true }
  },
  {
    path: 'rec-interview', component: InterviewListComponent,
    data: { isRecInt: true }
  },
  {
    path: 'dom-interview', component: InterviewListComponent,
    data: { isDomInt: true }
  },

  { path: 'visa', component: VisaListComponent },
  { path: 'qualification', component: QualificationListComponent },
  { path: 'companies', component: CompaniesListComponent },
  { path: 'technology-tag', component: TechnologyTagListComponent },
  { path: 'rec-requirements', component: RequirementListComponent,
  data: {isRecRequirement : true} },
  { path: 'dom-requirements', component: RequirementListComponent,
  data: {isDomRequirement : true} },
  {
    path: 'sales-consultants', component: ConsultantListComponent,
    data: { isSalesConsultant: true }
  },
  {
    path: 'rec-consultants', component: ConsultantListComponent,
    data: { isRecConsultant: true }
  },
  {
    path: 'pre-sales', component: ConsultantListComponent,
    data: { isPreConsultant: true }
  },
  {
    path: 'dom-consultants', component: ConsultantListComponent,
    data: { isDomConsultant: true }
  },
  {
    path: 'sales-submissions', component: SubmissionListComponent,
    data: { isSalesSubmission: true }
  },
  {
    path: 'rec-submissions', component: SubmissionListComponent,
    data: { isRecSubmission: true }
  },
  {
    path: 'dom-submissions', component: SubmissionListComponent,
    data: { isDomSubmission: true }
  },
  {
    path: 'sales-interviews', component: InterviewListComponent,
    data: { isSalesInterview: true }
  },
  {
    path: 'rec-interviews', component: InterviewListComponent,
    data: { isRecInterview: true }
  },
  {
    path: 'dom-interviews', component: InterviewListComponent,
    data: { isDomInterview: true }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsitRoutingModule { }
