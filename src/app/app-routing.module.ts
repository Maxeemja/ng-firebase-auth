import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {VerifyEmailComponent} from "./components/verify-email/verify-email.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AuthGuard} from "./guard/auth.guard";


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verification', component: VerifyEmailComponent},
  {path: 'forgot-pass', component: ForgotPasswordComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
