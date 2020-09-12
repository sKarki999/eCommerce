import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string;
  searchMode: boolean = false;


  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
 

  previousKeyword: string = null;


  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(()=> {
    
      this.listProducts();
    
    })    
  }

  listProducts() {
    
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){

      this.handleSearchProducts();

    } else {

      this.handleListProduct();

    }
   
  }

  handleSearchProducts() {

    const theKeyword = this.route.snapshot.paramMap.get('keyword');
    
    /*
    * if we have different keyword than previous
    * set thePageNumber to 1 
    */

    if(this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
     
    //to keep track of the keyword
    this.previousKeyword = theKeyword;

    // logging to console
    console.log(`keyword: ${theKeyword}, thePageNumber=${this.thePageNumber}`);
  
  
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
  }


  
  handleListProduct() {

    // check if the category is present or not
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      // get the 'id' param string. convert string to number using '+'
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

      // get the 'name' param string 
       this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    
    } else {
      // incase categoryId not present. default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    
    /*
    * check if we have different category id than previous
    * Note: Angular will reuse a component if it is currently being viewed
    */

    /*
    * for setting and resetting concept 
    * if we have different category id than previous then
    * set the pageNumber to 1  
    */
    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    // keeping track of the category
    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId = ${this.currentCategoryId}, thePageNumber = ${this.thePageNumber}`);

    // now get the product for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId).subscribe(this.processResult());

  }



  private processResult() {

    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }

  }


  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }



  addToCart(theProduct: Product){

    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);

    

  }



}




