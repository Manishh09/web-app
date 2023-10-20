import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SidebarV2Component } from './components/sidebar-v2/sidebar-v2.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'change-password',
    component: ChangePasswordComponent
  },

  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {

    path: 'usit',
    loadChildren: () => import('./usit/usit.module').then(m => m.UsitModule)
    // component: SidebarComponent, //SidebarV2Component,
    // children: [
    //   {
    //     path: 'usit',
    //     loadChildren: () => import('./usit/usit.module').then(m => m.UsitModule)
    //   }
    // ]

  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
