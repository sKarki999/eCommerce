import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:9090/api/products';

  constructor( private httpClient: HttpClient) { }


  /*
  * Returns an Observable.
  * map the JSON data from Spring Data Rest to product Array
  */
  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );

  }

}

/*
* unwraps the JSON from spring Data Rest entry
*/
interface GetResponse {
    _embedded: {
      products: Product[];
    }
  }
