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
import { MatRadioModule } from '@angular/material/radio';

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
    interviewRound: INTERVIEW_ROUND,
    interviewMode: INTERVIEW_MODE,
    status: STATUS,
  };
  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.flag = this.activatedRoute.snapshot.params['flg'];
    if (this.flag == 'sales') {
      this.flag = "sales";
    }
    else {
      this.flag = "Recruiting";
    }
    if(this.data.actionName === "edit-interview"){
      this.bindFormControlValueOnEdit();
    }
    this.initializeSubmissionForm();
  }

  private bindFormControlValueOnEdit() {
    // snackbar
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    this.initializeSubmissionForm();
    // api call
    this.interviewServ.getEntity(this.data.interviewData.intrid).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response && response.interviewData) {
          this.interviewObj = response.interviewData;
          //init form and  update control values on edit
          // this.initializeSubmissionForm(this.interviewObj);
        }
      }, error: err =>{
        dataToBeSentToSnackBar.message = err.message;
        dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      }
    });
  }


  private initializeSubmissionForm() {

    this.interviewForm = this.formBuilder.group({

      submission: this.formBuilder.group({
        submissionid: ['', [Validators.required]],
      }),
      flg: this.flag,
      interviewdate: ['', Validators.required],
      timezone: ['', Validators.required],
      round: ['', Validators.required],
      mode: ['', Validators.required],
      feedback: ['', Validators.required],
      interviewstatus: ['', Validators.required],
      users: this.formBuilder.group({
        userid: localStorage.getItem('userid'),
      }),
    });
    // if (this.data.actionName === 'edit-interview') {
      
    // }
    // this.validateControls(this.data.actionName);
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
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

    if (this.interviewForm.invalid) {
      this.displayFormErrors();
      return;
    }
    const saveReqObj = this.getSaveData();
    console.log('form.value  ===', saveReqObj);
    this.interviewServ
      .addORUpdateInterview(saveReqObj, this.data.actionName)
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

  getSaveData() {}

  onCancel() {
    this.dialogRef.close();
  }
}

export const TIME_ZONE = [
  'AST', 'EST', 'EDT', 'CST', 'CDT', 'MST', 'MDT', 'PST', 'PDT', 'AKST', 'AKDT', 'HST', 'HAST', 'HADT', 'SST', 'SDT', 'CHST'
] as const;

export const INTERVIEW_ROUND = ['First (L1)', 'Second (L2)', 'Third (Client)'] as const;

export const INTERVIEW_MODE = ['F2F', 'Skype', 'Telephonic', 'Webex'] as const;

export const STATUS = [
  'Schedule',
  'Closed',
  'Hold',
  'Rejected',
  'Selected',
  'Back Out'
] as const;