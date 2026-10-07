import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { KanbanComponent } from './components/kanban/kanban.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'task/new',
    component: AddTaskComponent,
    canActivate: [authGuard],
  },
  {
    path: 'my-tasks',
    component: TaskListComponent,
    canActivate: [authGuard],
  },

  {
    path: 'tasks/:id/edit',
    component: EditTaskComponent,
    canActivate: [authGuard],
  },

  {
    path: 'tasks/:id',
    component: TaskDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'kanban',
    component: KanbanComponent,
    canActivate: [authGuard],
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'signup',
    component: SignupComponent,
  },

  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {}
