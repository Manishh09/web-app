import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
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
import {MatRadioChange, MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SubmissionService } from 'src/app/usit/services/submission.service';
import { SubmissionInfo } from 'src/app/usit/models/submissioninfo';


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
  consultantdata: any = [];
  vendordata: any = [];
  private formBuilder = inject(FormBuilder);
  private submissionServ = inject(SubmissionService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBarServ = inject(SnackBarService);

  searchObs$!: Observable<any>;
  selectOptionObj = {
    sourceType: SOURCE_TYPE,
    radioOptions: RADIO_OPTIONS
  };
  address = '';
  options = {
    componentRestrictions: { country: ['IN', 'US'] },
  };
  flgOpposite !: string;
  flag!: string;
  entity = new SubmissionInfo();
  isRadSelected: any;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddSubmissionComponent>
  ) {}

  get frm() {
    return this.submissionForm.controls;
  }

  ngOnInit(): void {
    this.getCompany();
    this.getFlag(this.data.flag.toLocaleLowerCase());
    this.getConsultant(this.flag)
    if(this.data.actionName === "edit-submission"){
      this.initilizeSubmissionForm(new SubmissionInfo());
      this.submissionServ.getsubdetailsbyid(this.data.submissionData.submissionid).subscribe(
        (response: any) => {
          this.entity = response.data;
          this.recruiterList(response.data.vendor.vmsid);
          this.initilizeSubmissionForm(response.data);
        }
      );
    } else {
      this.initilizeSubmissionForm(new SubmissionInfo());
    }
  }

  getFlag(type: string){
    if (type === 'sales') {
      this.flag = 'sales';
      this.flgOpposite = "Recruiter";
    } else if(type === 'recruiting') { 
      this.flag = 'Recruiting';
      this.flgOpposite = "Bench Sales";
      this.getRequirements();
    }
     else {
      this.flag = 'Domrecruiting';
    }
  }


  private initilizeSubmissionForm(submissionData: any) {
    
    this.submissionForm = this.formBuilder.group({

      // user: this.formBuilder.group({
      //   userid: localStorage.getItem('userid'),
      // }),

      // flg: [],

      requirement: this.formBuilder.group({
        requirementid:  [submissionData ? submissionData?.requirement?.requirementid : '', [Validators.required]],
      }),
      consultant: this.formBuilder.group({
        consultantid: [submissionData ? submissionData?.consultant?.consultantid : '', [Validators.required]],
      }),
      position: [submissionData ? submissionData.position : '', [Validators.required]],
      ratetype: [submissionData ? submissionData.ratetype : '', [Validators.required]],
      submissionrate: [submissionData ? submissionData.submissionrate : '', [Validators.required]],
      endclient: [submissionData ? submissionData.endclient : '', [Validators.required]],
      implpartner: [submissionData ? submissionData.implpartner : '', [Validators.required]],
      vendor: this.formBuilder.group({
        vmsid: [submissionData ? submissionData.vendor.vmsid : '', [Validators.required]],
      }),
      recruiter: this.formBuilder.group({
        recid: [submissionData ? submissionData.recruiter.recid : '', [Validators.required]],
      }),
      empcontact: [submissionData ? submissionData.empcontact : '', [Validators.required]],
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
      submissionflg: [this.data.flag ? this.data.flag.toLocaleLowerCase() : ''],
    });
    console.log('Consultant ID Value:', submissionData?.consultant?.consultantid);
    this.submissionForm.get('consultant.consultantid')?.setValue(submissionData?.consultant?.consultantid);
    console.log('Form Value After Setting Consultant ID:', this.submissionForm.value);
    // this.submissionForm.patchValue(submissionData);
    this.validateControls();
  } 

  private validateControls() {
    const requirement = this.submissionForm.get('requirement');
    console.log(requirement);
    if (this.flag == 'Recruiting') {
      requirement.setValidators(Validators.required);
    }
    else {
      requirement.clearValidators();
      this.submissionForm.get("requirement.requirementid").patchValue("null");
    }
    requirement.updateValueAndValidity();
    this.submissionForm.get('ratetype').valueChanges.subscribe((res: any) => {
      const vendor = this.submissionForm.get('vendor.vmsid');
      const recruiter = this.submissionForm.get("recruiter.recid");
      const empmail = this.submissionForm.get('empmail');;
      if (res == '1099' || res == 'W2' || res == 'Full Time') {
        vendor.clearValidators();
        recruiter.clearValidators();
        empmail.clearValidators();
      }
      else {
        empmail.setValidators([Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')]);
        vendor.setValidators(Validators.required);
        recruiter.setValidators(Validators.required);
      }
      empmail.updateValueAndValidity();
      vendor.updateValueAndValidity();
      recruiter.updateValueAndValidity();
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
    this.submissionServ.getConsultantDropdown(flg).subscribe(
      (response: any) => {
        console.log(response.data);
        this.consultantdata = response.data;
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
    const role = localStorage.getItem('role');
    if (role == 'Super Admin' || role == 'Admin' || role == 'Manager') {
      this.flg = "all";
    }
    this.submissionServ.getCompanies(this.flg).subscribe(
      (response: any) => {
        this.vendordata = response.data;
      }
    )
  }

  recruiterName: any[] = [];
  recruiterList(obj: any) {
    const newVal = obj;
    this.submissionServ.getRecruiterOfTheVendor(newVal, this.flgOpposite).subscribe(
      (response: any) => {
        this.recruiterName = response.data;
      }
    );
  }

  selectedItems: ContactInfo[] = [];
  recruiterContact(event: any) {
    const newVal = event.value;
    this.recruiterName.forEach(item => {
      if (newVal == item.id) {
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

    if (this.submissionForm.invalid) {
      this.displayFormErrors();
      this.isRadSelected = true;
      return;
    }
    this.submitted = true;
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
    this.submissionServ
      .registerSubmission(saveReqObj)
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
    if(this.data.actionName === 'edit-submission'){
      return {...this.entity, ...this.submissionForm.value}
    }
    return this.submissionForm.value;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onRadioChange(event: MatRadioChange){
    this.isRadSelected =  event.value
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

export const RADIO_OPTIONS = {
  rate: [
    {value: 'C2C', id: 1 },
    {value: '1099', id: 2},
    {value: 'W2', id: 3},
    {value: 'Full Time', id: 4},
    {value: 'C2H', id: 5}
  ]
}

class ContactInfo {
  company!: string;
  email!: string;
  usnumber!: string;
  id!: string;
  recruiter!: string;
}
