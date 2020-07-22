import { Injectable } from '@angular/core';
import { Destination, DestinationForCreation } from '../components/destination/destination';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { retry, catchError, tap, map, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private DESTINATION_URL = environment.api_url + '/api/destinations';
  private destinationSource: BehaviorSubject<Destination[]> = new BehaviorSubject([]);
  public destinationSource$ = this.destinationSource.asObservable();

  constructor(private http: HttpClient) { }

  getDestinations(city: string): Observable<Destination[]> {
    return this.http.get<Destination[]>(this.DESTINATION_URL + '/' + city)
      .pipe(
        tap(destResp => this.destinationSource.next(destResp))
      );
  }

  updateDestinationVisited(destination: Destination): Observable<Destination> {
    destination = { ...destination, haveVisited: !destination.haveVisited };
    return this.updateDestination(destination)
      .pipe(
        tap(destResp => {
          const updatedDestList: Destination[] = this.destinationSource.value
            .map(d => d._id === destResp._id ? { ...d, haveVisited: destResp.haveVisited } : d);
          this.destinationSource.next(updatedDestList);
        })
      );
  }

  updateDestination(destination: Destination): Observable<Destination> {
    return this.http.put<Destination>(this.DESTINATION_URL + '/' + destination._id, destination, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteDestination(id: string): Observable<any> {
    return this.http.delete(this.DESTINATION_URL + '/' + id)
      .pipe(
        tap(() => this.destinationSource.next(this.destinationSource.value.filter(d => d._id !== id)),
          catchError(this.handleError)
        ));
  }

  addDestination(destination: DestinationForCreation): Observable<Destination> {
    return this.http.post<Destination>(this.DESTINATION_URL, destination, httpOptions)
      .pipe(
        retry(1),
        tap(destResp => {
          if (destResp) { this.addDestinationToState(destResp); }
        }),
        catchError(this.handleError)
      );
  }

  getDestinationsBySearch(searchParam: string): Observable<Destination[]> {
    return this.destinationSource$.pipe(
      map(destinations => destinations.filter(d => d.name.toLowerCase().includes(searchParam.toLowerCase())))
    );
  }

  private addDestinationToState(destination: Destination): void {
    this.destinationSource.value.push(destination);
    this.destinationSource.next(this.destinationSource.getValue());
  }

  public clearDestinationState(): void {
    this.destinationSource.next([]);
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
