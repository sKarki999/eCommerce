import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EShopFormService } from 'src/app/services/e-shop-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];
  
  countries: Country[] =[];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  
  constructor(private formBuilder: FormBuilder,
              private eshopFormService: EShopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({

        firstName: [''],
        lastName: [''],
        email: ['']

      }),

      shippingAddress: this.formBuilder.group({

        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
        
      }),

      billingAddress: this.formBuilder.group({

        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
        
      }),

      creditCard: this.formBuilder.group({

        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']

      })
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("Start Month: " + startMonth);

    this.eshopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );


    //populate credit card years
    this.eshopFormService.getCreditCardYear().subscribe(
      data => {
        console.log("Retrieved credit card Years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    //populate Countries
    this.eshopFormService.getCountries().subscribe(
      data => {
        console.log("Retrived Countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  
  }

  copyShippingAddressToBillingAddress(event){

    if(event.target.checked) {
      
        this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
        this.billingAddressStates = this.shippingAddressStates;
    
      } else {
    
        this.checkoutFormGroup.controls.billingAddress.reset();
        
        this.billingAddressStates = [];
    }

  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The Email Address is " + this.checkoutFormGroup.get('customer').value.email);
  }

  handleMonthsAndYear() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    //if current Year equals the selected year, then start with current year
    if(currentYear === selectedYear ) {
      startMonth = new Date().getMonth() + 1;
    }
     else {
       startMonth = 1;
     }

     this.eshopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.eshopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data; 
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }
}



