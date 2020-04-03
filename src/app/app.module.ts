import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CityComponent } from './components/city/city.component';
import { DestinationComponent } from './components/destination/destination.component';
import { AddCityComponent } from './components/add-city/add-city.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddDestinationComponent } from './components/add-destination/add-destination.component';
import { MaterialModule } from './features/material/material.module';
@NgModule({
  declarations: [
    AppComponent,
    CityComponent,
    DestinationComponent,
    AddCityComponent,
    AddDestinationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
