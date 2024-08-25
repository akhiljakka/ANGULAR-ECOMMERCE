import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoyService {

  constructor(private httpClient:HttpClient) { }
  private OrderUrl = environment.baseUrl + `/orders`;

  getOrderHistory(theEmail:string):Observable<GetResponseOrderHistory>{
const orderHistoryUrl = `${this.OrderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }

   
}
interface GetResponseOrderHistory{
  _embedded:{
    orders:OrderHistory[];
  }
}