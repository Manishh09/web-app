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
import { Vms } from 'src/app/usit/models/vms';
import { MatCardModule } from '@angular/material/card';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
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
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SubmissionService } from 'src/app/usit/services/submission.service';

@Component({
  selector: 'app-add-submission',
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
    MatRadioModule,
    MatCheckboxModule
  ],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({
        apiKey: 'AIzaSyCT0z0QHwdq202psuLbL99GGd-QZMTm278',
        libraries: ['places'],
      }),
    },
  ],
  templateUrl: './add-submission.component.html',
  styleUrls: ['./add-submission.component.scss']
})
export class AddSubmissionComponent implements OnInit{

  submissionForm: any = FormGroup;
  submitted = false;
  requirementdata: any = [];
  consultdata: any = [];
  vendordata: any = [];
  private formBuilder = inject(FormBuilder);
  private submissionServ = inject(SubmissionService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBarServ = inject(SnackBarService);

  searchObs$!: Observable<any>;
  selectOptionObj = {
    sourceType: SOURCE_TYPE
  };
  address = '';
  options = {
    componentRestrictions: { country: ['IN', 'US'] },
  };
  flgOpposite !: string;
  flag!: any;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddSubmissionComponent>
  ) {}

  ngOnInit(): void {
    this.flag = this.activatedRoute.snapshot.params['flg'];
    if (this.flag == 'sales') {
      this.flag = "sales";
      this.flgOpposite = "Recruiter";
    }
    else {
      this.flgOpposite = "Bench Sales";
      this.flag = "Recruiting";
      this.getRequirements();
    }
    if(this.data.actionName === "edit-submission"){
      // this.bindFormControlValueOnEdit();
    }
    this.initilizeSubmissionForm(new Vms());
    this.getCompany();
    this.getConsultant(this.flag);
  }


  private initilizeSubmissionForm(submissionData: any) {
    
    this.submissionForm = this.formBuilder.group({

      // user: this.formBuilder.group({
      //   userid: localStorage.getItem('userid'),
      // }),

      // flg: [],

      requirement: this.formBuilder.group({
        requirementid:  ['', [Validators.required]],
      }),
      consultant: this.formBuilder.group({
        consultantid: [submissionData ? submissionData.consultantid : '', [Validators.required]],
      }),
      position: [submissionData ? submissionData.position : '', [Validators.required]],
      ratetype: [submissionData ? submissionData.ratetype : '', [Validators.required]],
      submissionrate: [submissionData ? submissionData.submissionrate : '', [Validators.required]],
      endclient: [submissionData ? submissionData.endclient : '', [Validators.required]],
      implpartner: [submissionData ? submissionData.implpartner : '', [Validators.required]],
      vendor: this.formBuilder.group({
        vmsid: '',
      }),
      recruiter: this.formBuilder.group({
        recid: '',
      }),
      empcontact: ['', [Validators.required]],
      empmail: [
        submissionData ? submissionData.empmail : '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      source: [submissionData ? submissionData.source : '', [Validators.required]],
      projectlocation: [submissionData ? submissionData.projectlocation : '', [Validators.required]],
    });

  } 

  getRequirements() {
    this.submissionServ.getRequirements().subscribe(
      (response: any) => {
        this.requirementdata = response.data;
      }
    )
  }

  requirements(event: any) {
    const newVal = event.target.value;
    this.submissionServ.getRequirementByIdDropdown(newVal).subscribe(
      (response: any) => {
        this.submissionForm.get("position").setValue(response.data.jobtitle);
        this.address = response.data.location;
        this.submissionForm.get("ratetype").setValue(response.data.employmenttype);
        this.submissionForm.get("endclient").setValue(response.data.client);
        this.submissionForm.get("implpartner").setValue(response.data.vendor);
      }
    );
    if (newVal == '') {
      this.submissionForm.get("position").setValue('');
      this.address = '';
      this.submissionForm.get("ratetype").setValue('');
      this.submissionForm.get("endclient").setValue('');
      this.submissionForm.get("implpartner").setValue('');
    }
  }

  getConsultant(flg: string) {
    flg = 'recruiting';
    this.submissionServ.getConsultantDropdown(flg).subscribe(
      (response: any) => {
        this.consultdata = response.data;
      })
  }

  handleAddressChange(address: any) {
    this.submissionForm.controls['location'].setValue(address.formatted_address);
  }

  get controls() {
    return this.submissionForm.controls;
  }

  flg!: any;
  getCompany() {
    this.flg = localStorage.getItem('department');
    console.log(this.flg);
    const role = localStorage.getItem('role');
    if (role == 'Super Admin' || role == 'Admin' || role == 'Manager') {
      this.flg = "all";
    }
    this.submissionServ.getCompanies(this.flg).subscribe(
      (response: any) => {
        console.log('Response:', response);
        this.vendordata = response.data;
         console.log(response.data)
      }
    )
  }

  recruiterName: any[] = [];
  recruiterList(event: any) {
    const newVal = event.target.value;
    this.submissionServ.getRecruiterOfTheVendor(newVal, this.flgOpposite).subscribe(
      (response: any) => {
        this.recruiterName = response.data;
      }
    );
  }

  selectedItems: ContactInfo[] = [];
  recruiterContact(event: any) {
    const newVal = event.target.value;
    this.recruiterName.forEach(item => {
      if (newVal.includes(item.id)) {
        this.selectedItems.push(item);
      }
    });
    this.selectedItems.forEach(item => {
      this.submissionForm.get("empcontact").patchValue(item.usnumber);
      this.submissionForm.get("empmail").patchValue(item.email);

    });
  }

  goToVendorList() {
    this.dialogRef.close();
    this.router.navigate(['/usit/vendors']);
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

    if (this.submissionForm.invalid) {
      this.displayFormErrors();
      return;
    }
    const saveReqObj = this.getSaveData();
    console.log('form.value  ===', saveReqObj);
    this.submissionServ
      .addORUpdateSubmission(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data: any) => {
          if (data.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-submission'
                ? 'Submission added successfully'
                : 'Submission updated successfully';
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message = 'Submission already Exists';
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err) => {
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-submission'
              ? 'Submission addition is failed'
              : 'Submission updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.submissionForm.controls).forEach((field) => {
      const control = this.submissionForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  getSaveData() {

  }

  onCancel() {
    this.dialogRef.close();
  }
}

export const SOURCE_TYPE = [
  'ATS',
  'Internal Req',
  'Internal Bench',
  'Dice',
  'Tech Fetch',
  'CareerBuilder',
  'Monster',
  'Job Portal',
  'LinkedIn',
  'Mass Mail',
  'Personal',
  'Reference',
  'Other',
] as const;

class ContactInfo {
  company!: string;
  email!: string;
  usnumber!: string;
  id!: string;
  recruiter!: string;
}
