import { Component, OnInit } from '@angular/core';
import { City } from './city';
import { CityService } from 'src/app/services/city.service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  addCity: boolean;
  cities: City[];

  constructor(private cityService: CityService) { }

  ngOnInit(): void {
    this.addCity = false;
    this.cityService.getCities();
    this.cityService.citySource.subscribe(cities => this.cities = cities);
  }

  selectCity(city: City): void {
  }

  deleteCity(id: string): void {
    this.cityService.deleteCity(id)
      .subscribe(id =>
        this.cityService.citySource.next(this.cityService.citySource.value.filter(city => city._id !== id)
        )
      );
  }


}
