import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }


  addToCart(theCartItem: CartItem){

  // check if we already have the item in the cart
  let alreadyExistsInCart: boolean = false;
  let existingCartItem: CartItem = undefined;  

  if( this.cartItems.length>0 ){
  
    // find the item in the card based on item id
    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

    // check if we found it
    alreadyExistsInCart = (existingCartItem != undefined);

  }

  if(alreadyExistsInCart) {
    existingCartItem.quantity++;
  }
  else {
    this.cartItems.push(theCartItem);
  }

  this.computeCartTotals();

}
  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){

      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;

    }

    // publish new values, all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  
    
    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue);
  
  }

  logCartData(totalPriceValue: number) {

    console.log('Content of the Cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name:${tempCartItem.name}, quantity:${tempCartItem.quantity}, unitPrice:${tempCartItem.unitPrice}, 
                   SubTotalPrice:${subTotalPrice}`);
    }

    console.log(`Total Price:${totalPriceValue.toFixed(2)}, Total Quantity=${this.totalQuantity}`);
    console.log('---------');
  }

}
