import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { VendorListComponent } from './components/vendor-list/vendor-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent , pathMatch: 'full'},
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  { path: 'employees', component: EmployeeListComponent},
  { path: 'vendor', component: VendorListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsitRoutingModule { }
