import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Inject,
  InjectionToken,
  inject,
} from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import { Router } from '@angular/router';
import { Observable, startWith, map, takeUntil, Subject } from 'rxjs';
import { EmployeeManagementService } from 'src/app/usit/services/employee-management.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
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
    NgxMatIntlTelInputComponent,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddEmployeeComponent {
  departmentOptions: string[] = [
    'Administration',
    'Recruiting',
    'Bench Sales',
    'Sourcing',
    'Accounts',
  ];

  roleOptions: any[] = [
    // 'Super Admin',
    // 'Admin',
    // 'Manager',
    // 'Team Lead',
    // 'Employee',
  ];

  managerOptions: any[] = [
    // 'John Smith', 'Sarah Johnson', 'David Anderson'
  ];

  teamLeadOptions: any[] = [
    // 'Alice', 'Bob', 'Charlie', 'David', 'Eva'
  ];

  filteredDepartmentOptions!: Observable<string[]>;
  filteredRoleOptions!: Observable<any[]>;
  filteredManagerOptions!: Observable<any[]>;
  filteredTeamLeadOptions!: Observable<any[]>;

  employeeForm: any = FormGroup;
  submitted = false;
  rolearr: any = [];
  message!: string;
  blur!: string;
  managerflg = false;
  teamleadflg = false;
  managerarr: any = [];
  tlarr: any = [];
  // snack bar data
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  // services
  private empManagementServ = inject(EmployeeManagementService);
  private snackBarServ = inject(SnackBarService);
  private formBuilder = inject(FormBuilder);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddEmployeeComponent>);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    console.log('empdata, ', this.data);

    this.getRoles(); // common for add employee
    this.getManager();// common for add employee
    if (this.data.actionName === 'edit-employee') {
      const managerId = this.data.employeeData.manager;
      this.initilizeAddEmployeeForm(this.data.employeeData);
      this.getTeamLead(managerId);
    } else {
    //  for add employee
      this.initilizeAddEmployeeForm(null);

    }
   // common for add employee
    this.validateControls();
    //this.optionsMethod();
  }

  private initilizeAddEmployeeForm(employeeData: any) {
    this.employeeForm = this.formBuilder.group({
      fullname: [
        employeeData ? employeeData.fullname : '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      ],
      pseudoname: [employeeData ? employeeData.pseudoname : ''],
      email: [
        employeeData ? employeeData.email : '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      personalcontactnumber: [employeeData ? employeeData.personalcontactnumber.internationalNumber : '', [Validators.required]],
      //['', [Validators.required]],
      companycontactnumber: [employeeData && employeeData.companycontactnumber ? employeeData.companycontactnumber.internationalNumber : ''],
      designation: [employeeData ? employeeData.designation : ''],
      department: [employeeData ? employeeData.department : '', Validators.required],
      joiningdate: [employeeData ? employeeData.joiningdate : '', Validators.required],
      relievingdate: [this.employeeForm.relievingdate],
      personalemail: [
        employeeData ? employeeData.personalemail : '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      manager: [employeeData ? employeeData.manager : ''],
      aadharno: [
        employeeData ? employeeData.aadharno : '',
        [Validators.required, Validators.pattern(/^\d{12}$/)],
      ],

      panno: [
        employeeData ? employeeData.panno : '',
        [Validators.required, Validators.pattern(/^[A-Z]{5}\d{4}[A-Z]{1}$/)],
      ],
      bankname: [employeeData ? employeeData.bankname : '', Validators.required],
      accno: [employeeData ? employeeData.accno : '', [Validators.required]],
      ifsc: [
        employeeData ? employeeData.ifsc : '',
        [Validators.required, Validators.pattern(/^([A-Za-z]{4}\d{7})$/)],
      ],
      branch: [employeeData ? employeeData.branch : '', [Validators.required]],
      teamlead: [employeeData ? employeeData.teamlead : ''],
     // role: [employeeData ? employeeData.role.rolename : '', Validators.required],
      role: this.formBuilder.group({
        roleid: new FormControl(employeeData ? employeeData.role.roleid : '', [
          Validators.required
        ]),
      })
    });

  }

  validateControls() {
    // for psuedo name validation
    this.employeeForm.get('department').valueChanges.subscribe((res: any) => {
      const pseudoname = this.employeeForm.get('pseudoname');
      if (res == 'Bench Sales') {
        pseudoname.setValidators(Validators.required);
      } else {
        pseudoname.clearValidators();
      }
      pseudoname.updateValueAndValidity();
    });
    // for manager validation
    this.employeeForm.get('role.roleid').valueChanges.subscribe((res: any) => {
      const manager = this.employeeForm.get('manager');
      const tl = this.employeeForm.get('teamlead');
      if (res == 4) {
        this.managerflg = true;
        this.teamleadflg = false;
        manager.setValidators(Validators.required);
      } else if (res == 5) {
        this.managerflg = true;
        this.teamleadflg = true;
        manager.setValidators(Validators.required);
        // tl.setValidators(Validators.required);
      } else {
        this.managerflg = false;
        this.teamleadflg = false;
        manager.clearValidators();
        // tl.clearValidators();
      }
      manager.updateValueAndValidity();
      // tl.updateValueAndValidity();
    });

    // for team lead validation

    // this.employeeForm.get('role.roleid').valueChanges.subscribe((res: any) => {
    //   const manager = this.employeeForm.get('manager');
    //   if (res == 4) {
    //     this.teamleadflg = false;
    //     this.managerflg = true;
    //     manager.setValidators(Validators.required);
    //   }
    //   else {
    //     this.teamleadflg = false;
    //     this.managerflg = false;
    //     manager.clearValidators();
    //   }
    //   manager.updateValueAndValidity();
    // });
  }
  get addEmpForm() {
    return this.employeeForm.controls;
  }

  private optionsMethod(type = "roles") {

    if(type === "roles"){
    this.filteredRoleOptions =
      this.employeeForm.controls.role.valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          console.log("value in map", value)
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(value) : this.roleOptions.slice();
        }

        )
      );
      return
    }else if(type === "manager"){
      this.filteredManagerOptions =
      this.employeeForm.controls.manager.valueChanges.pipe(
        startWith(''),
        map((value: any) =>{
          console.log("value in map", value)
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(value) : this.managerOptions.slice();
        }
        )
      );
    }else if(type === "department"){
      this.filteredDepartmentOptions =
      this.employeeForm.controls.department.valueChanges.pipe(
        startWith(''),
        map((value: any) =>
          this._filterOptions(value || '', this.departmentOptions)
        )
      );
    }else{
      this.filteredTeamLeadOptions =
      this.employeeForm.controls.teamlead.valueChanges.pipe(
        startWith(''),
        map((value: any) =>{
          console.log("value in map", value)
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(value) : this.teamLeadOptions.slice();
        }
        )
      );
    }

  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.roleOptions.filter(option => option.rolename.toLowerCase().includes(filterValue));
  }

  private _filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    console.log("filtervalu", value)
    return options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  displayFn(obj: any): string {
    return obj && obj.rolename ? obj.rolename : '';
  }

  getRoles() {
    this.empManagementServ
      .getRolesDropdown()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.rolearr = response.data;
          this.roleOptions = response.data;
          //TBD: auto-complete -
          // this.optionsMethod("roles")
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

  getManager() {
    this.empManagementServ
      .getManagerDropdown()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.managerarr = response.data;
          this.managerOptions = response.data;
          //TBD: auto-complete -
          //  this.optionsMethod("manager")
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

  managerid(event: MatSelectChange) {
    const selectedManagerId = event.value;
    if(selectedManagerId){
      this.getTeamLead(selectedManagerId);
    }
  }

  getTeamLead(id: number) {
    this.empManagementServ
      .getTLdropdown(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.tlarr = response.data;
          this.teamLeadOptions = response.data;
          //  console.log(response.data)
          // TBD autocomplete:
          // this.optionsMethod("teamLead")
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.invalid) {
      this.displayFormErrors();
      return;
    }
    console.log(this.data.actionName+" employeeForm.value",this.employeeForm.value);
    this.empManagementServ.addOrUpdateEmployee(this.employeeForm.value, this.data.actionName).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (data: any) => {
        this.blur = 'Active';
        if (data.status == 'Success') {
          this.dataTobeSentToSnackBarService.message =
            this.data.actionName === 'add-employee'
              ? 'Employee added successfully'
              : 'Employee updated successfully';
          this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
          this.employeeForm.reset();
          this.dialogRef.close();
        } else {
          this.dataTobeSentToSnackBarService.message =
            this.data.actionName === 'add-employee'
              ? 'Employee addition is failed'
              : 'Employee updation is failed';
            this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
        }

      },
      error: (err) => {
        this.dataTobeSentToSnackBarService.message =
          this.data.actionName === 'add-employee'
            ? 'Employee addition is failed'
            : 'Employee updation is failed';
          this.dataTobeSentToSnackBarService.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
      },
    });
  }

  displayFormErrors() {
    Object.keys(this.employeeForm.controls).forEach((field) => {
      const control = this.employeeForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onContryChange(ev: any) {

  }
}
