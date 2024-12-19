import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '../auth/auth.guard';
import { TestComponent } from './test/test.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      // {
      //   path: 'users',
      //   component: UsersComponent,
      //   canActivate: [authGuard],
      // },
      { path: 'test', component: TestComponent, canActivate: [authGuard] },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
