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
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { Recruiter } from 'src/app/usit/models/recruiter';
import { VendorService } from 'src/app/usit/services/vendor.service';
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
  styleUrls: ['./recruiter-list.component.scss']
})
export class RecruiterListComponent implements OnInit{
  dataTableColumns: string[] = [
    'SerialNum', 'Company', 'RecruiterName',
    'PhoneNumber','Email','AddedBy', 'AddedOn',
    'LastUpdated','Status', 'Action','Approve/Reject'
  ];

  dataSource = new MatTableDataSource([]);

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
  // pagination code
  page: number = 1;
  itemsPerPage = 50;
  AssignedPageNum !: any;
  field = "empty";

  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.loginId = localStorage.getItem('userid');
    this.department = localStorage.getItem('department');
    this.AssignedPageNum = localStorage.getItem('rnum');
    console.log(this.hasAcces, this.loginId, this.department, this.AssignedPageNum);
    // //this.getall();
    // if (this.AssignedPageNum == null) {
    //   this.getAllData();
    // }
    // else {
    //   this.gty(this.AssignedPageNum);
    //   this.page = this.AssignedPageNum;
    // }

   this.getAllData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllData() {
    return this.recruiterServ. getAllRecruitersPagination(this.hasAcces, this.loginId, 1, this.itemsPerPage, this.field).subscribe(
      ((response: any) => {
        this.datarr = response.data.content;
        this.dataSource.data = response.data.content;
        console.log(this.dataSource.data);
        // for serial-num {}
        this.dataSource.data.map( (x:any, i)=> {x.serialNum = i+1});
        this.totalItems = response.data.totalElements;

      })
    );
  }
  gty(page: any) {
    this.assignToPage = page;
    return this.recruiterServ. getAllRecruitersPagination(this.hasAcces, this.loginId, page, this.itemsPerPage, this.field).subscribe(
      ((response: any) => {
        this.datarr = response.data.content;
        this.dataSource.data.map( (x:any, i)=> {x.serialNum = i+1});
        this.totalItems = response.data.totalElements;
      })
    );
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
            (isAsc ? 1 : -1) * (a.headquerter || '').localeCompare(b.headquerter || '')
          );
        case 'Fed-Id':
          return (
            (isAsc ? 1 : -1) *
            (a.fedid || '').localeCompare(b.fedid || '')
          );
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
        case 'Status':
          return (
            (isAsc ? 1 : -1) * (a.status || '').localeCompare(b.status || '')
          );
        case 'Approve/Reject':
          return (
            (isAsc ? 1 : -1) * (a.vms_stat || '').localeCompare(b.vms_stat || '')
          );
        default:
          return 0;
      }
    });
  }

  /**
   * add
   */
  addRecruiter() {
    const actionData = {
      title: 'Add Vendor',
      vendorData: null,
      actionName: 'add',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    //dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-recruiter';
    dialogConfig.data = actionData;

    this.dialogServ.openDialogWithComponent(AddRecruiterComponent, dialogConfig);
  }

  /**
   * handle page event - pagination
   * @param endor
   */
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
  
}
