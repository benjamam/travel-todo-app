import { Injectable } from '@angular/core';
import { Destination, DestinationForCreation } from '../components/destination/destination';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { BASE_TRAVEL_URL } from '../urls';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private DESTINATION_URL = BASE_TRAVEL_URL + '/api/destinations';
  public destinationSource: BehaviorSubject<Destination[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

  getDestinations(city: string): Observable<Destination[]> {
    this.http.get<Destination[]>(this.DESTINATION_URL + '/' + city)
      .subscribe(destinations => this.destinationSource.next(destinations));
    return this.destinationSource.asObservable();
  }

  updateDestinationVisited(destination: Destination): Observable<Destination> {
    destination = { ...destination, haveVisited: !destination.haveVisited };
    console.log('updateDestinationVisited', destination);

    return this.http.put<Destination>(this.DESTINATION_URL + '/' + destination._id, destination, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteDestination(id: string): Observable<any> {
    return this.http.delete(this.DESTINATION_URL + '/' + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  addDestination(destination: DestinationForCreation): Observable<Destination> {
    return this.http.post<DestinationForCreation>(this.DESTINATION_URL, JSON.stringify(destination), httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addDestinationToState(destination: Destination): void {
    this.destinationSource.value.push(destination);
    this.destinationSource.next(this.destinationSource.getValue());
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('an error occurred: ', error.error.message);
    } else {
      console.error(`backend returned code ${error.status}, body was: ${error.error.body}`);
    }
    return throwError(
      'Something bad happened'
    );
  }
}
