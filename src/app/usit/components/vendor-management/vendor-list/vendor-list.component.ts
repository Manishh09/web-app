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
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Recruiter } from 'src/app/usit/models/recruiter';
import { VendorService } from 'src/app/usit/services/vendor.service';

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
    'SerialNum', 'Company',
    'HeadQuarter','Fed-Id','VendorType', 'TierType',
    'AddedBy', 'AddedOn','LastUpdated','Status', 'Action','Approve/Reject'
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
   AssignedPageNum !: any;
   field = "empty";
  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.loginId = localStorage.getItem('userid');
    this.department = localStorage.getItem('department');
    this.AssignedPageNum = localStorage.getItem('vnum');
    //this.getall();
    if (this.AssignedPageNum == null) {
      this.getAllData();
    }
    else {
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
    return this.vendorServ.getAllVendorsByPagination(this.hasAcces, this.loginId, 1, this.itemsPerPage, this.field).subscribe(
      ((response: any) => {
        this.datarr = response.data.content;
        this.dataSource.data = response.data.content;
        // for serial-num {}
        this.dataSource.data.map( (x:any, i)=> {x.serialNum = i+1});
        this.totalItems = response.data.totalElements;

      })
    );
  }
  gty(page: any) {
    this.assignToPage = page;
    return this.vendorServ.getAllVendorsByPagination(this.hasAcces, this.loginId, page, this.itemsPerPage, this.field).subscribe(
      ((response: any) => {
        this.datarr = response.data.content;
        this.dataSource.data.map( (x:any, i)=> {x.serialNum = i+1});
        this.totalItems = response.data.totalElements;
      })
    );
  }
  /**
   * get all employee data
   * @returns employee data
   */
  getAllVendors() {
    return this.vendorServ
      .getAll()
      .subscribe((response: any) => {
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
            (a.addedby || '').localeCompare(b.addedby || '')
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
  addEmployee(){

  }
  /**
   * edit
   * @param emp
   */
  editEmployee(emp: unknown) {}
  /**
   * delete
   * @param emp
   */
  deleteEmployee(emp: unknown) {}
  /**
   * on status update
   * @param emp
   */
  onStatusUpdate(emp: unknown) {}
  /**
   * handle page event - pagination
   * @param emp
   */
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
}
