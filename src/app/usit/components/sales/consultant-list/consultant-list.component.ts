import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { Consultantinfo } from 'src/app/usit/models/consultantinfo';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AddconsultantComponent } from './add-consultant/add-consultant.component';
@Component({
  selector: 'app-consultant-list',
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
    MatTooltipModule
  ],
  templateUrl: './consultant-list.component.html',
  styleUrls: ['./consultant-list.component.scss'],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],

})
export class ConsultantListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  hasAcces!: any;
  consultant: Consultantinfo[] = [];
  consultant2 = new Consultantinfo();
  message: any;
  showAlert = false;
  submitted = false;
  flag = "";
  searchstring!: any;
  ttitle!: string;
  ttitle1!: string;
  tclass!: string;
  dept!: any;
  consultant_track: any[] = [];
  field = 'empty';
  // pagination code
  dataTableColumns: string[] = [
    'SerialNum',
    'Date',
    'Id',
    'Name',
    'TrackSI',
    'Email',
    'ContactNumber',
    'Visa',
    'CurrentLocation',
    'Company',
    'Position',
    'Experience',
    'Relocation',
    'Rate',
    'Priority',

    'Status',
    'Action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  // paginator
  totalItems = 0;
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = true;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private consultantServ = inject(ConsultantService);
  private activatedRoute =  inject(ActivatedRoute);
  private router = inject(Router)
  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  userid: any;
  page: number = 1;

  ngOnInit(): void {
    this.hasAcces = localStorage.getItem('role');
    this.userid = localStorage.getItem('userid');
    this.dept = localStorage.getItem('department');
    this.getFlag();

    this.getAllData();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
    //this.paginator.firstPage()
  }
  /**
   * get flag details
   */
  getFlag(){
    const routeData = this.activatedRoute.snapshot.data;
    if (routeData['isSalesConsultant']) { // sales consultant
      this.flag = "Sales";
      this.ttitle = "back to pre sales";
      this.ttitle1 = "move to sales";
      this.tclass = "move_item";
    }
    else if (routeData['isRecConsultant']) { // recruiting consutlant
      this.flag = "Recruiting";
      this.ttitle = "move to sales";
      this.ttitle1 = "back to pre sales";
      this.tclass = "move_item";
    }
    else { // presales
      this.flag = "presales";
      this.ttitle = "move to sales";
      this.ttitle1 = "back to pre sales";
      this.tclass = "bi bi-arrow-right-square-fill";
    }

    if((this.flag.toLocaleLowerCase() === 'presales' || this.flag.toLocaleLowerCase() === 'recruiting')){


      this.dataTableColumns.splice(15,0,"AddedBy")
    }
  }

  /**
   * pageIndex : default value is 1 , will get updated whenever the page number changes
   * @returns number of records based on pagenumber
   */
  getAllData(pageIndex = 1) {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

    return this.consultantServ
      .getAllConsultantData(
        'sales',
        this.hasAcces,
        this.userid,
        pageIndex,
        this.pageSize,
        this.field
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.consultant = response.data.content;
          this.dataSource.data = response.data.content;
          console.log(this.dataSource.data);
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;
          //  this.length = response.data.totalElements;
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          dataToBeSentToSnackBar.message = err.message;
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  /**
   * get data by pagination
   */
  getAllDataByPagination(pageIndex: number) {
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

    return this.consultantServ
      .getAllConsultantData(
        'sales',
        this.hasAcces,
        this.userid,
        pageIndex,
        this.pageSize,
        this.field
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.consultant = response.data.content;
          this.dataSource.data = response.data.content;
          console.log(this.dataSource.data);
          // for serial-num {}
          this.dataSource.data.map((x: any, i) => {
            x.serialNum = this.generateSerialNumber(i);
          });
          this.totalItems = response.data.totalElements;
          //  this.length = response.data.totalElements;
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          dataToBeSentToSnackBar.message = err.message;
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
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
        case 'Date':
          return (
            (isAsc ? 1 : -1) *
            (a.createddate || '').localeCompare(b.createddate || '')
          );
        case 'Company':
          return (
            (isAsc ? 1 : -1) *
            (a.companyname || '').localeCompare(b.companyname || '')
          );
        case 'Email':
          return (
            (isAsc ? 1 : -1) *
            (a.consultantemail || '').localeCompare(b.consultantemail || '')
          );
        case 'Id':
          return (
            (isAsc ? 1 : -1) *
            (a.consultantno || '').localeCompare(b.consultantno || '')
          );
        case 'Visa':
          return (
            (isAsc ? 1 : -1) *
            (a.visa_status || '').localeCompare(b.visa_status || '')
          );
        case 'ContactNumber':
          return (
            (isAsc ? 1 : -1) *
            (a.contactnumber || '').localeCompare(b.contactnumber || '')
          );
        case 'position':
          return (
            (isAsc ? 1 : -1) *
            (a.position || '').localeCompare(b.position || '')
          );
        case 'Status':
          return (
            (isAsc ? 1 : -1) * (a.status || '').localeCompare(b.status || '')
          );
        case 'CurrentLocation':
          return (
            (isAsc ? 1 : -1) *
            (a.currentlocation || '').localeCompare(b.currentlocation || '')
          );

        case 'Experience':
          return (
            (isAsc ? 1 : -1) *
            (a.experience || '').localeCompare(b.experience || '')
          );
        case 'Relocation':
          return (
            (isAsc ? 1 : -1) *
            (a.relocation || '').localeCompare(b.relocation || '')
          );
        case 'Rate':
          return (
            (isAsc ? 1 : -1) *
            (a.hourlyrate || '').localeCompare(b.hourlyrate || '')
          );
        case 'Priority':
          return (
            (isAsc ? 1 : -1) *
            (a.priority || '').localeCompare(b.priority || '')
          );
        default:
          return 0;
      }
    });
  }

  navTo(to: string, id: any){
    this.router.navigate([`usit/user/${to.toLocaleLowerCase()}-consultant/${id}`])
  }
  /**
   *
   * @param element
   * @param type
   */
  goToConsultantInfo(element: any, flag: string) {
    // open popup with that data
  }
  /**
   * on track
   */
  goToConsultantDrillDownReport(
    element: any,
    type: 'interview' | 'submission'
  ) {
    // open popup
  }
  consultant_data: any[] = [];
  getDrilldownRport(id: any, status: any) {
    const drilldownReportObj: ReportVo = {
      id: id,
      startDate: '2020-06-01',
      endDate: '2030-06-01',
      groupby: 'consultant',
      status: status,
    };

    return this.consultantServ
      .consultant_DrillDown_report(drilldownReportObj)
      .subscribe((response: any) => {
        this.consultant_data = response.data;
        ///  console.log(JSON.stringify(response.data))
      });
  }

  /**
   *
   * @param consultant
   */
  moveProfileToSales(consultant: any){

  }
  /**
   * Add
   * Send this.flag value - to distinguish sales , recruiting, presales
   */
  addConsultant() {
    const actionData = {
      title: 'Add Consultant',
      consultantData: null,
      flag: this.flag,
      actionName: 'add-consultant',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    // dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-consultant';
    dialogConfig.data = actionData;

    //this.dialogServ.openDialogWithComponent(AddconsultantComponent, dialogConfig);

    const dialogRef = this.dialogServ.openDialogWithComponent(AddconsultantComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        this.getAllData(this.currentPageIndex + 1);
      }
    })

  }
  /**
   * Edit / Update
   */
  editConsultant(consultant: any) {
    const actionData = {
      title: 'Update Consultant',
      consultantData: consultant,
      actionName: 'edit-consultant',
      flag: this.flag
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    // dialogConfig.height = "100vh";
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'edit-consultant';
    dialogConfig.data = actionData;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddconsultantComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        this.getAllData(this.currentPageIndex + 1);
      }
    })
  }
  /**
   * Delete
   */
  deleteConsultant(consultant: any) {}
  // status update
  onStatusUpdate(consultant: any) {
    const dataToBeSentToDailog = {
      title: 'Status Update',
      updateText:
        consultant.status !== 'Active' ? 'activating' : 'in-activating',
      type: 'Consultant',
      buttonText: 'Update',
      actionData: consultant,
      actionName: 'update-consultant-status',
    };
    const dialogConfig = this.getDialogConfigData(dataToBeSentToDailog, {
      delete: false,
      edit: false,
      add: false,
      updateSatus: true,
    });
    const dialogRef = this.dialogServ.openDialogWithComponent(
      StatusComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe({
      next: (resp) => {
        if (dialogRef.componentInstance.submitted) {
          consultant.remarks = dialogRef.componentInstance.remarks;
          // this.callChangeEmpStatusAPI(emp);
        }
      },
    });
  }
  private getDialogConfigData(
    dataToBeSentToDailog: Partial<IConfirmDialogData>,
    action: {
      delete: boolean;
      edit: boolean;
      add: boolean;
      updateSatus?: boolean;
    }
  ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width =
      action.edit || action.add
        ? '65vw'
        : action.delete
        ? 'fit-content'
        : '400px';
    dialogConfig.height = 'auto';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = dataToBeSentToDailog.actionName;
    dialogConfig.data = dataToBeSentToDailog;
    return dialogConfig;
  }
  /**
   * handle page event - pagination
   * @param endor
   */
  handlePageEvent(event: PageEvent) {
    console.log('page.event', event);
    if (event) {
      this.pageEvent = event;
      this.currentPageIndex = event.pageIndex;
      this.getAllData(event.pageIndex + 1)
    }
    return;
  }
  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * this.pageSize + index + 1;
    return serialNumber;
  }
  /**
   * clean up
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}

export interface ReportVo {
  startDate: any;
  endDate: any;
  groupby: string;
  status: string;
  id: number;
}
