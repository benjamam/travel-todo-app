import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { STATE_LIST, StateList } from 'src/app/constants/states';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CityForCreation } from '../city/city';
import { CityService } from 'src/app/services/city.service';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss']
})
export class AddCityComponent implements OnInit {
  states: StateList[];
  addCityForm: FormGroup;
  message: string;

  constructor(private cityService: CityService) { }

  ngOnInit(): void {
    this.states = STATE_LIST;
    this.createNewForm();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.addCityForm.controls[controlName].hasError(errorName);
  }

  public addCity(addCityFormValue: any): void {
    if (this.addCityForm.valid) {
      this.createNewCity(addCityFormValue);
    }
  }

  private createNewCity(addCityFormValue: any): void {
    const newCity: CityForCreation = {
      name: addCityFormValue.name,
      state: addCityFormValue.state,
      country: addCityFormValue.country
    };
    this.cityService.addCity(newCity)
      .subscribe(city => {
        if (city) {
          this.message = `${city.name} successfully added`;
          this.cityService.addCityToState(city);
          this.addCityForm.reset();

        } else {
          this.message = `Error adding ${newCity.name}`;
        }
      });
  }

  private createNewForm(): void {
    this.addCityForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      state: new FormControl(''),
      country: new FormControl('')
    });
  }

}
