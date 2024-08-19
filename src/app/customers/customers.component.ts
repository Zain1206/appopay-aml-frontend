import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavBarComponent } from '../theme/layouts/admin-layout/nav-bar/nav-bar.component';
import { NavigationComponent } from '../theme/layouts/admin-layout/navigation/navigation.component';
import { CustomersService } from '../services/customers.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, SharedModule, NavigationComponent, NavBarComponent, RouterModule],
  standalone: true,
  templateUrl: './customers.component.html',
  styleUrls: [] // Remove or replace with a valid CSS path
})

export class CustomersComponent implements OnInit {
  @ViewChild('blockUnblockModal') blockUnblockModal!: TemplateRef<any>;

  customers: any[] = [];
  page: number = 0;
  size: number = 10;
  error: string | null = null;
  closeResult = '';
  selectedCustomer: any = null; // To store selected customer data
  private modalService = inject(NgbModal);
  private modalRef: NgbModalRef | null = null;
  blockUnblockModalRef: NgbModalRef | undefined

  constructor(private http: HttpClient, private router: Router, private customersService: CustomersService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customersService.getAllCustomers(this.page, this.size).subscribe(
      data => {
        this.customers = data.data; // Adjust based on the actual response structure
      },
      err => {
        this.error = 'Error fetching customers: ' + err.message;
      }
    );
  }

  open(content: TemplateRef<any>, customer: any) {
    this.selectedCustomer = customer;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openCreateCustomerDialog(): void {
    this.router.navigate(['/create-customer']);
  }

  // editCustomer(customer: any): void {
  //   this.router.navigate(['/edit-customer', customer.id]);
  // }
  openEditModal(content: TemplateRef<any>, customerId: number): void {
    this.customersService.getCustomerById(customerId).subscribe(
      data => {
        this.selectedCustomer = data; // Load customer data
        this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
      },
      err => {
        console.error('Error fetching customer:', err.message);
      }
    );
  }

  updateCustomer(): void {
    if (this.selectedCustomer) {
      this.customersService.updateCustomer(this.selectedCustomer.id, this.selectedCustomer).subscribe(
        () => {
          this.loadCustomers(); // Refresh customers list after update
          if (this.modalRef) {
            this.modalRef.close(); // Close the modal
          }
        },
        err => {
          console.error('Error updating customer:', err.message);
        }
      );
    }
  }

  openBlockUnblockModal(content: TemplateRef<any>, customer: any): void {
    this.selectedCustomer = customer;
    this.blockUnblockModalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }  

  blockUnblockCustomer(): void {
    const block = !this.selectedCustomer.blocked;
    this.customersService.blockUnblockCustomer(this.selectedCustomer.id, block).subscribe(
      response => {
        console.log('Block/Unblock response:', response);
        this.selectedCustomer.blocked = block;
        this.loadCustomers(); // Refresh the customer list
        if (this.blockUnblockModalRef) {
          this.blockUnblockModalRef.close(); // Close the modal using NgbModalRef
        }
      },
      error => {
        console.error('Error in Block/Unblock:', error);
        // Handle error
      }
    );
  }
}
