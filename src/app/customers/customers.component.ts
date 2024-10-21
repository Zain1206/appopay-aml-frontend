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
import { IconService } from '@ant-design/icons-angular';
import { MenuUnfoldOutline, MenuFoldOutline, SearchOutline } from '@ant-design/icons-angular/icons';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, SharedModule, NavigationComponent, NavBarComponent, RouterModule],
  standalone: true,
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export class CustomersComponent implements OnInit {
  @ViewChild('blockUnblockModal') blockUnblockModal!: TemplateRef<any>;

  customers: any[] = [];
  page: number = 0;
  size: number = 10;
  error: string | null = null;
  closeResult = '';
  selectedCustomer: any = null;
  private modalService = inject(NgbModal);
  private modalRef: NgbModalRef | null = null;
  blockUnblockModalRef: NgbModalRef | undefined;
  totalElements: number = 0; // Total number of users (for pagination)
  totalPages: number[] = [];  // Total pages for pagination
  currentPage: number = 1;  // Current page
  pageSize: number = 5;  // Records per page
  totalRecords: number = 0;
  windowWidth: number;
  searchTerm: string = ''; 
  customersOriginal: any[] = [];
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  options = ['HIGH', 'MEDIUM', 'LOW'];

  constructor(private http: HttpClient, private router: Router, private customersService: CustomersService,
    private iconService: IconService) {
      this.windowWidth = window.innerWidth;
      this.iconService.addIcon(...[MenuUnfoldOutline, MenuFoldOutline, SearchOutline]);
    }

  ngOnInit(): void {
    this.loadCustomers();
  }

  selectOption(option: string) {
    this.selectedCustomer.riskStatus = option;
  }

  loadCustomers(): void {
    const pageIndex = this.currentPage - 1; 
    this.customersService.getAllCustomers(pageIndex, this.pageSize).subscribe((response: any) => {
      this.customers = response.data.sort((a: any, b: any) => a.id - b.id);
      this.customersOriginal = [...this.customers]; // Save the original customer list
      this.totalRecords = response.totalDocuments;
      this.setPagination(this.totalRecords);

      },
      err => {
        this.error = 'Error fetching customers: ' + err.message;
      }
    );
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadCustomers();
  }
  
  setPagination(totalRecords: number): void {
    const totalPagesCount = Math.ceil(totalRecords / this.pageSize);
    this.totalPages = Array.from({ length: totalPagesCount }, (_, index) => index + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadCustomers();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCustomers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
      this.loadCustomers();
    }
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


  openEditModal(content: TemplateRef<any>, customerId: number, customerName: string): void {
    const customerData = this.customersService.getCustomerById(customerId);
    const ofacData = this.customersService.getOfac(customerName);
  
    forkJoin([customerData, ofacData]).subscribe(([customerData, ofacData]) => {
      this.selectedCustomer = customerData;

      if (ofacData) { // Check if OFAC data is available
        this.selectedCustomer.message = ofacData.message;
      }

      this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    },
    err => {
      console.error('Error fetching data:', err.message);
    });
  }

  
  updateCustomer(): void {
    if (this.selectedCustomer) {
      console.log("sending update request" + this.selectedCustomer)
      this.customersService.updateCustomer(this.selectedCustomer.id, this.selectedCustomer).subscribe(
        () => {
          this.loadCustomers();
          if (this.modalRef) {
            this.modalRef.close();
          }
        },
        err => {
          console.error('Error updating customer:', err.message);
        }
      );
    }
  }

  deleteCustomer(customerId: string): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customersService.deleteCustomer(customerId).subscribe(
        response => {
          console.log('Customer deleted successfully:', response);
          this.loadCustomers();
        },
        error => {
          console.log('Error occurred while deleting customer:', error);
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
        this.loadCustomers();
        if (this.blockUnblockModalRef) {
          this.blockUnblockModalRef.close();
        }
      },
      error => {
        console.error('Error in Block/Unblock:', error);
        // Handle error
      }
    );
  }

  getRowClass(riskScore: number): any {
    if (riskScore < 10) {
      return { 'background-color': '#3ac093' };
    } else if (riskScore >= 10 && riskScore < 15) {
      return { 'background-color': '#ffe365' };
    } else {
      return { 'background-color': '#f88080' };
    }
  }

  onSearch() {
    const searchTerm = this.searchTerm.toLowerCase();
    if (searchTerm === '') {
      this.customers = [...this.customersOriginal];
    } else {
      this.customers = this.customersOriginal.filter(customer => {
        return customer.customerName.toLowerCase().includes(searchTerm);
      });
    }
  }
}
