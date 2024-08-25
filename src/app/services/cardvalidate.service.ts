import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CardvalidateService {


private countriesUrl=environment.baseUrl + '/countries';
private statesUrl=environment.baseUrl + '/states';


  constructor(private httpClient: HttpClient) { }

  getCountries():Observable<Country[]>{
    
    return this.httpClient.get<GetResponsecountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode:string):Observable<State[]>{
    const searchStatesUrl=`${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }


  getCreditCardMonths(startMonth:number):Observable<number[]>{
    let data:number[]=[];
    for(let theMonth=startMonth;theMonth<=12;theMonth++)
      {
        data.push(theMonth);
      }
      return of(data);
  }
  getCreditCardYears():Observable<number[]>{
    let data:number[]=[];
    const startYear:number =new Date().getFullYear();
    const endYear:number = startYear+10;
    for(let theyear=startYear;theyear<=endYear;theyear++)
      {
        data.push(theyear);
      }
      return of(data);
    }
}
interface GetResponsecountries{
  _embedded: {
    countries: Country[];
}
}
interface GetResponseStates{
  _embedded: {
    states: State[];
}
}