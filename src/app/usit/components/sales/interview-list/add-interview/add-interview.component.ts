import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { MatCardModule } from '@angular/material/card';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { InterviewService } from 'src/app/usit/services/interview.service';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { InterviewInfo } from 'src/app/usit/models/interviewinfo';
import { Closure } from 'src/app/usit/models/closure';

@Component({
  selector: 'app-add-interview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    SearchPipe,
    MatCardModule,
    NgxMatIntlTelInputComponent,
    NgxGpAutocompleteModule,
    MatRadioModule
  ],
  providers: [DatePipe],
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.scss']
})
export class AddInterviewComponent implements OnInit {

  interviewForm: any = FormGroup;
  interviewObj: any;
  submissiondata: any = [];
  flag!: any;
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddInterviewComponent>);
  private interviewServ = inject(InterviewService);
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private snackBarServ = inject(SnackBarService);
  submitted = false;
  selectOptionObj = {
    timeZone: TIME_ZONE,
    radioOptions: RADIO_OPTIONS,
  };
  entity: any;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  isRadSelected: any;
  isModeRadSelected: any;
  isStatusRadSelected: any;
  payrateFromVendor!:any;
  paymentwithctc!:any;
  intno !: string;
  onBoard!: any;
  closureFlag = false;
  closureForm : any = FormGroup;
  private datePipe = inject(DatePipe);
  intId: any;

  get frm() {
    return this.interviewForm.controls;
  }

  ngOnInit(): void {
    this.getFlag(this.data.flag.toLocaleLowerCase());
    this.getsubdetails(this.flag);
    if (this.flag == 'sales') {
      this.payrateFromVendor = "Pay Rate to Consultant";
      this.paymentwithctc = "Pay Rate From Vendor";
    }
    else if(this.flag == 'Recruiting') {
      this.payrateFromVendor = "Bill Rate from Client";
      this.paymentwithctc = "Pay Rate To Vendor";
    } else {

    }
    if (this.data.actionName === "edit-interview") {
      this.initializeInterviewForm(new InterviewInfo());
      this.interviewServ.getEntity(this.data.interviewData.intrid).subscribe(
        (response: any) => {
          console.log(response);
        // const ctc = response.data.submission.ratetype;
        // if((ctc=='1099' || ctc=='W2') && this.flag != 'sales'){
        //   this.paymentwithctc = "Pay Rate To Consultant";
        // }
        // else{
        //   this.paymentwithctc = "Pay Rate To Vendor";
        // }
        this.entity = response.data;
        this.intno = this.entity.interviewno;
        this.onBoard = this.entity.interviewstatus;
        this.intId = this.entity.intrid;
        if (this.onBoard == 'OnBoarded') {
          this.closureFlag = true;
          this.initializeClosureForm(new Closure())
          this.interviewServ.getClosureByIntId(this.entity.intrid).subscribe(
            (resp: any) => {
              console.log(response);
              this.initializeClosureForm(resp);
            }
          )
          this.initializeInterviewForm(response.data);
          
        }
        else {
          // this.closureFlag = false;
          this.initializeInterviewForm(response.data);
          if(this.onBoard === "Selected" || this.onBoard === "OnBoarded"){
            this.initializeClosureForm(new Closure())
          }
        }
      });
    } else {
      this.initializeInterviewForm(new InterviewInfo());
    }
  }

  getFlag(type: string){
    if (type === 'sales') {
      this.flag = 'sales';
    } else if(type === 'recruiting') {
      this.flag = "Recruiting";
    } else {
      this.flag = 'Domrecruiting';
    }
  }

  private initializeInterviewForm(interviewData: any) {
    this.interviewForm = this.formBuilder.group({
      submission: [interviewData ? interviewData.submission : '', [Validators.required]],
      flg: [this.data.flag ? this.data.flag.toLocaleLowerCase() : ''],
      interviewdate: [interviewData ? interviewData.interviewdate : '', Validators.required],
      timezone: [interviewData ? interviewData.timezone : '', Validators.required],
      round: [interviewData ? interviewData.round : '', Validators.required],
      mode: [interviewData ? interviewData.mode : '', Validators.required],
      feedback: [interviewData ? interviewData.feedback : '', Validators.required],
      interviewstatus: [interviewData ? interviewData.interviewstatus : '', [Validators.required]],
      users:localStorage.getItem('userid'),
      interviewno: [this.data.actionName === "edit-interview" ?  interviewData.interviewno : ''],
      intrid: [interviewData ? interviewData.intrid : ''],
      
    });
  }

  private initializeClosureForm(closureData: any) {
    console.log(closureData);
    this.closureForm = this.formBuilder.group({
      interviewid: [this.intId],
      closureid: [closureData.closureid],
      visaValidity: [closureData ? closureData.visaValidity : ''],
      projectDuration: [closureData ? closureData.projectDuration : ''],
      billRateVendor: [closureData ? closureData.billRateVendor : ''],
      billingCycle: [closureData ? closureData.billingCycle : ''],
      projectendtdate: [closureData ? closureData.projectendtdate : ''],
      projectStartDate: [closureData ? closureData.projectStartDate : ''],
      payRateConsultant: [closureData ? closureData.payRateConsultant : ''],
      vendorArPhoneNumber: [closureData ? closureData.vendorArPhoneNumber : ''],
      paymentCycle: [closureData ? closureData.paymentCycle : ''],
    });

    console.log(this.closureForm.value);

    this.interviewForm.get('interviewstatus').valueChanges.subscribe((res: any) => {
      const visaValidity = this.closureForm.get('visaValidity');
      const projectStartDate = this.closureForm.get('projectStartDate');
      const projectDuration = this.closureForm.get('projectDuration');
      const payRateConsultant = this.closureForm.get('payRateConsultant');
      const billRateVendor = this.closureForm.get('billRateVendor');
      const vendorArPhoneNumber = this.closureForm.get('vendorArPhoneNumber');
      const billingCycle = this.closureForm.get('billingCycle');
      const paymentCycle = this.closureForm.get('paymentCycle');
      const projectendtdate = this.closureForm.get('projectendtdate');
      if (res == "OnBoarded") {
        visaValidity.setValidators(Validators.required);
        projectStartDate.setValidators(Validators.required);
        projectDuration.setValidators(Validators.required);
        payRateConsultant.setValidators(Validators.required);
        billRateVendor.setValidators(Validators.required);
        vendorArPhoneNumber.setValidators(Validators.required);
        billingCycle.setValidators(Validators.required);
        paymentCycle.setValidators(Validators.required);
        projectendtdate.setValidators(Validators.required);
      }
      else {
        visaValidity.clearValidators();
        projectStartDate.clearValidators();
        projectDuration.clearValidators();
        payRateConsultant.clearValidators();
        billRateVendor.clearValidators();
        vendorArPhoneNumber.clearValidators();
        billingCycle.clearValidators();
        paymentCycle.clearValidators();
        projectendtdate.clearValidators();
      }
      visaValidity.updateValueAndValidity();
      projectStartDate.updateValueAndValidity();
      projectDuration.updateValueAndValidity();
      payRateConsultant.updateValueAndValidity();
      billRateVendor.updateValueAndValidity();
      vendorArPhoneNumber.updateValueAndValidity();
      billingCycle.updateValueAndValidity();
      paymentCycle.updateValueAndValidity();
      projectendtdate.updateValueAndValidity();
    });
  }

  userid!: any;
  role!: any;
  getsubdetails(flg: string) {
    this.userid = localStorage.getItem('userid');
    this.role = localStorage.getItem('role');
    this.interviewServ.getsubmissions(flg, this.userid, this.role).subscribe(
      (response: any) => {
        this.submissiondata = response.data;
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.interviewForm.invalid) {
      this.isRadSelected = true;
      this.isModeRadSelected = true;
      this.isStatusRadSelected = true;
      this.interviewForm.markAllAsTouched();
      this.displayFormErrors();
      return;
    }
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    console.log(this.closureForm.value);
    const saveReqObj = this.getSaveData();
    this.interviewServ
      .addORUpdateInterview(saveReqObj,this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'Success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-interview'
                ? 'Interview added successfully'
                : 'Interview updated successfully';
            if (resp.data.interviewstatus === "OnBoarded") {
              const visaValidityFormControl = this.closureForm.get('visaValidity');
              const projectStartFormControl = this.closureForm.get('projectStartDate');
              const projectEndFormControl = this.closureForm.get('projectendtdate')
              const formattedVisaValidity = this.datePipe.transform(visaValidityFormControl.value, 'yyyy-MM-dd');
              const formattedProjectStart = this.datePipe.transform(projectStartFormControl.value, 'yyyy-MM-dd');
              const formattedProjectEnd = this.datePipe.transform(projectEndFormControl.value, 'yyyy-MM-dd');
              visaValidityFormControl.setValue(formattedVisaValidity);
              projectStartFormControl.setValue(formattedProjectStart);
              projectEndFormControl.setValue(formattedProjectEnd);
              console.log(this.closureForm.value);
              this.interviewServ.addClosure(this.closureForm.value).subscribe({
                next: (response) => {
                  console.log("Closure Added Successfully",);
                },
                error: (err) => {
                  console.error("Error adding closure", err);

                }
              });

            }
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message = resp.message ? resp.message : 'Interview already Exists';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-interview'
              ? 'Interview addition is failed'
              : 'Interview updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.interviewForm.controls).forEach((field) => {
      const control = this.interviewForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  getSaveData() {
    if(this.data.actionName === 'edit-interview'){
      return {...this.entity, ...this.interviewForm.value}
    }
    return this.interviewForm.value;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onRadioChange(event: MatRadioChange){
    this.isRadSelected =  event.value
  }

  onModeRadioChange(event: MatRadioChange){
    this.isModeRadSelected =  event.value
  }

  onStatusRadioChange(event: MatRadioChange){
    this.isStatusRadSelected =  event.value
  }

  Closure(val: string) {
    if (val == 'true')
      this.closureFlag = true;
    else
      this.closureFlag = false;
  }
}

export const TIME_ZONE = [
  'AST', 'EST', 'EDT', 'CST', 'CDT', 'MST', 'MDT', 'PST', 'PDT', 'AKST', 'AKDT', 'HST', 'HAST', 'HADT', 'SST', 'SDT', 'CHST'
] as const;

export const RADIO_OPTIONS = {
  interviewround: [
    {value: 'First', id: 1 , selected: true},
    {value: 'Second', id: 2},
    {value: 'Third', id: 3},
  ],
  interviewmode: [
    {value: 'F2F', id: 1},
    {value: 'Skype', id: 2},
    {value: 'Telephonic', id: 3},
    {value: 'Webex', id: 4},
  ],
  interviewstatus: [
    {value: 'Schedule', id: 1},
    {value: 'Closed', id: 2},
    {value: 'Hold', id: 3},
    {value: 'Rejected', id: 4},
    {value: 'Selected', id: 5},
    {value: 'Back Out', id: 6},
  ]
}
