import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DestinationForCreation } from '../destination/destination';
import { DestinationService } from 'src/app/services/destination.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-add-destination',
  templateUrl: './add-destination.component.html',
  styleUrls: ['./add-destination.component.scss']
})
export class AddDestinationComponent implements OnInit {
  @Input() city: string;
  addDestinationForm: FormGroup;
  message: string;

  constructor(private destinationService: DestinationService, private locationService: LocationService) { }

  ngOnInit(): void {
    this.addDestinationForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      cost: new FormControl(''),
      website: new FormControl('')
    });
  }

  addDestination(addDestinationFormValue: any): void {
    if (this.addDestinationForm.valid) {
      this.createNewDestination(addDestinationFormValue);
    }
  }

  createNewDestination(addDestinationFormValue: any): void {
    const newDestination: DestinationForCreation = {
      name: addDestinationFormValue.name,
      location: this.city,
      description: addDestinationFormValue.description,
      cost: addDestinationFormValue.cost,
      website: addDestinationFormValue.website,
      haveVisited: false,
      mapsUrl: ''
    };
    newDestination.mapsUrl = this.locationService.formatLocation(newDestination);

    this.destinationService.addDestination(newDestination)
      .subscribe(d => {
        if (d) {
          this.destinationService.addDestinationToState(d);
          this.message = `${d.name} added successfully`;
          this.addDestinationForm.reset();
        } else {
          this.message = `Error adding ${newDestination.name}`;
        }
      });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.addDestinationForm.controls[controlName].hasError(errorName);
  }

}
