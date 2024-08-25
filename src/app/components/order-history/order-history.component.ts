import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoyService } from 'src/app/services/order-histoy.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
orderHistoryList:OrderHistory[]=[];
storage:Storage = sessionStorage;
  constructor(private orderHistoryService:OrderHistoyService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }
  handleOrderHistory(){
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      (data) => {
        this.orderHistoryList =data._embedded.orders;
      }
    )
  }
}
