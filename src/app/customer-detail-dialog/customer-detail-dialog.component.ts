import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerDetailDialogService } from '../services/customer-detail-dialog.service';

@Component({
  selector: 'app-customer-detail-dialog',
  templateUrl: './customer-detail-dialog.component.html',
  styleUrls: ['./customer-detail-dialog.component.css']
})
export class CustomerDetailDialogComponent implements OnInit {
  customerId: number | null = null;
  customer: any = {};
  isVisible: boolean = false;

  constructor(private http: HttpClient, private dialogService: CustomerDetailDialogService) {}

  ngOnInit(): void {
    this.dialogService.getDialogState().subscribe(state => {
      this.isVisible = state.visible;
      this.customerId = state.customerId || null;
      if (this.customerId !== null) {
        this.loadCustomerDetails(this.customerId);
      }
    });
  }

  loadCustomerDetails(customerId: number): void {
    this.http.get(`http://localhost:8080/customer/${customerId}`).subscribe(
      (response: any) => {
        this.customer = response;
      },
      (error) => {
        console.error('Error loading customer details:', error);
      }
    );
  }

  close(): void {
    this.dialogService.hideDialog();
  }
}
