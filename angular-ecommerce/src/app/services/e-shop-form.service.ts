import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../common/country';
import { map } from 'rxjs/operators';
import { State } from '../common/state';
 

@Injectable({
  providedIn: 'root'
})
export class EShopFormService {

  // define urls
  private countriesUrl = "http://localhost:9090/api/countries";
  private statesUrl = "http://localhost:9090/api/states";


  constructor(private httpClient: HttpClient) { }

  // get countries from database
  getCountries() : Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map( response => response._embedded.countries)
    );
  }

  // get States from Database
  getStates(theCountryCode: string) : Observable<State[]> {

    // search url 
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    );

  }





  getCreditCardMonths(startMonth: number) :  Observable<number[]> {

    let data: number[] = [];

    // build an array for "Month" dropdown
    // start at desired month and loop until 12
    for(let theMonth=startMonth; theMonth<=12; theMonth++){
        data.push(theMonth);
    }
    
    // the 'of' operator from 'rxjs' will wrap an object as an observable
    return of(data);

  }

  getCreditCardYear() : Observable<number[]> {

    let data: number[] = [];

    // build an array for "year" dropdown list
    // start at current year and loop for next 10

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear=startYear; theYear<=endYear; theYear++){
      data.push(theYear);
    }

    return of(data);

  }

}

interface GetResponseCountries {

  _embedded: {
    countries: Country[]; 
  }

}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
