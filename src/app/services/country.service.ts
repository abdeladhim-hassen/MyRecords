import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private countriesUrl = 'assets/countries.json';

  constructor(private http: HttpClient) {}

  private getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.countriesUrl);
  }

  getFormattedCountries(): Observable<any[]> {
    return this.getCountries().pipe(
      map(countries => countries.map(country => ({
        name: country.name,
        code: country.code
      })))
    );
  }
}
