import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component , Inject, inject} from '@angular/core';
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
import { Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { EmployeeManagementService } from 'src/app/usit/services/employee-management.service';
import {MatDatepickerModule} from '@angular/material/datepicker';


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

  roleOptions: string[] = [
    'Super Admin',
    'Admin',
    'Manager',
    'Team Lead',
    'Employee',
  ];

  managerOptions: string[] = ['John Smith', 'Sarah Johnson', 'David Anderson'];

  teamLeadOptions: string[] = ['Alice', 'Bob', 'Charlie', 'David', 'Eva'];

  filteredDepartmentOptions!: Observable<string[]>;
  filteredRoleOptions!: Observable<string[]>;
  filteredManagerOptions!: Observable<string[]>;
  filteredTeamLeadOptions!: Observable<string[]>;

  employeeForm: any = FormGroup;
  submitted = false;
  rolearr: any = [];
  message!: string;
  blur!: string;
  managerflg = false;
  teamleadflg = false;
  managerarr: any = [];
  tlarr: any = [];
  private _filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  private empManagementServ = inject(EmployeeManagementService);
  constructor(private formBuilder: FormBuilder, private router: Router,
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddEmployeeComponent>) {}

  ngOnInit(): void {
    console.log("empdata, ", this.data);
    if(this.data.actionName === 'edit-employee'){
      const empId = this.data.employeeData.userid;
      this.getTeamLead(empId)
    }
    // this.employeeForm = this.formBuilder.group({
    //   fullname: ['', Validators.required],
    //   pseudoname: [''],
    //   email: ['', [Validators.required, Validators.email]],
    //   personalcontactnumber: ['', Validators.required],
    //   companycontactnumber: [],
    //   designation: [],
    //   department: ['', Validators.required],
    //   role: ['', Validators.required],
    //   manager: ['', Validators.required],
    //   teamlead: ['', Validators.required],
    // });
    this.getRoles();
    this.getManager();
    this.initilizeAddEmployeeForm();
    this.validateControls()
  }

  private initilizeAddEmployeeForm() {
    this.employeeForm = this.formBuilder.group(
      {
        fullname: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
        pseudoname: [''],
        email: ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')]],
        personalcontactnumber: ['', [Validators.required]],
        //['', [Validators.required]],
        companycontactnumber: [this.employeeForm.companycontactnumber],
        designation: [this.employeeForm.designation],
        department: ['', Validators.required],
        joiningdate: ['', Validators.required],
        relievingdate: [this.employeeForm.relievingdate],
        personalemail: ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')]],
        manager: [''],
        aadharno: [this.employeeForm.aadharno],

        panno: [this.employeeForm.panno],
        bankname: [this.employeeForm.bankname],
        accno: [this.employeeForm.accno],
        ifsc: [this.employeeForm.ifsc],
        branch: [this.employeeForm.branch],
        teamlead: [''],
        role: ['', Validators.required],
        // role: this.formBuilder.group({
        //   roleid: new FormControl('', [
        //     Validators.required
        //   ]),
        // })
      });
      this.optionsMethod()
  }

  validateControls(){
     // for psuedo name validation
     this.employeeForm.get('department').valueChanges.subscribe((res: any) => {
      const pseudoname = this.employeeForm.get('pseudoname');
      if (res == "Bench Sales") {
        pseudoname.setValidators(Validators.required);
      }
      else {
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
      }
      else if (res == 5) {
        this.managerflg = true;
        this.teamleadflg = true;
        manager.setValidators(Validators.required);
        // tl.setValidators(Validators.required);
      }
      else {
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
 get addEmpForm() { return this.employeeForm.controls; }

  private optionsMethod() {
    this.filteredDepartmentOptions =
      this.employeeForm.controls.department.valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filterOptions(value || '', this.departmentOptions)
        )
      );

    this.filteredRoleOptions = this.employeeForm.controls.role.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filterOptions(value || '', this.roleOptions))
    );

    this.filteredManagerOptions = this.employeeForm.controls.manager.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filterOptions(value || '', this.managerOptions))
    );

    this.filteredTeamLeadOptions =
      this.employeeForm.controls.teamlead.valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filterOptions(value || '', this.teamLeadOptions)
        )
      );
  }

  _onSubmit() {
    if (this.employeeForm.valid) {
      // this.usersService.addUser(this.employeeForm.value);
      // this.snackBar.showSnackBar('New User Added', ['green-snackbar']);
      this.employeeForm.reset();
      this.dialogRef.close();
      this.router.navigate(['../usit/employees/users']);

    }
  }


  getRoles() {
    this.empManagementServ.getRolesDropdown().subscribe(
      (response: any) => {
        this.rolearr = response.data;
        // console.log(this.rolearr)
      })
  }

  getManager() {
    this.empManagementServ.getManagerDropdown().subscribe(
      (response: any) => {
        this.managerarr = response.data;
      })
  }

  managerid(event: any) {
    const id = event.target.value;
    this.getTeamLead(id);
  }
  getTeamLead(id: number) {
    this.empManagementServ.getTLdropdown(id).subscribe(
      (response: any) => {
        this.tlarr = response.data;
        //  console.log(response.data)
      })
  }

  onSubmit() {
    this.message = '';
    this.submitted = true;
    if (this.employeeForm.invalid) {
      this.blur = "enable"
      return;
    }
    else {
      this.blur = "Active"
    }
    //console.log(this.employeeForm.value)
    // console.log(JSON.stringify(this.employeeForm.value, null, 2) + " =============== ");
    this.empManagementServ.registerEmployee(this.employeeForm.value)
      .subscribe((data: any) => {
        // console.log(JSON.stringify(data))
        this.blur = "Active";
        if (data.status == 'Success') {
       //   alertify.success("Employee Added successfully");
          this.employeeForm.reset();
          this.router.navigate(['list-employees']);
        }
        else {
          this.blur = "enable"
          this.message = data.message;
         // alertify.error("Record Insertion failed");
        }
      },
        error => {  // error response
          this.blur = "enable"
          this.message = "Record Insertion failed";
         // alertify.error("Record Insertion failed");
        }
      );
  }

  onCancel(){
    this.dialogRef.close();
  }
}
