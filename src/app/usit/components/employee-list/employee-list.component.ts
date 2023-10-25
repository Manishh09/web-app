import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { DialogService } from 'src/app/services/dialog.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { IStatusData } from 'src/app/dialogs/models/status-model.data';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { Employee } from '../../models/employee';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  dataTableColumns: string[] = [
    'Name',
    'Email',
    'PersonalOrCompanyNumber',
    'Designation',
    'Department',
    'Status',
    'Action',
  ];
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource([]);

  // paginator
  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;

  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialogServ = inject(DialogService);
  private empManagementServ = inject(EmployeeManagementService);

  ngOnInit(): void {
    this.getAllEmployees();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * get all employee data
   * @returns employee data
   */
  getAllEmployees() {
    return this.empManagementServ
      .getAllEmployees()
      .subscribe((response: any) => {
        console.log('employee.data', response.data);
        if (response.data) {
          this.dataSource.data = response.data;
        }
      });
  }

  onSort(event: Sort) {

  }

  onFilter(event: any) {
    this.dataSource.filter = event.target.value;
  }

  addEmployee() {
    const actionData = {
      title: 'Add Employee',
      empployeeData: null,
      actionName: 'add-employee'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "65vw";
   // dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "add-employee";
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(AddEmployeeComponent, dialogConfig);
  }

  editEmployee(emp: Employee) {
    const actionData = {
      title: 'Update Employee',
      employeeData: emp,
      actionName: 'edit-employee'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "65vw";
    dialogConfig.height = "100vh";
    dialogConfig.panelClass = "edit-employee";
    dialogConfig.data = actionData;
    this.dialogServ.openDialogWithComponent(AddEmployeeComponent, dialogConfig);
  }

  deleteEmployee(user: Employee) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: user,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "delete-employee";
    dialogConfig.data = dataToBeSentToDailog;
    this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );

    // call delete api after  clicked 'Yes' on dialog click

    // show snack bar after successfull deletion
  }

  // status update
  onStatusUpdate(emp: Employee) {
    const dataToBeSentToDailog = {
      title: 'Status Update',
      updateText: emp.status !== 'Active' ? 'activating' : 'in-activating',
      type: 'Employee',
      buttonText: 'Update',
      actionData: emp,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    dialogConfig.height = "auto";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = "update-employee-status";
    dialogConfig.data = dataToBeSentToDailog;
    this.dialogServ.openDialogWithComponent(StatusComponent, dialogConfig);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
}
