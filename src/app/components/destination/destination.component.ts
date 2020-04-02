import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Destination } from './destination';
import { DestinationService } from '../../services/destination.service';
@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.scss']
})
export class DestinationComponent implements OnInit {
  addDestination: boolean;
  destinations: Destination[];
  cityId: string;

  constructor(private route: ActivatedRoute, private destinationService: DestinationService) { }

  ngOnInit(): void {
    this.addDestination = false;
    this.cityId = this.route.snapshot.paramMap.get('id');
    this.destinationService.getDestinations(this.cityId);
    this.destinationService.destinationSource
      .subscribe(d => this.destinations = this.sortArray(d));
  }

  markDestinationVisited(destination: Destination): void {
    this.destinationService.updateDestinationVisited(destination)
      .subscribe(dest => {
        const updatedDestList: Destination[] = this.destinationService.destinationSource.value
          .map(d => d._id === dest._id ? { ...d, haveVisited: dest.haveVisited } : d);
        this.destinationService.destinationSource.next(updatedDestList);
      });
  }

  deleteDestination(id: string): void {
    this.destinationService.deleteDestination(id)
      .subscribe(id =>
        this.destinationService.destinationSource.next(
          this.destinationService.destinationSource.value.filter(d => d._id !== id)
        ));
  }

  private sortArray(dests: Destination[]) {
    return dests.sort((d1, d2) => Number(d1.haveVisited) - Number(d2.haveVisited));
  }

}
