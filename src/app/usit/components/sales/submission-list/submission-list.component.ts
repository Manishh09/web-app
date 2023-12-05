import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef,
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
  MatPaginatorIntl,
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
// import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { StatusComponent } from 'src/app/dialogs/status/status.component';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { Subject, takeUntil } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorIntlService } from 'src/app/services/paginator-intl.service';
import { SubmissionService } from 'src/app/usit/services/submission.service';
import { ActivatedRoute } from '@angular/router';
import { AddSubmissionComponent } from './add-submission/add-submission.component';

@Component({
  selector: 'app-submission-list',
  standalone: true,
  imports: [MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    MatTooltipModule],
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.scss']
})
export class SubmissionListComponent {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Dos',
    'Id',
    'Consultant',
    'Requirement',
    'ImplementationPartner',
    'EndClient',
    'Vendor',
    'SubRate',
    'ProjectLocation',
    'SubmittedBy',
    'SubStatus',
    'Action',
  ];
  entity: any;
  hasAcces!: any;
  message: any;
  showAlert = false;
  submitted = false;
  flag!: any;
  searchstring!: any;
  ttitle!: string;
  ttitle1!: string;
  tclass!: string;
  dept!: any;
  consultant_track: any[] = [];
  field = 'empty';
  totalItems = 0;
  pageSize = 50;
  currentPageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = true;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;
  itemsPerPage = 50;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private submissionServ = inject(SubmissionService);
  private  activatedRoute= inject(ActivatedRoute);


  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  userid: any;
  page: number = 1;

  ngOnInit(): void {

    this.userid = localStorage.getItem('userid');
    const routeData = this.activatedRoute.snapshot.data;
    if (routeData['isSaleSub']) { // sales consultant
      this.flag = "sales";
    }
    else if (routeData['isRecSub']) { // recruiting consutlant
      this.flag = "Recruiting";
    }
   
    else{
      this.flag = "DomRecruiting";
    }
    this.hasAcces = localStorage.getItem('role');
    this.userid = localStorage.getItem('userid');
    this.getAllData();


  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getAllData() {
    this.submissionServ.getsubmissiondataPagination(this.flag, this.hasAcces, this.userid, 1, this.itemsPerPage, this.field).subscribe(
      (response: any) => {
        this.entity = response.data.content;
        this.dataSource.data =  response.data.content;  
        console.log(this.dataSource.data);
        this.totalItems = response.data.totalElements;
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      }
    )
  }

  onFilter(event: any) {

  }

  onSort(event: any) {

  }

  goToSubmissionInfo(element: any, flag: any) {

  }

  goToSubmissionDrillDownReport(element: any, flag: any) {

  }

  addSubmission() {
    const actionData = {
      title: 'Add Vendor',
      vendorData: null,
      actionName: 'add-vendor',
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65vw';
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'add-vendor';
    dialogConfig.data = actionData;

    const dialogRef = this.dialogServ.openDialogWithComponent(AddSubmissionComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      if(dialogRef.componentInstance.submitted){
        this.getAllData();
      }
    })
  }

  editConsultant(consultant: any) {

  }

  deleteConsultant(consultant: any) {

  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

}
