import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/user/login';  // Replace with your API endpoint

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<any> {
    const body = { userName, password };

    console.log('Sending login request with body:', body);

    return this.http.post(this.loginUrl, body, { headers: this.headers }).pipe(
      tap(response => console.log('Received response:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Login failed. Please try again later.'));
  }
}
