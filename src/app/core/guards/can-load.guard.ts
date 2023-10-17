import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CanLoadGuard implements CanActivate, CanLoad {
   private permServ = inject(PermissionsService);
   private router = inject(Router);
   private readonly userRole = 'Admin';
  private isLoggedIn: boolean = false;
  private isAdmin = false;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('in can-activate guard')
    return this.isAdminUser();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log('in can-load guard')
    return  this.permServ.isAdmin(this.userRole).pipe(
      map(isUserAdmin => isUserAdmin || this.router.createUrlTree(['']))
    );
  }

  private isAdminUser() {
    this.permServ.isAdmin(this.userRole).subscribe(
      (resp: boolean) => {
        this.isAdmin = resp;
      }
    );
    return this.isAdmin;
  }
}
