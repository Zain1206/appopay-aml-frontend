import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private baseUrl = 'http://localhost:8080/customer';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  getAllCustomers(page: number, size: number): Observable<any> {
    const url = `${this.baseUrl}/findAll/${page}/${size}`;
    console.log('Sending request to URL:', url);

    return this.http.post(url, {}, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  getCustomerById(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    console.log('Sending GET request to URL:', url);
  
    return this.http.get(url, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  createCustomer(customer: any): Observable<any> {
    const url = `${this.baseUrl}/validateRegularAcc`;
    console.log('Sending request to URL:', url);
    console.log('Request body:', customer);

    return this.http.post(url, customer, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  updateCustomer(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}`, data);
  }

  blockUnblockCustomer(id: number, block: boolean): Observable<string> {
    const url = `${this.baseUrl}/block/${id}/${block}`;
    return this.http.put(url, {}, { responseType: 'text' }).pipe(
      tap(response => console.log('Block/Unblock response:', response)),
      catchError(this.handleError)
    );
  }

  getAllUsers(page: number, size: number): Observable<any> {
    const url = `http://localhost:8080/user/findAll/${page}/${size}`;
    console.log('Sending request to URL:', url);
  
    return this.http.get(url, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }

}
