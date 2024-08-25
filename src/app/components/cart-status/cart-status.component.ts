import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {


  totalPrice: number = 0;
  totalQuantity:number=0;
  constructor(private cs:CartService) { }

  ngOnInit(
  ): void {
    this.updateCartStatus();
  }
updateCartStatus(){

this.cs.totalPrice.subscribe(
  data => this.totalPrice=data
);

this.cs.totalQuantity.subscribe(
  data => this.totalQuantity=data
);
this.cs.computeCartTotals();

}
}
