import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogService } from 'src/app/services/dialog.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { Recruiter } from 'src/app/usit/models/recruiter';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { AddRecruiterComponent } from './add-recruiter/add-recruiter.component';
import { RecruiterService } from 'src/app/usit/services/recruiter.service';

@Component({
  selector: 'app-recruiter-list',
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
  templateUrl: './recruiter-list.component.html',
  styleUrls: ['./recruiter-list.component.scss'],
})
export class RecruiterListComponent implements OnInit {
  dataTableColumns: string[] = [
    'SerialNum',
    'Company',
    'RecruiterName',
    'PhoneNumber',
    'Email',
    'AddedBy',
    'AddedOn',
    'LastUpdated',
    // 'Status',
    'Action',
    'Approve/Reject',
  ];

  dataSource = new MatTableDataSource<any>([]);

  length = 50;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private recruiterServ = inject(RecruiterService);
  hasAcces!: any;
  loginId!: any;
  department!: any;
  assignToPage: any;
  datarr: any[] = [];
  recrData: Recruiter[] = [];
  entity: any[] = [];
  totalItems: any;
  selectedRecruiterType: string | null = null;


  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum!: any;
  field = 'empty';

  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.loginId = localStorage.getItem('userid');
    this.department = localStorage.getItem('department');
    this.AssignedPageNum = localStorage.getItem('rnum');
    //this.getall();
    if (this.AssignedPageNum == null) {
      this.getAllData();
    }
    else {
      this.gty(this.AssignedPageNum);
      this.page = this.AssignedPageNum;
    }
    //this.getAllData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * get all recruiter data
   * @returns recruiter data
   */
  getAllRecruiters() {
    return this.recruiterServ
      .getAllRecruiters(this.hasAcces, this.loginId)
      .subscribe((response: any) => {
        console.log('recruiter.data', response.data);
        if (response.data) {
          this.dataSource.data = response.data;
        }
      });
  }

  getAllData() {
    return this.recruiterServ
      .getAllRecruitersPagination(
        this.hasAcces,
        this.loginId,
        1,
        this.itemsPerPage,
        this.field
      )
      .subscribe((response: any) => {
        this.datarr = response.data.content;
        this.dataSource.data = response.data.content;
        console.log(this.dataSource.data);
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
        this.totalItems = response.data.totalElements;
        //this.getRecruiterRowClass();
      });
  }
  gty(page: any) {
    this.assignToPage = page;
    return this.recruiterServ
      .getAllRecruitersPagination(
        this.hasAcces,
        this.loginId,
        page,
        this.itemsPerPage,
        this.field
      )
      .subscribe((response: any) => {
        this.datarr = response.data.content;
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = i + 1;
        });
        this.totalItems = response.data.totalElements;
      });
  }

  /**
   * on filter
   * @param event
   */
  onFilter(event: any) {
    this.dataSource.filter = event.target.value;
  }

  /**
   * Sort
   * @param event
   */
  onSort(event: Sort) {
    const sortDirection = event.direction;
    const activeSortHeader = event.active;

    if (sortDirection === '' || !activeSortHeader) {
      return;
    }

    const isAsc = sortDirection === 'asc';
    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      const serialNumA = (a.serialNum || '').toString();
      const serialNumB = (b.serialNum || '').toString();
      switch (activeSortHeader) {
        case 'SerialNum':
          return (isAsc ? 1 : -1) * serialNumA.localeCompare(serialNumB);
        case 'Company':
          return (
            (isAsc ? 1 : -1) * (a.company || '').localeCompare(b.company || '')
          );
        case 'RecruiterName':
          return (
            (isAsc ? 1 : -1) *
            (a.recruiter || '').localeCompare(b.recruiter || '')
          );
        case 'PhoneNumber':
          return (
            (isAsc ? 1 : -1) *
            (a.usnumber || '').localeCompare(b.usnumber || '')
          );
        case 'Email':
          return (
            (isAsc ? 1 : -1) * (a.email || '').localeCompare(b.email || '')
          );
        case 'AddedBy':
          return (
            (isAsc ? 1 : -1) *
            (a.pseudoname || '').localeCompare(b.pseudoname || '')
          );
        case 'AddedOn':
          return (
            (isAsc ? 1 : -1) *
            (a.createddate || '').localeCompare(b.createddate || '')
          );
        case 'LastUpdated':
          return (
            (isAsc ? 1 : -1) *
            (a.updateddate || '').localeCompare(b.updateddate || '')
          );
        // case 'Status':
        //   return (
        //     (isAsc ? 1 : -1) * (a.status || '').localeCompare(b.status || '')
        //   );
        case 'Approve/Reject':
          return (
            (isAsc ? 1 : -1) *
            (a.rec_stat || '').localeCompare(b.rec_stat || '')
          );
        default:
          return 0;
      }
    });
  }

  // uploadRecruiterExcel() {
  //   const actionData = {
  //     title: 'Upload Recruiter',
  //     vendorData: null,
  //     actionName: 'upload-recruiter',
  //   };
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = '65vw';
  //   // dialogConfig.height = "100vh";
  //   dialogConfig.disableClose = false;
  //   dialogConfig.panelClass = 'upload-recruiter';
  //   dialogConfig.data = actionData;

  //   this.dialogServ.openDialogWithComponent(UploadRecuiterExcelComponent, dialogConfig);
  // }

  /**
   * add
   * @param recruiter
   */
  addRecruiter() {
    const actionData = {
      title: 'Add Recruiter',
      recruiterData: null,
      actionName: 'add-recruiter',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    //dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-recruiter';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(
      AddRecruiterComponent,
      dialogConfig
    );
  }
  /**
   * edit
   * @param recruiter
   */
  editRecruiter(recruiter: any) {
    const actionData = {
      title: 'Update Recruiter',
      RecruiterData: recruiter,
      actionName: 'edit-recruiter',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    //dialogConfig.height = '100vh';
    dialogConfig.panelClass = 'edit-recruiter';
    dialogConfig.data = actionData;
    this.dialogServ.openDialogWithComponent(
      AddRecruiterComponent,
      dialogConfig
    );
  }

  /**
   * delete
   * @param recruiter
   */
  deleteRecruiter(recruiter: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: recruiter,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-recruiter';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(
      ConfirmComponent,
      dialogConfig
    );

    // call delete api after  clicked 'Yes' on dialog click
    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.allowAction) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: 'Status updated successfully!',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };

          // this.recruiterServ
          //   .deleteEntity(recruiter.userid)
          //   .subscribe((response: any) => {
          //     if (response.status == 'Success') {
          //       this.getAllRecruiters();
          //       dataToBeSentToSnackBar.message =
          //         'Recruiter Deleted successfully';
          //       this.snackBarServ.openSnackBarFromComponent(
          //         dataToBeSentToSnackBar
          //       );
          //     } else {
          //       dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          //       dataToBeSentToSnackBar.message = 'Record Deletion failed';
          //     }
          //   });
        }
      },
    });
  }

  /**
   * on status update
   * @param recruiter
   */
  onStatusUpdate(recruiter: any) {
    const dataToBeSentToDailog = {
      title: 'Status Update',
      updateText: recruiter.status !== 'Active' ? 'activating' : 'in-activating',
      type: 'Recruiter',
      buttonText: 'Update',
      actionData: recruiter,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'update-recruiter-status';
    dialogConfig.data = dataToBeSentToDailog;

    const dialogRef = this.dialogServ.openDialogWithComponent(
      StatusComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.submitted) {
          const dataToBeSentToSnackBar: ISnackBarData = {
            message: 'Status updated successfully!',
            duration: 1500,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };
          recruiter.remarks = dialogRef.componentInstance.remarks;
          this.recruiterServ
            .changeStatus2(recruiter.id, recruiter.status, recruiter.remarks)
            .subscribe((response: any) => {
              if (response.status == 'Success') {
                this.gty(this.page);
                dataToBeSentToSnackBar.message = 'Status updated successfully';
              } else {
                dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                dataToBeSentToSnackBar.message = 'Status update failed';
              }
              this.snackBarServ.openSnackBarFromComponent(
                dataToBeSentToSnackBar
              );
            });
        }
      },
    });
  }

  // approve initiate reject
  onApproveOrRejectRecruiter(recruiter: any, rejectRecruiter = false) {
    if (recruiter.rec_stat !== 'Approved') {
      const dataToBeSentToSnackBar: ISnackBarData = {
        message: 'Status updated successfully!',
        duration: 1500,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        direction: 'above',
        panelClass: ['custom-snack-success'],
      };
      if (this.department == recruiter.ctype) {
        // alertify.error("Your not Authorized to approve the recruiter");
        dataToBeSentToSnackBar.message =
          'You are not Authorized to approve the Recruiter';
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        return;
      }

      const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
        title:
          recruiter.rec_stat == 'Initiated' && !rejectRecruiter
            ? 'Approve Recruiter'
            : 'Reject Recruiter',
        message:
          recruiter.rec_stat == 'Initiated' && !rejectRecruiter
            ? 'Are you sure you want to Approve the Recruiter ?'
            : 'Are you sure you want to Reject the Recruiter ?',
        confirmText: 'Yes',
        cancelText: 'No',
        actionData: recruiter,
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = 'fit-content';
      dialogConfig.height = 'auto';
      dialogConfig.disableClose = false;
      dialogConfig.panelClass = `${recruiter.rec_stat == 'Initiated' && !rejectRecruiter ? 'approve' : 'reject'
        }-recruiter`;
      dialogConfig.data = dataToBeSentToDailog;
      const dialogRef = this.dialogServ.openDialogWithComponent(
        ConfirmComponent,
        dialogConfig
      );

      const statReqObj = {
        action: recruiter.rec_stat === 'Initiated' ? 'Approved' : 'Reject',
        id: recruiter.id,
        loginId: this.loginId,
      };
      console.log(statReqObj);
      dialogRef.afterClosed().subscribe(() => {
        this.recruiterServ
          .approve(statReqObj.action, statReqObj.id, statReqObj.loginId)
          .subscribe((response: any) => {
            console.log(JSON.stringify(response));
            if (dialogRef.componentInstance.allowAction) {
              if (response.status == 'Approved') {
                dataToBeSentToSnackBar.message = `Recruiter ${response.data} successfully`;
                dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );
              } else {
                //  alertify.success("recruiter " + response.data + " successfully");
                dataToBeSentToSnackBar.message = `Recruiter ${response.data} successfully`;
                dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );
              }
            }
            this.gty(this.page);
          });
      });
      // after closing popup
    }
    return;
  }

  // /**
  //  * handle page event - pagination
  //  * @param recruiter
  //  */
  // handlePageEvent(e: PageEvent) {
  //   this.pageEvent = e;
  //   this.length = e.length;
  //   this.pageSize = e.pageSize;
  //   this.pageIndex = e.pageIndex;
  // }

  getRecruiterRowClass(row : any){
    const recruitertype = row.recruitertype;
    // console.log('rowwwwwwwww', recruitertype);

    if (recruitertype === 'Recruiter') {
        return 'technical-recruiter';
    } else if (recruitertype === 'Bench Sales Recruiter') {
        return 'bench-sales-recruiter';
    } else if (recruitertype === 'Both') {
        return 'both-recruiters';
    } else {
        return '';
    }
  }

  filterRecruiters(recruiterType: string | null): void {
    if (recruiterType) {
      const filteredData = this.datarr.filter((recruiter) => recruiter.recruitertype === recruiterType);
      this.dataSource.data = filteredData;
    } else {
      this.dataSource.data = this.datarr;
    }
  }

   /**
   * handle page event - pagination
   * @param endor
   */
   handlePageEvent(event: PageEvent) {
    console.log('page.event', event.pageSize);
    if (event && event.pageIndex && event.pageSize) {
      this.pageEvent = event;
      this.pageSize = event.pageSize;
      this.assignToPage = event.pageIndex;
      const pageIndex = event.pageIndex === 0 ? 1 : event.pageIndex;
      this.pageIndex = pageIndex;
      return this.recruiterServ
        .getAllRecruitersPagination(
          this.hasAcces,
          this.loginId,
          pageIndex,
          event.length,
          this.field
        )
        .subscribe((response: any) => {
          this.datarr = response.data.content;
          this.dataSource.data = response.data.content;
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = i + 1;
          });
          this.totalItems = response.data.totalElements;
        });
    }
    return;
  }
  
}
