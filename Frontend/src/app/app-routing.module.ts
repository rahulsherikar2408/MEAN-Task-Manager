import { NgModule } from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';

import { HomeComponent } from './pages/home/home.component';

import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';

import { TaskListComponent } from './components/task-list/task-list.component';

import { authGuard } from './guards/auth.guard';

const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'my-tasks',
    component: TaskListComponent,
    canActivate: [authGuard]
  },

  {
    path: 'signup',
    component: SignupComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '**',
    redirectTo: ''
  }

];

@NgModule({

  imports: [
    RouterModule.forRoot(routes)
  ],

  exports: [
    RouterModule
  ]

})
export class AppRoutingModule {}