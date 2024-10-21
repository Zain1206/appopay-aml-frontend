import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  userName: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private customersService: CustomersService) {}

  onLogin() {
    console.log('Attempting login with:', {
      userName: this.userName,
      password: this.password
    });

    this.authService.login(this.userName, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', this.userName);

        this.fetchTotalMerchants();
        this.fetchTotalAgents();
        this.fetchTotalCustomers();

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
    });
  }

  fetchTotalMerchants() {
    this.customersService.getAllMerchants(1, 1)
      .subscribe((response: any) => {
        localStorage.setItem('totalMerchants', response.totalDocuments);
      });
  }

  fetchTotalAgents() {
    this.customersService.getAllAgents(1, 1)
      .subscribe((response: any) => {
        localStorage.setItem('totalAgents', response.totalDocuments);
      });
  }

  fetchTotalCustomers() {
    this.customersService.getAllCustomers(1, 1)
      .subscribe((response: any) => {
        localStorage.setItem('totalCustomers', response.totalDocuments);
      });
  }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

