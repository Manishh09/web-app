import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Inject,
  inject,
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
import { Router } from '@angular/router';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { Role } from 'src/app/usit/models/role';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddRoleComponent {
  addRoleForm: any = FormGroup;
  private formBuilder = inject(FormBuilder);
  private userManagementServ = inject(UserManagementService);
  private snackBarServ = inject(SnackBarService);
  tech!: Role;
  private router = inject(Router);
  showValidationError = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<AddRoleComponent>
  ) {}

  ngOnInit(): void {
    this.addRoleForm = this.formBuilder.group({
      roleName: ['', Validators.required],
      //roleId: ['', Validators.required],
      description: ['', Validators.maxLength(200)],
    });
  }
  onSubmit() {
    // this.message = '';
    // this.submitted = true;
    if (this.addRoleForm.invalid) {
      return;
    }
    this.tech.updatedBy = localStorage.getItem('userid');
    this.userManagementServ.updateRole(this.tech).subscribe((data: any) => {
      const dataToBeSentToSnackBar: ISnackBarData = {
        message: '',
        duration: 1500,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        direction: 'above',
        panelClass: ['custom-snack-success'],
      };
      if (data.status == 'Success') {
        dataToBeSentToSnackBar.message = 'Role updated successfully!';
        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        // go to roles after the update
        this.router.navigate(['roles']);
      } else {
        //"Role Already Exists");
        dataToBeSentToSnackBar.message = data.message;
      }
      this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
    });
  }

  onAction(type: string) {
    this.dialogRef.close();
  }
}
