import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../dialogs/confirm/confirm.component';
import { IConfirmDialogData } from '../dialogs/models/confirm-dialog-data';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog:  MatDialog) { }

  openDialogWithComponent(comp: any , data: any){
    this.dialog.open(comp, {
      data,
      width: '400px',
      disableClose: false
    });
  }
}
