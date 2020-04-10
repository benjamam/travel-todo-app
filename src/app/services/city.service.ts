import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, map, switchMap, tap } from 'rxjs/operators';
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
  private citySource: BehaviorSubject<City[]> = new BehaviorSubject([]);
  public citySource$ = this.citySource.asObservable();

  constructor(private http: HttpClient) {
  }

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(this.CITY_URL)
      .pipe(
        tap(citiesResp => this.citySource.next(citiesResp))
      );
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
        tap(() => this.citySource.next(this.citySource.value.filter(c => c._id !== id))),
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
