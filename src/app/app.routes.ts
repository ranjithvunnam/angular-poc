import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './admin/components/home.component';
import { HomeComponent } from './user/components/home.component';

export const routes: Routes = [
  { path: '', component: AdminHomeComponent },
  { path: 'admin', component: AdminHomeComponent },
  { path: 'user', component: HomeComponent },
  // { path: '', redirectTo: 'user', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }