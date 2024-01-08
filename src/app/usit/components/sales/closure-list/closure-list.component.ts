import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InterviewService } from 'src/app/usit/services/interview.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-closure-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './closure-list.component.html',
  styleUrls: ['./closure-list.component.scss']
})
export class ClosureListComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'Company',
    'ConsultantName',
    'ConsultantEmail',
    'Contact',
    'Visa',
    'VisaValidity',
    'Client',
    'ImplPartner',
    'Vendor',
    'Recruiter',
    'RateType',
    'Rate',
    'Employee',
    'RateFromVendor',
    'RateToConsultant',
    'BillingCycle',
    'PaymentCycle',
    'ProjectStartDate',
    'VendorArContact'
  ];
  flag!: string;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private interviewServ = inject(InterviewService);
  private destroyed$ = new Subject<void>();
  entity: any[] = [];
  totalItems: any;
  closureCount!: number;
  currentPageIndex = 0;

  ngOnInit(): void {
    this.getFlag();
    this.getAll();
  }

  getFlag(){
    const routeData = this.activatedRoute.snapshot.data;
    if (routeData['isSalesClosure']) {
      this.flag = "Sales";

    } else if (routeData['isRecClosure']) { 
      this.flag = "Recruiting";
    }
    else {
      this.flag = "Domrecruiting";
    }
  }

  getAll() {
    this.interviewServ.getOnboardedDetails(this.flag).pipe(takeUntil(this.destroyed$)).subscribe(
      (response: any) => {
        this.entity = response.data;
        this.dataSource.data = response.data;
        this.closureCount = this.entity.length
        this.totalItems = response.data.totalElements;
        // for serial-num {}
        this.dataSource.data.map((x: any, i) => {
          x.serialNum = this.generateSerialNumber(i);
        });
      }
    )
  }

  applyFilter(event: any) {

  }

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }

  navigateToDashboard() {
    this.router.navigateByUrl('/usit/dashboard');
  }

  ngOnDestroy(): void {}

}
