import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DestinationComponent } from './components/destination/destination.component';
import { CityComponent } from './components/city/city.component';


const routes: Routes = [
  { path: '', component: CityComponent},
  { path: 'destination/:id', component: DestinationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
