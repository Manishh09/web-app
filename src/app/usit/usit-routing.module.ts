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

const routes: Routes = [
  { path: '', component: DashboardComponent , pathMatch: 'full'},
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  { path: 'employees', component: EmployeeListComponent},
  { path: 'vendors', component: VendorListComponent },
  { path: 'roles', component: RolesListComponent },
  { path: 'recruiters', component: RecruiterListComponent},
  { path: 'submissions', component: SubmissionListComponent },
  { path: 'interviews', component: InterviewListComponent },
  { path: 'visa', component: VisaListComponent },
  { path: 'qualification', component: QualificationListComponent },
  { path: 'companies', component: CompaniesListComponent },
  { path: 'technology-tag', component: TechnologyTagListComponent },
  { path: 'recruiting-requirements', component: RequirementListComponent },
  { path: 'sales-consultants', component: ConsultantListComponent,
    data: {isSalesConsultant : true}},
  { path: 'rec-consultants', component: ConsultantListComponent,
  data: {isRecConsultant : true}},
  { path: 'pre-sales', component: ConsultantListComponent,
  data: {isPreConsultant : true}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsitRoutingModule { }
