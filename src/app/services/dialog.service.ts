import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmComponent } from '../dialogs/confirm/confirm.component';
import { IConfirmDialogData } from '../dialogs/models/confirm-dialog-data';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog:  MatDialog) { }

  openDialogWithComponent(comp: ComponentType<unknown> , dialogConfig: MatDialogConfig){
    this.dialog.open(comp, dialogConfig);
  }
}
