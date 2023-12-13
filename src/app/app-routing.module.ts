import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ActivityComponent } from './activity/activity.component';
import { CanActivateGuard } from './can-activate.guard';
import { ActivityEditComponent } from './activity-edit/activity-edit.component';
import { FavouritesComponent } from './favourites/favourites.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);

const routes: Routes = [
  { path: 'edit-activity/:activityId', component: ActivityEditComponent, canActivate: [CanActivateGuard] },
  { path: 'activity/:activityId', component: ActivityComponent, canActivate: [CanActivateGuard]},
  { path: '', component: HomeComponent, canActivate: [CanActivateGuard]},
  { path: 'favourites', component: FavouritesComponent, canActivate: [CanActivateGuard]},
  { path: 'account', loadChildren: accountModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
