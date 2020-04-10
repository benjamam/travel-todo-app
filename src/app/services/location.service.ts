import { Injectable } from '@angular/core';
import { DestinationForCreation } from '../components/destination/destination';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  formatLocation(destination: DestinationForCreation): string {
    return 'https://www.google.com/maps/search/?api=1&query='
      + destination.name.replace(' ', '+')
      + '%2C'
      + destination.location.replace(' ', '+');
  }
}
