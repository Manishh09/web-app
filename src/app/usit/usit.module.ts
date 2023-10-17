import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsitRoutingModule } from './usit-routing.module';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { VendorListComponent } from './components/vendor-list/vendor-list.component';
import { AddEmployeeComponent } from './components/employee-list/add-employee/add-employee.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


@NgModule({
  declarations: [
  
    AddEmployeeComponent,
       DashboardComponent
  ],
  imports: [
    CommonModule,
    UsitRoutingModule
  ]
})
export class UsitModule { }
