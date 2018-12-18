import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfirmCodeComponent } from './confirm-code/confirm-code.component';
import { ForgotPasswordStep1Component } from './forgot-password-step1/forgot-password-step1.component';
import { ForgotPasswordStep2Component } from './forgot-password-step2/forgot-password-step2.component';
import { LoginComponent } from './login/login.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ResendCodeComponent } from './resend-code/resend-code.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { UserListComponent } from './user-list/user-list.component';
import { HomeComponent } from './home/home.component';

import { CommonService } from '../app/Services/common.service';
import { AuthorizationService } from '../app/Services/authorization.service';
import { AuthGuard } from './Auth/auth.guard';

import { Ng2SearchPipeModule } from 'ng2-search-filter'; //Filter-importing the module
import { Ng2OrderModule } from 'ng2-order-pipe'; //Sort- importing the module
import { NgxPaginationModule } from 'ngx-pagination';//Paging


@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent,
    ConfirmCodeComponent,
    ForgotPasswordStep1Component,
    ForgotPasswordStep2Component,
    LoginComponent,
    RegisterUserComponent,
    ResendCodeComponent,
    SetNewPasswordComponent,
    UserListComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    NgxPaginationModule,
    RouterModule.forRoot([
      { path: 'signin', component: LoginComponent },
      { path: 'forgotpassword', component: ForgotPasswordStep1Component },
      { path: 'forgotpassword/:email', component: ForgotPasswordStep2Component },
      { path: 'newpassword', component: SetNewPasswordComponent },
      { path: 'changepassword', component: ChangePasswordComponent ,canActivate: [AuthGuard] },
      { path: 'registeruser', component: RegisterUserComponent },
      { path: 'confirmcode/:username', component: ConfirmCodeComponent },
      { path: 'resendcode', component: ResendCodeComponent },
      { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
      { path: 'userlist', component: UserListComponent,canActivate: [AuthGuard] },
      { path: '', redirectTo: '/signin', pathMatch: 'full' },
    ]),
  ],
  providers: [CommonService, AuthorizationService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
