import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  // private environment = 'https://aml-backend.appopay.com'
  private environment = 'http://localhost:8080'
  // private baseUrl = 'https://aml-backend.appopay.com/customer';
  private baseUrl = `${this.environment}/customer`;

  
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

  getOfac(customerName: string): Observable<any> {
    const url = `http://3.13.197.45:8081/visa/ofac/status/${customerName}`;
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
    console.log("sending update request:", JSON.stringify(data, null, 2));
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
    const url = `${this.environment}/user/findAll/${page}/${size}`;
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

  getAllAgents(page: number, size: number): Observable<any> {
    const url = `${this.environment}/agent/findAll/${page}/${size}`;
    console.log('Sending request to URL:', url);

    return this.http.post(url, {}, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  createAgent(agent: any): Observable<any> {
    const url = `${this.environment}/agent/`;

    console.log('Sending request to URL:', url);
    console.log('Request body:', agent);

    return this.http.post(url, agent, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  updateAgent(id: number, data: any): Observable<any> {
    console.log("sending update request:", JSON.stringify(data, null, 2));
    return this.http.put(`${this.environment}/agent/`, data);
  }

  getAgentById(id: number): Observable<any> {
    const url = `${this.environment}/agent/${id}`;
    console.log('Sending GET request to URL:', url);
  
    return this.http.get(url, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  blockUnblockAgent(id: number, block: boolean): Observable<string> {
    const url = `${this.environment}/agent/block/${id}/${block}`;
    return this.http.put(url, {}, { responseType: 'text' }).pipe(
      tap(response => console.log('Block/Unblock response:', response)),
      catchError(this.handleError)
    );
  }

  getAllMerchants(page: number, size: number): Observable<any> {
    const url = `${this.environment}/merchant/findAll/${page}/${size}`;
    console.log('Sending request to URL:', url);

    return this.http.post(url, {}, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  createMerchant(merchant: any): Observable<any> {
    const url = `${this.environment}/merchant/`;
    console.log('Sending request to URL:', url);
    console.log('Request body:', merchant);

    return this.http.post(url, merchant, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  updateMerchant(id: number, data: any): Observable<any> {
    return this.http.put(`${this.environment}/merchant/`, data);
  }

  getMerchantById(id: number): Observable<any> {
    const url = `${this.environment}/merchant/${id}`;
    console.log('Sending GET request to URL:', url);
  
    return this.http.get(url, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  blockUnblockMerchant(id: number, block: boolean): Observable<string> {
    const url = `${this.environment}/merchant/block/${id}/${block}`;
    return this.http.put(url, {}, { responseType: 'text' }).pipe(
      tap(response => console.log('Block/Unblock response:', response)),
      catchError(this.handleError)
    );
  }

  getPartners(page: number, size: number): Observable<any> {
    const url = `${this.environment}/partner/findAll/${page}/${size}`;
    console.log('Sending request to URL:', url);

    return this.http.post(url, {}, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  createPartner(partner: any): Observable<any> {
    const url = `${this.environment}/partner/`;

    console.log('Sending request to URL:', url);
    console.log('Request body:', partner);

    return this.http.post(url, partner, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  getPartnerById(id: number): Observable<any> {
    const url = `${this.environment}/partner/${id}`;

    console.log('Sending GET request to URL:', url);
  
    return this.http.get(url, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  updatePartner(id: number, data: any): Observable<any> {
    return this.http.put(`${this.environment}/partner/`, data);

  }

  blockUnblockPartner(id: number, block: boolean): Observable<string> {
    const url = `${this.environment}/partner/block/${id}/${block}`;
    return this.http.put(url, {}, { responseType: 'text' }).pipe(
      tap(response => console.log('Block/Unblock response:', response)),
      catchError(this.handleError)
    );
  }

  deleteCustomer(customerId: string): Observable<any> {
    const url = `${this.environment}/customer/${customerId}`;
    console.log('Sending DELETE request to URL:', url);
  
    return this.http.delete(url, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }
  
  getAllTransactions(page: number, size: number): Observable<any> {
    const url = `${this.environment}/transaction/${page}/${size}`;
    console.log('Sending request to URL:', url);

    return this.http.get(url, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

}
