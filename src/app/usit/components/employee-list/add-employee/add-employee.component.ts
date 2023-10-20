import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component , Inject} from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';

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
    MatButtonModule
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

  form: any = FormGroup;
  private _filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  constructor(private formBuilder: FormBuilder, private router: Router,
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddEmployeeComponent>) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fullname: ['', Validators.required],
      pseudoname: [''],
      email: ['', [Validators.required, Validators.email]],
      personalcontactnumber: ['', Validators.required],
      companycontactnumber: [],
      designation: [],
      department: ['', Validators.required],
      role: ['', Validators.required],
      manager: ['', Validators.required],
      teamlead: ['', Validators.required],
    });

    this.filteredDepartmentOptions =
      this.form.controls.department.valueChanges.pipe(
        startWith(''),
        map((value: any) =>
          this._filterOptions(value || '', this.departmentOptions)
        )
      );

    this.filteredRoleOptions = this.form.controls.role.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filterOptions(value || '', this.roleOptions))
    );

    this.filteredManagerOptions = this.form.controls.manager.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filterOptions(value || '', this.managerOptions))
    );

    this.filteredTeamLeadOptions =
      this.form.controls.teamlead.valueChanges.pipe(
        startWith(''),
        map((value: any) =>
          this._filterOptions(value || '', this.teamLeadOptions)
        )
      );
  }

  onSubmit() {
    if (this.form.valid) {
      // this.usersService.addUser(this.form.value);
      // this.snackBar.showSnackBar('New User Added', ['green-snackbar']);
      this.form.reset();
      this.dialogRef.close();
      this.router.navigate(['../usit/employees/users']);

    }
  }

  onCancel(){
    this.dialogRef.close();
  }
}
