import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
remove(_t14: CartItem) {
this.cartService.remove(_t14);
}
decrementQuantity(_t14: CartItem) {
this.cartService.RemoveFromCart(_t14);
}
incrementQuantity(cartItem: CartItem) {
this.cartService.addToCart(cartItem);

}

  cartItems: CartItem[] = [];
  totalPrice:number = 0;
  totalQuantity:number = 0;
  tp: number=0;
  constructor(private cartService : CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice=data
    );
    
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity=data
    );
 
  /*  this.cartService.cITEM.subscribe(
      
      data => this.cartItems=data
     
    );*/
this.tp= this.cartService.totalP;
    this.cartItems = this.cartService.cartItems;
    this.cartService.computeCartTotals();

  }

}
