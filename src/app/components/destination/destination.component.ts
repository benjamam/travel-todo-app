import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Destination } from './destination';
import { DestinationService } from '../../services/destination.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.scss']
})
export class DestinationComponent implements OnInit {
  addDestination: boolean;
  destinations$: Observable<Destination[]>;
  cityId: string;
  loading = true;

  constructor(private route: ActivatedRoute, private destinationService: DestinationService) { }

  ngOnInit(): void {
    this.addDestination = false;
    this.cityId = this.route.snapshot.paramMap.get('id');
    this.destinationService.getDestinations(this.cityId).subscribe(destinations => {
      this.loading = false;
    });
    this.destinations$ = this.destinationService.destinationSource$
      .pipe(map(destinations => this.formatDestinations(destinations)));
  }

  markDestinationVisited(destination: Destination): void {
    this.destinationService.updateDestinationVisited(destination)
      .subscribe();
  }

  deleteDestination(id: string): void {
    this.destinationService.deleteDestination(id)
      .subscribe();
  }

  private sortArray(dests: Destination[]) {
    return dests.sort((d1, d2) => Number(d1.haveVisited) - Number(d2.haveVisited));
  }

  private formatDestinations(destinations: Destination[]) {
    let dests = this.sortArray(destinations);
    dests = dests.map(d => d.mapsUrl ? d : {
      ...d,
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + d.name.split(' ').join('+') + '%2C' + d.location.replace(' ', '+')
    });
    return dests;
  }
}
