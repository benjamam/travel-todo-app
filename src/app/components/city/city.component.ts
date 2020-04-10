import { Component, OnInit } from '@angular/core';
import { City } from './city';
import { CityService } from 'src/app/services/city.service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { DestinationService } from 'src/app/services/destination.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  addCity: boolean;
  cities$: Observable<City[]>;
  loading = true;

  constructor(private cityService: CityService, private destinationService: DestinationService) { }

  ngOnInit(): void {
    this.addCity = false;
    this.cityService.getCities().subscribe(resp => {
      this.loading = false;
    });
    this.cities$ = this.cityService.citySource$;
    this.destinationService.destinationSource.next([]);
  }

  selectCity(city: City): void {
  }

  deleteCity(id: string): void {
    this.cityService.deleteCity(id)
      .subscribe();
  }


}
