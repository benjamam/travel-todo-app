import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, map, switchMap } from 'rxjs/operators';
import { City, CityForCreation } from '../components/city/city';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private CITY_URL = environment.api_url + '/api/cities';
  public citySource: BehaviorSubject<City[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
  }

  getCities(): Observable<City[]> {
    this.http.get<City[]>(this.CITY_URL)
      .subscribe(cities => this.citySource.next(cities));
    return this.citySource.asObservable();
  }

  addCity(cityForCreation: CityForCreation): Observable<City> {
    return this.http.post<City>(this.CITY_URL, cityForCreation, httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addCityToState(city: City) {
    this.citySource.value.push(city);
    this.citySource.next(this.citySource.getValue());
  }

  deleteCity(id: string): Observable<any> {
    return this.http.delete(this.CITY_URL + '/' + id, httpOptions).
      pipe(
        catchError(this.handleError)
      );


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
