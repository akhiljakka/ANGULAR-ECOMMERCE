import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
cartItems: CartItem[] = [];
totalP: number = 0;

totalPrice:Subject<number> = new BehaviorSubject<number>(0);
totalQuantity:Subject<number> = new BehaviorSubject<number>(0);
storage: Storage = sessionStorage;
//storage: Storage = localStorage;

  constructor() {
    // read the data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data!= null){
    this.cartItems=data;
    this.computeCartTotals();
    }


   }


addToCart(theCartItem:CartItem){
  //check if we have items
  let alreadyExistsInCart:boolean=false;
  let existingCartItem:CartItem=undefined!;

  if(this.cartItems.length>0){
  /*  for(let tempCartItem of this.cartItems){
      if (tempCartItem.id === theCartItem.id){
        existingCartItem = tempCartItem;
        break;
      }
    }*/
      existingCartItem=this.cartItems.find(a=>a.id===theCartItem.id)!;
  }

  //check if we found the item
alreadyExistsInCart = (existingCartItem != undefined);
if (alreadyExistsInCart){
  existingCartItem.quantity++;
}else {
  this.cartItems.push(theCartItem);
}
this.computeCartTotals();


}

persistsCartItems(){
  this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
}



  computeCartTotals() {
    let totalPriceValue :number = 0;
    let totalQuantityValue :number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue +=currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue+= currentCartItem.quantity;

   this.totalP = totalPriceValue;
      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantityValue);
// LOGGING

this.logCartData(totalPriceValue,totalQuantityValue);


    }
    this.persistsCartItems();
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
  console.log(`contents of the cart`);
  for (let tempCartItem of this.cartItems){
    const subtotalPrice = tempCartItem.quantity*tempCartItem.unitPrice;
    console.log(`name : ${tempCartItem.name}, quantity = ${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice} subtotal= ${subtotalPrice}`);
  }

  console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity ; ${totalQuantityValue}`);
  console.log(".........................");
  }


  RemoveFromCart(theCartItem:CartItem){
    //check if we have items
    let alreadyExistsInCart:boolean=false;
    let existingCartItem:CartItem=undefined!;
  theCartItem.quantity--;
    if (theCartItem.quantity===0){
      this.remove(theCartItem);}
      else{
        this.computeCartTotals();
      }
    }
  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(
      tempCartItem => tempCartItem.id == theCartItem.id);
    
    if (itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
    }
    this.computeCartTotals();
  }

  
  }

