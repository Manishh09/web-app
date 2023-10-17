
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import {    Component, OnInit, inject } from '@angular/core'
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  private snaclBar = inject(MatSnackBar)
  private snackBarServ = inject(SnackBarService);

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
  }
    this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);

    this.router.navigate(["login"])
  }
}
