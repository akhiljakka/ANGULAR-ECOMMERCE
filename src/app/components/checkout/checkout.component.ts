import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';

import { CardvalidateService } from 'src/app/services/cardvalidate.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { WhiteSpaceValidation } from 'src/app/validators/white-space-validation';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
storage: Storage =sessionStorage;
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  isDisabled: boolean =false;
  //init stripe api
  stripe = Stripe(environment.stripePublishableKey);
paymentInfo:PaymentInfo=new PaymentInfo();
cardElements:any;
displayErrors:any;
  
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  
  
  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: CardvalidateService,
            private cartService: CartService,
          private checkOutService: CheckoutService,
        private router: Router) { }

  ngOnInit(): void {

    //set up stripe payment
    this.setupStripePaymentForm();
    
      const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
      this.cartService.totalPrice.subscribe(
        data => this.totalPrice=data
      );
      
      this.cartService.totalQuantity.subscribe(
        data => this.totalQuantity=data
      );


    
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                              [Validators.required, 
                               Validators.minLength(2), 
                               WhiteSpaceValidation.notOnlyWhitespace]),

        lastName:  new FormControl('', 
                              [Validators.required, 
                               Validators.minLength(2), 
                               WhiteSpaceValidation.notOnlyWhitespace]),
                               
        email: new FormControl(theEmail,
                              [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
          WhiteSpaceValidation.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
          WhiteSpaceValidation.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
          WhiteSpaceValidation.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), 
          WhiteSpaceValidation.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), 
          WhiteSpaceValidation.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), 
          WhiteSpaceValidation.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({





        /*
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2), 
          WhiteSpaceValidation.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']*/
      })
    });

    // populate credit card months

   /* const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );*/

    // populate countries

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }
  setupStripePaymentForm() {
    // get a handle to stripe elements

    var elements = this.stripe.elements();
    
    // create a card elements
this.cardElements = elements.create('card',{hidePostalCode:true});
    // Add n instance of card UI component into 'card-element' div
    this.cardElements.mount('#card-element');

    //Add event binding
    this.cardElements.on('change',(event:any)=>{
      this.displayErrors = document.getElementById('card-errors');

      if(event.complete){
        this.displayErrors.textContent = "";

      } else if (event.error){
        this.displayErrors.textContent=event.error.message;
      }
    })

  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }



  copyShippingAddressToBillingAddress(event:any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;

    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }
    
  }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    // set up order
let order = new Order();
order.totalPrice=this.totalPrice;
order.totalQuantity = this.totalQuantity;
    //get cart items
const cartItems = this.cartService.cartItems;
    //create orderItems from cartItems
    let orderItems:OrderItem[]=[];
    for(let i=0;i<cartItems.length;i++){
      orderItems[i]= new OrderItem(cartItems[i]);
    }
    let purchase = new Purchase();
    //populate purchase - customer
    purchase.customer=this.checkoutFormGroup.controls['customer'].value;
   //populate purchase -shipping address

    purchase.shippingAddress=this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State=JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    const shippingCountry: Country=JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    purchase.shippingAddress!.state=shippingState.name;
    purchase.shippingAddress!.country= shippingCountry.name;




    //populate purchase -billing address

    purchase.billingAddress=this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State=JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    const billingCountry: Country=JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    purchase.billingAddress!.state=billingState.name;
    purchase.billingAddress!.country= billingCountry.name;

    console.log(JSON.stringify(purchase));
    //populate purchase - order and orderItems
    purchase.order=order;
    purchase.orderItems=orderItems;

    //compute total amount
    this.paymentInfo.amount=Math.round(this.totalPrice*100) ;
    this.paymentInfo.currency="USD";
    console.log(`this.paymentInfo: ${this.paymentInfo.amount}`);
    this.paymentInfo.receiptEmail=purchase.customer?.email;
    //call rest api 
    /*this.checkOutService.placeOrder(purchase).subscribe(
      {
        next: response =>{
          alert(` your order has been received.\n order tracking number : ${response.orderTrackingNumber}`);

          //reset the cart
          this.resetCart();
        },
        error: err =>{
          alert(`There was an error: $(err.message)`);
        }
        
      }
    );*/
  
    // if valid form then 

    // create payment intent

    // confirm card payment

    // place order

    if (!this.checkoutFormGroup.invalid && this.displayErrors.textContent===""){
      this.isDisabled=true;
      this.checkOutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse)=>{
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,{
            payment_method:
            {
              card:this.cardElements,
              billing_details: {
                email: purchase.customer?.email,
                name: `${purchase.customer?.firstName} ${purchase.customer?.lastName}`,
                address:{
                  line1:purchase.billingAddress?.street,
                  city:purchase.billingAddress?.city,
                  state:purchase.billingAddress?.state,
                  postal_code:purchase.billingAddress?.zipCode,
                  country: this.billingAddressCountry?.value.code

                }
              }
            }
          },{handleActions: false})
          .then((result:any)=>
          {
            if(result.error){
              // there is an error
              alert(`There was an error :${result.error.message}`);
              this.isDisabled=false;
            } else {
              //call REST API
              this.checkOutService.placeOrder(purchase).subscribe(
                {
                  next: (response:any)=> {
                    alert(`Your order is recived \norder tracking number: ${response.orderTrackingNumber}`);
                    this.resetCart();
                    this.isDisabled=false;
                  },
                  error:(err:any)=>{
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled=false;
                  }
                }
              )
            }
          })
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

  }
  resetCart() {
    //reset cart data
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistsCartItems();
    //reset the form
    this.checkoutFormGroup.reset();
    //navigate back to home  product page
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data; 
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }
}
