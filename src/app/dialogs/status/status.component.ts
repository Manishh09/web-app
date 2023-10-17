import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IStatusData } from '../models/status-model.data';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatIconModule, MatInputModule],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private snackBarServ = inject(SnackBarService);
  protected statusForm!: FormGroup;
  protected showValidationError = false;
  constructor(@Inject(MAT_DIALOG_DATA) protected data: IStatusData,
  public dialogRef: MatDialogRef<StatusComponent>){

  }
  ngOnInit(): void {

    this.statusForm  = this.formBuilder.group(
      {
        reasonForStatusUpdate: ["", [Validators.required, Validators.minLength(4)]]
      }
    )
  }

  onAction(action: string){

    if(action === "SAFE_CLOSE"){
      this.dialogRef.close();
    }
    else if(action === "UPDATE"){
      const dataToBeSentToSnackBar: ISnackBarData = {
        message: 'Status updated successfully!',
        duration: 1500,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        direction: 'above',
        panelClass: ['custom-snack-success']
      }
      if(this.statusForm.valid){
        this.showValidationError = false;

        this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        this.dialogRef.close();
      } else {
        this.showValidationError = true;
      }

    }
    return

  }


}
