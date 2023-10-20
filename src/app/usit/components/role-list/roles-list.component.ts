import { CommonModule } from '@angular/common';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { IStatusData } from 'src/app/dialogs/models/status-model.data';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { DialogService } from 'src/app/services/dialog.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { Role } from '../../models/role';
import { AddRoleComponent } from './add-role/add-role.component';
@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss']
,
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
export class RolesListComponent implements OnInit , AfterViewInit{
  private userManagementServ = inject(UserManagementService);
  form: any = FormGroup;
  private formBuilder = inject(FormBuilder);
  private dialogServ = inject(DialogService)
  displayedColumns: string[] = ['roleName','status', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        remarks: ['', Validators.required],
      }
    );
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  // add
  addRole(){
    const actionData = {
      title: 'Add New Role',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      action: 'add'
    };
    this.dialogServ.openDialogWithComponent(AddRoleComponent, actionData)
  }
  // search
  onFilter(event: any){
    this.dataSource.filter = event.target.value
  }
  // sort
  onSort(event: any){

  }

  // edit
  editRole(role: Role){
    const actionData = {
      title: 'Update Role',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      action: 'update'
    };
    this.dialogServ.openDialogWithComponent(AddRoleComponent, actionData)
  }
  // delete
  deleteRole(role: Role){
    const dataToBeSentToDailog : Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: role,
    }
    this.dialogServ.openDialogWithComponent(ConfirmComponent, dataToBeSentToDailog);

    // call delete api after  clicked 'Yes' on dialog click


    // show snack bar after successfull deletion
  }
  // status update
  onStatusUpdate(role: Role){
    const dataToBeSentToDailog : IStatusData = {
      title: 'Status Update',
      updateText: role.status !== 'Active' ? 'activating' : 'in-activating',
      type: role.roleName,
      buttonText: 'Update',
      actionData: role
    }
    const compType  = StatusComponent;
    this.dialogServ.openDialogWithComponent(compType, dataToBeSentToDailog)
  }

  }
  const ELEMENT_DATA = [
    { roleId: 1, roleName: 'Super Admin', status: 'Active' },
    { roleId: 2, roleName: 'Admin', status: 'Active' },
    { roleId: 3, roleName: 'Manager', status: 'Active' },
    { roleId: 4, roleName: 'Team Lead', status: 'In Active' },
    { roleId: 5, roleName: 'Employee', status: 'Active' },
    { roleId: 6, roleName: 'User', status: 'Active' },

  ];

  export interface IRoleData {
    roleId: number;
    roleName: string;
    Status: string;
  }
