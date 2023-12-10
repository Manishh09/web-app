import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  inject,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject, debounceTime, distinctUntilChanged, map, of, startWith, switchMap, takeUntil } from 'rxjs';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { Loader } from '@googlemaps/js-api-loader';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Requirements } from 'src/app/usit/models/requirements';

@Component({
  selector: 'app-add-requirement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatAutocompleteModule,
    NgxGpAutocompleteModule,
    MatRadioModule,
    MatSelectModule,
    MatChipsModule,
    NgMultiSelectDropDownModule,
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
  templateUrl: './add-requirement.component.html',
  styleUrls: ['./add-requirement.component.scss'],
})
export class AddRequirementComponent {
  requirementObj = new Requirements()
  requirementForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private requirementServ = inject(RequirementService);
  private snackBarServ = inject(SnackBarService);
  private router = inject(Router);
  protected isFormSubmitted: boolean = false;
  allowAction = false;
  reqnumber!: any;
  maxnumber!: number;
  currentDate = new Date();
  todayDate = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
  reqNumberDate = formatDate(this.currentDate, 'yyMM', 'en-US');
  vendordata: any = [];
  searchObs$!: Observable<any>;
  techSearchObs$!: Observable<any>;
  options = {
    componentRestrictions: { country: ['IN', 'US'] },
  };
  vendorCompanyArr: { company: string }[] = [];
  techArr: any = [];
  companySearchData: any[] = [];
  techSearchData: any[] = [];
  autoskills!: string;
  employeedata: any = [];
  dropdownSettings: IDropdownSettings = {};
  employees: any[] = [];
  @ViewChild('employeeInput') employeeInput!: ElementRef<HTMLInputElement>;
  filteredEmployees!: Observable<any[]>;
  allEmployees: any;
  selectedEmployees = new Set<string>();
  employeeSearchData: any[] = [];
  empArr: any = []
  empSearchObs$!: Observable<any>;
  submitted = false;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  selectOptionObj = {
    
    statusType: STATUS_TYPE,
  };
  selectAllChecked = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddRequirementComponent>
  ) {}

  ngOnInit(): void {
    this.getTech();
    this.getEmployee();
    if(this.data.actionName === "edit-requirement"){
      this.initializeRequirementForm(new Requirements());
      this.requirementServ.getEntity(this.data.requirementData.requirementid).subscribe(
        (response: any) => {
          console.log(response);
          this.recruiterList(response.data.vendorimpl.vmsid);
          this.requirementObj = response.data;
          this.initializeRequirementForm(response.data);
          
        }
      )
      this.requirementServ.getAssignedRecruiter(this.data.requirementData.requirementid).subscribe(
        (response: any) => {
          this.employeedata = response.data;
          this.prepopulateSelectedEmployees();
        }
      );
    }else{
      this.requirementServ.getReqNumber().subscribe(
        (response: any) => {
          if (response.data == null) {
            this.reqnumber = 101;
            this.maxnumber = 101;
          }
          else {
            this.maxnumber = parseInt(response.data) + 1;
            this.reqnumber = parseInt(response.data) + 1;
          }
          this.reqnumber = "NVT" + this.reqNumberDate + ("00000" + this.reqnumber).slice(-5);
          this.requirementForm.get('reqnumber')?.setValue(this.reqnumber);
          this.requirementForm.get('postedon')?.setValue(this.todayDate);
        })
        
        
        this.initializeRequirementForm(null);
    }
    this.requirementServ.getVendorCompanies('Recruiting').subscribe(
      (response: any) => {
        this.vendorCompanyArr = response.data;
        console.log(this.vendorCompanyArr);
      }
    );
  }

  private initializeRequirementForm(requirementData : any) {
    this.requirementForm = this.formBuilder.group({
      reqnumber: [requirementData ? requirementData.reqnumber : '', Validators.required],
      postedon: [requirementData ? requirementData.postedon : '', Validators.required],
      location: [requirementData ? requirementData.location : '', Validators.required],
      // vendor: [requirementData ? requirementData.vendor : '', Validators.required],
      client: [requirementData ? requirementData.client : '',],
      jobexperience: [requirementData ? requirementData.jobexperience : '',],
      employmenttype: [requirementData ? requirementData.employmenttype : '', Validators.required],
      jobtitle: [requirementData ? requirementData.jobtitle : '', Validators.required],
      jobskills: [requirementData ? requirementData.jobskills : ''],
      jobdescription: [requirementData ? requirementData.jobdescription : '', Validators.required],
      duration: [requirementData ? requirementData.duration :'', Validators.required],
      technology: this.formBuilder.group({
        id: [requirementData ? requirementData.technology?.id : ''],
      }),
      empid: [requirementData ? requirementData.empid :'', Validators.required],
      recruiter: this.formBuilder.group({
        recid: [requirementData ? requirementData.recruiter.recid :'', [Validators.required]],
      }),
      pocphonenumber: [requirementData ? requirementData.pocphonenumber :''],
      pocemail: [requirementData ? requirementData.pocemail :''],
      pocposition: [requirementData ? requirementData.pocposition :''],
      salary: [requirementData ? requirementData.salary :''],
      users: this.formBuilder.group({
        userid: localStorage.getItem('userid'),
      }),
      vendorimpl: this.formBuilder.group({
        vmsid: [requirementData ? requirementData.vendorimpl.company :'', [Validators.required]],
      }),
    });
    if (this.data.actionName === 'edit-requirement') {
      this.requirementForm.addControl('status',this.formBuilder.control(requirementData ? requirementData.status : ''));
    }
    this.validateControls()
    this.techAutoCompleteSearch();
    this.companyAutoCompleteSearch();
    this.empAutoCompleteSearch()
    
  }

  validateControls() {
  
  }

  companyAutoCompleteSearch() {
    this.searchObs$ = this.requirementForm.get('vendorimpl.vmsid')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: any) => {
        if (term) {
          return this.getFilteredValue(term);
        }
        else {
          this.companySearchData = [];
          return of<any>([]);
        }
      }
      ),
    );
  }

  getFilteredValue(term: any): Observable<any> {
    if (term && this.vendorCompanyArr) {
      const sampleArr = this.vendorCompanyArr.filter((val: any) => val.company.trim().toLowerCase().includes(term.toLowerCase()) == true)
      this.companySearchData = sampleArr;
      return of(this.companySearchData);
    }
    return of([])
  }

  
  getTech() {
    this.requirementServ.getTech().subscribe(
      (response: any) => {
        this.techArr = response.data;
        console.log(this.techArr);
      }
    )
  }

  techAutoCompleteSearch() {
    this.techSearchObs$ = this.requirementForm.get('technology.id')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: any) => {
        if (typeof term === 'string') {
          return this.getTechFilteredValue(term);
        }
        else {
          this.techSearchData = [];
          return of<any>([]);
        }
      }
      ),
    );
  }

  getTechFilteredValue(term: string): Observable<any> {
    if (term && this.techArr) {
      const sampleArr = this.techArr.filter((val: any) => val[1].toLowerCase().includes(term.trim().toLowerCase()) == true)
      this.techSearchData = sampleArr;
      return of(this.techSearchData);
    }
    return of([])
  }

  get controls() {
    return this.requirementForm.controls;
  }

  getEmployee() {
    this.requirementServ.getEmployee().subscribe(
      (response: any) => {
        this.empArr = response.data;
      }
    )
  }

  recruiterArr: any[] = [];
  recruiterList(option: any) {
    const newVal = option;
    this.requirementServ.getRecruiterOfTheVendor(newVal, 'Recruiter').subscribe(
      (response: any) => {
        this.recruiterArr = response.data;
        console.log(this.recruiterArr);
        this.requirementForm.get("pocphonenumber")!.patchValue(response.data.recruiter.pocphonenumber);
        this.requirementForm.get("pocemail")!.patchValue(response.data.recruiter.pocemail);
        this.requirementForm.get("recruiter.recid")!.patchValue(response.data.recruiter.recid);
        this.requirementForm.get("pocposition")!.patchValue(response.data.recruiter.pocposition);
      }
    );
  }
  
  techSkills(option: any) {
    const newVal = option[0];
    if (newVal == '') {
      this.autoskills = '';
    }
    this.requirementServ.getSkillData(newVal).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.autoskills = response.data;
          this.requirementForm.get('jobskills')!.setValue(this.autoskills);
        } else {
          console.error('Invalid response structure:', response);
        }
      },
      (error) => {
        console.error('Error fetching skill data:', error);
      }
    )
  }

  

  onSubmit () {
    this.submitted = true;
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

    if (this.requirementForm.invalid) {
      this.displayFormErrors();
      return;
    }
    console.log(this.requirementForm.value)
    const saveReqObj = this.getSaveData();
    console.log('form.value  ===', saveReqObj);
    // this.requirementServ
    //   .addORUpdateVendor(saveReqObj, this.data.actionName)
    //   .pipe(takeUntil(this.destroyed$))
    //   .subscribe({
    //     next: (data: any) => {
    //       if (data.status == 'success') {
    //         dataToBeSentToSnackBar.message =
    //           this.data.actionName === 'add-requirement'
    //             ? 'Requirement added successfully'
    //             : 'Requirement updated successfully';
    //         this.dialogRef.close();
    //       } else {
    //         dataToBeSentToSnackBar.message = 'Requirement already Exists';
    //       }
    //       this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
    //     },
    //     error: (err: any) => {
    //       dataToBeSentToSnackBar.message =
    //         this.data.actionName === 'add-requirement'
    //           ? 'Requirement addition is failed'
    //           : 'Requirement updation is failed';
    //       dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
    //       this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
    //     },
    //   });
  }

  onCancel() {
    this.dialogRef.close();
  }

  handleAddressChange(address: any) {
    console.log('address', address.formatted_address);
    this.requirementForm.controls['location'].setValue(address.formatted_address);
    // this.entity.headquerter = address.formatted_address;
  }

  goToVendorList() {
    this.dialogRef.close();
    this.router.navigate(['/usit/vendors']);
  }

  goToTechnologyList() {
    this.dialogRef.close();
    this.router.navigate(['/usit/technology-tag']);
  }
  
  pocPosition!: string;
  selectedItems: ConstactInfo[] = [];
  recruiterContact(event: any) {
    const newVal = event.value;
    
    this.recruiterArr.forEach(item => {
      if (newVal === item.id) {
        this.selectedItems.push(item);
        console.log(this.selectedItems);
      }
    });

    this.selectedItems.forEach(item => {
      this.requirementForm.get("pocphonenumber")!.patchValue(item.usnumber);
      this.requirementForm.get("pocemail")!.patchValue(item.email);
      if (item.pocposition == 'Bench Sales')
        this.pocPosition = "Sales Recruiter"
      else if (item.pocposition == 'Recruiter')
        this.pocPosition = "Recruiter"
      else
        this.pocPosition = "US IT Staffing & Recruitment "
      this.requirementForm.get("pocposition")!.patchValue(this.pocPosition);
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our employee
    if (value) {
      this.employees.push(value);
    }
    console.log(this.employees)

    // Clear the input value
    event.chipInput!.clear();

    this.controls['empid']!.setValue(null);
  }

  remove(employee: any): void {
    const index = this.employees.indexOf(employee);

    if (index >= 0) {
      this.employees.splice(index, 1);
    }
  }

  prepopulateSelectedEmployees() {
    // Clear the existing employees array
    this.employees = [];

    // Add the prepopulated employees from the fetched data
    this.employeedata.forEach((employee: any) => {
      this.employees.push(employee.fullname);
    });
  }

  selected(event: any): void {
    // MatAutocompleteSelectedEvent
    console.log(event);
    this.employees.push(event.option.viewValue);
    console.log(this.employees);
    this.employeeInput.nativeElement.value = '';
    this.controls['empid']!.setValue(null);
  }

  empAutoCompleteSearch() {
    this.empSearchObs$ = this.requirementForm.get('empid')!.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: any) => {
        if (typeof term === 'string') {
          console.log(term);
          return this.getEmpFilteredValue(term);
        }
        else {
          this.employeeSearchData = [];
          return of<any>([]);
        }
      }
      ),
    );
  }

  getEmpFilteredValue(term: string): Observable<any> {
    if (term && this.empArr) {
      const sampleArr = this.empArr.filter((val: any) => val.fullname.toLowerCase().includes(term.trim().toLowerCase()) == true)
      this.employeeSearchData = sampleArr;
      return of(this.employeeSearchData);
    }
    return of([])
  }

  goToRecruiterList() {
    this.dialogRef.close();
    this.router.navigate(['/usit/recruiters']);
  }

  /** to display form validation messages */
  displayFormErrors() {
    Object.keys(this.requirementForm.controls).forEach((field) => {
      const control = this.requirementForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  getSaveData() {
    if(this.data.actionName === "edit-vendor"){
      [this.requirementForm.value].forEach( (formVal, idx) => {
        this.requirementObj.reqnumber = formVal.reqnumber;
        this.requirementObj.postedon = formVal.postedon;
        this.requirementObj.location = formVal.location;
        this.requirementObj.client =  formVal.client;
        this.requirementObj.jobexperience =  formVal.jobexperience;
        this.requirementObj.employmenttype =  formVal.employmenttype;
        this.requirementObj.status =  formVal.status;
        this.requirementObj.jobtitle =  formVal.jobtitle;
        this.requirementObj.jobskills = formVal.jobskills;
        this.requirementObj.jobdescription =  formVal.jobdescription;
        this.requirementObj.duration = formVal.duration;
        this.requirementObj.pocphonenumber = formVal.pocphonenumber;
        this.requirementObj.pocemail = formVal.pocemail;
        this.requirementObj.pocposition =  formVal.pocposition;
        this.requirementObj.salary = formVal.salary;
      })
      return this.requirementObj
    }
    return this.requirementForm.value;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  selectAllOptions() {
    const empidControl = this.requirementForm.get('empid');

    if (this.selectAllChecked) {
      // Select all options
      this.empArr.forEach((emp: any) => emp.selected = true);
      empidControl!.setValue(this.empArr.map((emp: any) => emp.fullname));
    } else {
      // Deselect all options
      this.empArr.forEach((emp: any) => emp.selected = false);
      empidControl!.setValue([]);
    }
  }
}


export const STATUS_TYPE = ['Active', 'on hold', 'closed', 'In Active'] as const;

class ConstactInfo {
  company!: string;
  email!: string;
  usnumber!: string;
  id!: string;
  recruiter!: string;
  pocposition!: string;
}