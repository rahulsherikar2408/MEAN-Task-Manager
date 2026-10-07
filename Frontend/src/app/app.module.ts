import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './components/navbar/navbar.component';

import { AddTaskComponent } from './components/add-task/add-task.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskItemComponent } from './components/task-item/task-item.component';

import { HomeComponent } from './pages/home/home.component';

import { SearchTaskPipe } from './pipes/search-task.pipe';
import { FilterTaskPipe } from './pipes/filter-task.pipe';
import { PriorityFilterPipe } from './pipes/priority-filter.pipe';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({

  declarations: [

    AppComponent,

    NavbarComponent,

    AddTaskComponent,

    TaskListComponent,

    TaskItemComponent,

    HomeComponent,

    SearchTaskPipe,

    FilterTaskPipe,

    PriorityFilterPipe,

    LoginComponent,

    SignupComponent

  ],

  imports: [

    BrowserModule,

    AppRoutingModule,

    FormsModule,

    HttpClientModule,

    BrowserAnimationsModule,

    ToastrModule.forRoot({

      positionClass: 'toast-top-right',

      preventDuplicates: true,

      timeOut: 3000,

      closeButton: true,

      progressBar: true

    })

  ],

  providers: [

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ],

  bootstrap: [
    AppComponent
  ]

})
export class AppModule {}