import { Component } from '@angular/core';
import { CustomersService } from '../../../../services/customers.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.scss'
})
export class CreateCustomerComponent {
  customer: any = {
    customerName: '',
    countryOfOrigin: '',
    customerId: '',
    politicallyExposedPerson: false,
    identityType: '',
    identityNumber: ''
  };

  constructor(private customersService: CustomersService, private router: Router) {}

  onSubmit(): void {
    this.customersService.createCustomer(this.customer).subscribe(
      response => {
        alert('Customer created successfully!');
        this.router.navigate(['/customers']);
      },
      error => {
        console.error('Error creating customer:', error);
        alert('Error creating customer. Please try again.');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }
}
