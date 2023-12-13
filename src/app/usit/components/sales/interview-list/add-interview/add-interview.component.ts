import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  get frm() {
    return this.interviewForm.controls;
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data && this.data.flag) {
      this.getFlag(this.data.flag.toLocaleLowerCase());
    }
    this.getsubdetails(this.flag);
    if (this.data.actionName === "edit-interview") {
      this.initializeInterviewForm(new InterviewInfo());
      this.interviewServ.getEntity(this.data.interviewData.intrid).subscribe(
        (response: any) => {
          this.entity = response.data;
          console.log(this.entity);

          this.initializeInterviewForm(response.data);
        }
      );
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




  private initializeInterviewForm(interviewData: InterviewInfo) {
    console.log('Interview Data:', interviewData);
    this.interviewForm = this.formBuilder.group({

      submission: this.formBuilder.group({
        submissionid: [interviewData ? interviewData.submission.submissionid : '', [Validators.required]],
      }),
      interviewflg: [this.data.flag ? this.data.flag.toLocaleLowerCase() : ''],
      interviewdate: [interviewData ? interviewData.interviewdate : '', Validators.required],
      timezone: [interviewData ? interviewData.timezone : '', Validators.required],
      round: [interviewData ? interviewData.round : '', Validators.required],
      mode: [interviewData ? interviewData.mode : '', Validators.required],
      feedback: [interviewData ? interviewData.feedback : '', Validators.required],
      interviewstatus: [interviewData ? interviewData.interviewstatus : '', Validators.required],
      users: this.formBuilder.group({
        userid: localStorage.getItem('userid'),
      }),
    });
    console.log('Form Values:', this.interviewForm.value);
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

    const saveReqObj = this.getSaveData();
    console.log('form.value  ===', saveReqObj);
    this.interviewServ
      .addORUpdateInterview(saveReqObj,this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data: any) => {
          if (data.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-interview'
                ? 'Interview added successfully'
                : 'Interview updated successfully';
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message = 'Interview already Exists';
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
