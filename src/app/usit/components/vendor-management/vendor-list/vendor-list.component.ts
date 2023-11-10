import { CommonModule } from '@angular/common';
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
import { MatIconModule } from '@angular/material/icon';
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
import { VendorService } from 'src/app/usit/services/vendor.service';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss'],
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
export class VendorListComponent implements OnInit {
  dataTableColumns: string[] = [
    'SerialNum',
    'Company',
    'HeadQuarter',
    //'Fed-Id',
    'VendorType',
    'TierType',
    'AddedBy',
    'AddedOn',
    'LastUpdated',
    // 'Status',
    'Action',
    'Approve/Reject',
  ];
  dataSource = new MatTableDataSource<any>([]);
  // paginator
  length = 50;
  pageSize = 0;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private vendorServ = inject(VendorService);
  hasAcces!: any;
  loginId!: any;
  department!: any;
  assignToPage: any;
  datarr: any[] = [];
  recrData: Recruiter[] = [];
  entity: any[] = [];
  totalItems: any;
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum!: any;
  field = 'empty';
  isRejected: boolean = false;
  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.loginId = localStorage.getItem('userid');
    this.department = localStorage.getItem('department');
    this.AssignedPageNum = localStorage.getItem('vnum');
    //this.getall();
    if (this.AssignedPageNum == null) {
      this.getAllData();
    } else {
      this.gty(this.AssignedPageNum);
      this.page = this.AssignedPageNum;
    }

    // this.getAllVendors();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getAllData() {
    return this.vendorServ
      .getAllVendorsByPagination(
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
        this.length = response.data.totalPages;
      });
  }
  gty(page: any) {
    this.assignToPage = page;
    return this.vendorServ
      .getAllVendorsByPagination(
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
        this.length = response.data.totalPages;
      });
  }
  /**
   * get all vendor data
   * @returns vendor data
   */
  getAllVendors() {
    return this.vendorServ.getAll().subscribe((response: any) => {
      console.log('vendor.data', response.data);
      if (response.data) {
        this.dataSource.data = response.data;
      }
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
      switch (activeSortHeader) {
        case 'SerialNum':
          return (
            (isAsc ? 1 : -1) *
            (a.serialNum || '').localeCompare(b.serialNum || '')
          );
        case 'Company':
          return (
            (isAsc ? 1 : -1) * (a.company || '').localeCompare(b.company || '')
          );
        case 'HeadQuarter':
          return (
            (isAsc ? 1 : -1) *
            (a.headquerter || '').localeCompare(b.headquerter || '')
          );
        // case 'Fed-Id':
        //   return (
        //     (isAsc ? 1 : -1) *
        //     (a.fedid || '').localeCompare(b.fedid || '')
        //   );
        case 'VendorType':
          return (
            (isAsc ? 1 : -1) *
            (a.vendortype || '').localeCompare(b.vendortype || '')
          );
        case 'TierType':
          return (
            (isAsc ? 1 : -1) *
            (a.tyretype || '').localeCompare(b.tyretype || '')
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
            (a.vms_stat || '').localeCompare(b.vms_stat || '')
          );
        default:
          return 0;
      }
    });
  }
  /**uplload
   *
   */
  uploadVendor() {}
  /**
   * add
   */
  addVendor() {
    const actionData = {
      title: 'Add Vendor',
      vendorData: null,
      actionName: 'add',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    // dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-vendor';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(AddVendorComponent, dialogConfig);
  }
  /**
   * edit
   * @param endor
   */
  editVendor(vendor: any) {
    const actionData = {
      title: 'Update Vendor',
      vendorData: vendor,
      actionName: 'edit',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    //dialogConfig.height = '100vh';
    dialogConfig.panelClass = 'edit-vendor';
    dialogConfig.data = actionData;
    this.dialogServ.openDialogWithComponent(AddVendorComponent, dialogConfig);
  }
  /**
   * delete
   * @param vendor
   */
  deleteVendor(vendor: any) {
    const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
      title: 'Confirmation',
      message: 'Are you sure you want to delete?',
      confirmText: 'Yes',
      cancelText: 'No',
      actionData: vendor,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'delete-vendor';
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

          this.vendorServ
            .deleteEntity(vendor.id)
            .subscribe((response: any) => {
              if (response.status == 'Success') {
                // this.gty(this.page);
                this.getAllData();
                dataToBeSentToSnackBar.message = 'Vendor Deleted successfully';
              } else {
                dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
                dataToBeSentToSnackBar.message = 'Record Deletion failed';
              }
              this.snackBarServ.openSnackBarFromComponent(
                dataToBeSentToSnackBar
              );
            });
        }
      },
    });
  }
  /**
   * on status update
   * @param vendor
   */
  onStatusUpdate(vendor: any) {
    const dataToBeSentToDailog = {
      title: 'Status Update',
      updateText: vendor.status !== 'Active' ? 'activating' : 'in-activating',
      type: 'Vendor',
      buttonText: 'Update',
      actionData: vendor,
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'update-vendor-status';
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
          vendor.remarks = dialogRef.componentInstance.remarks;
          this.vendorServ
            .changeStatus2(vendor.id, vendor.status, vendor.remarks)
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
  //public action(id: number, ctype: string, action: string) {
  onApproveOrRejectVMS(vendor: any, rejectVendor = false) {
    this.isRejected = rejectVendor;
    if (vendor.vms_stat !== 'Approved') {
      const dataToBeSentToSnackBar: ISnackBarData = {
        message: 'Status updated successfully!',
        duration: 1500,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        direction: 'above',
        panelClass: ['custom-snack-success'],
      };
      if (this.department == vendor.ctype) {
        // alertify.error("Your not Authorized to approve the Vendor");
        dataToBeSentToSnackBar.message =
          'You are not Authorized to approve the Vendor';
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        return;
      }

      const dataToBeSentToDailog: Partial<IConfirmDialogData> = {
        title:
          vendor.vms_stat == 'Initiated' && !rejectVendor
            ? 'Approve Vendor'
            : 'Reject Vendor',
        message:
          vendor.vms_stat == 'Initiated' && !rejectVendor
            ? 'Are you sure you want to Approve the Vendor ?'
            : 'Are you sure you want to Reject the Vendor ?',
        confirmText: 'Yes',
        cancelText: 'No',
        actionData: vendor,
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = 'fit-content';
      dialogConfig.height = 'auto';
      dialogConfig.disableClose = false;
      dialogConfig.panelClass = `${
        vendor.vms_stat == 'Initiated' && !rejectVendor ? 'approve' : 'reject'
      }-vendor`;
      dialogConfig.data = dataToBeSentToDailog;
      const dialogRef = this.dialogServ.openDialogWithComponent(
        ConfirmComponent,
        dialogConfig
      );

      const statReqObj = {
        action: vendor.vms_stat === 'Initiated' ? 'Approved' : 'Reject',
        id: vendor.id,
        loginId: this.loginId,
      };
      dialogRef.afterClosed().subscribe(() => {
        this.vendorServ
          .approvevms(statReqObj.action, statReqObj.id, statReqObj.loginId)
          .subscribe((response: any) => {
            console.log(JSON.stringify(response));
            if (dialogRef.componentInstance.allowAction) {
              if (response.status == 'Approved') {
                dataToBeSentToSnackBar.message = `Vendor ${response.data} successfully`;
                dataToBeSentToSnackBar.panelClass = ['custom-snack-success'];
                this.snackBarServ.openSnackBarFromComponent(
                  dataToBeSentToSnackBar
                );
              } else {
                //  alertify.success("Vendor " + response.data + " successfully");
                dataToBeSentToSnackBar.message = `Vendor ${response.data} successfully`;
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
      return this.vendorServ
        .getAllVendorsByPagination(
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

  getVendorRowClass(row : any){
    const companytype = row.companytype;
    // console.log('rowwwwwwwww', recruitertype);

    if (companytype === 'Recruiting') {
        return 'recruiting-companies';
    } else if (companytype === 'Bench Sales') {
        return 'bench-sales-recruiter';
    } else if (companytype === 'Both') {
        return 'both';
    } else {
        return '';
    }
  }

  filterVendors(vendorType: string | null): void {
    if (vendorType) {
      const filteredData = this.datarr.filter((vendor) => vendor.companytype === vendorType);
      this.dataSource.data = filteredData;
    } else {
      this.dataSource.data = this.datarr;
    }
  }
}
