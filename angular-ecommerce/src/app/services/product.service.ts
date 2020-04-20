import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:9090/api/products';
  private categoryUrl = 'http://localhost:9090/api/product-category';

  constructor(private httpClient: HttpClient) { }


  /*
  * Returns an Observable.
  * map the JSON data from Spring Data Rest to product Array
  */
  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);

  }

  /*
  * Returns an Observable.
  * map the JSON data from Spring Data Rest to productCategory Array
  */
  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build Url based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  // Pagination support for searched product
  searchProductsPaginate(thePageNumber: number,
                         thePageSize: number,
                         theKeyword: string): Observable<GetResponseProducts> {

    // need to build Url based on keyword, page and size  
    const searchUrl = `${this.baseUrl}/search/findByNameContaining`
                       + `?name=${theKeyword}&page=${thePageNumber}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }





  getProductListPaginate(thePage: number,
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }


  getProduct(theProductId: number): Observable<Product> {

    // need to build Url based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }


}


/*
* unwraps the JSON from spring Data Rest entry
*/
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}


/*
* unwraps the JSON from spring Data Rest entry
*/
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}




