import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { DialogService } from 'src/app/services/dialog.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { IStatusData } from 'src/app/dialogs/models/status-model.data';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { Employee } from '../../models/employee';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' , status: 'active'},
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', status: 'active' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' , status: 'active'},
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', status: 'active' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' , status: 'inactive'},
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' , status: 'active'},
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', status: 'active' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', status: 'active' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', status: 'active' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', status: 'inactive' },
];

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
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmployeeListComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'status', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  elements = ELEMENT_DATA;
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
  private dialogServ = inject(DialogService)

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onSort(event: Sort) {

  }

  onFilter(event: any) {
    this.dataSource.filter = event.target.value
  }

  addEmployee() {
    // // add employee form
    // const dataToBeSentToDailog : IConfirmDialogData = {
    //   title: 'Confirmation',
    //   message: 'Are you sure you want to delete?',
    //   confirmText: 'Yes',
    //   cancelText: 'No'
    // }
    // this.dialogServ.openDialogWithComponent(dataToBeSentToDailog)

    // const dataToBeSentToDailog : IStatusData = {
    //   title: 'Status Update',
    //   updateText: 'in-activating',
    //   type: 'Employee',
    //   buttonText: 'Update'
    // }
    // const compType  = StatusComponent;
    // this.dialogServ.openDialogWithComponent(compType, dataToBeSentToDailog)

    const actionData = {
      title: 'Add Employee',
      width: '600px',
      class: 'add-employee'
    }
    this.dialogServ.openDialogWithComponent(AddEmployeeComponent, actionData);

  }

  editEmployee(emp: Employee){
    const actionData = {
      title: 'Update Employee',
      actionData: emp,
      width: '600px',
      class: 'add-employee'
    }
    this.dialogServ.openDialogWithComponent(AddEmployeeComponent, actionData);
  }

  deleteEmployee(user: Employee){
    const dataToBeSentToDailog : Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: user,
    }
    this.dialogServ.openDialogWithComponent(ConfirmComponent, dataToBeSentToDailog);

    // call delete api after  clicked 'Yes' on dialog click


    // show snack bar after successfull deletion
  }

  // status update
  onStatusUpdate(emp: Employee){
    const dataToBeSentToDailog : IStatusData = {
      title: 'Status Update',
      updateText: emp.status !== 'Active' ? 'activating' : 'in-activating',
      type: 'Employee',
      buttonText: 'Update',
      actionData: emp
    }
    const compType  = StatusComponent;
    this.dialogServ.openDialogWithComponent(compType, dataToBeSentToDailog)
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

  }

}
