
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import {    Component, OnInit, inject } from '@angular/core'
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PermissionsService } from 'src/app/services/permissions.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
const keyFrames = [
  style({ transform: 'rotate(0deg)', offset: '0'}),
  style({ transform: 'rotate(1turn)', offset: '1'})
];
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger("rotate", [

      transition("* => close", [
        animate('1500ms', keyframes(keyFrames))
      ])
    ]),
  ]
})
export class SidebarComponent implements OnInit {

  private snackBarServ = inject(SnackBarService);
  protected permissionServ = inject(PermissionsService);
  private router = inject(Router);
  ngOnInit() { }

  onSignOut(){
  //  this.snaclBar.open("You have Signed out.!", "", {duration: 1500});
  const dataToBeSentToSnackBar: ISnackBarData = {
    message: 'You have signed out!',
    duration: 1500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-signout']
  };


  this.permissionServ.logOut()
    .subscribe({
      next: () =>{
        this.clearLocalStorageItemsOnLogOut();
        // navigate to login
        this.router.navigate(['/']);
      },
      error: err =>{
        // show error
      }
    });


  }

  clearLocalStorageItemsOnLogOut() {
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userid');
    localStorage.removeItem('roleno');
    localStorage.removeItem('department');
    localStorage.removeItem('designation');
    localStorage.removeItem('rnum');
    localStorage.removeItem('vnum');
    localStorage.removeItem('privileges');
    //alertify.warning("Token expired please login");
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: 'You have signed out!',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-signout']
    };
    this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
  }
}
