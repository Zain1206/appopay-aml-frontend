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
  selector: 'app-merchant',
  standalone: true,
  imports: [CommonModule, SharedModule, NavigationComponent, NavBarComponent, RouterModule],
  templateUrl: './merchant.component.html',
  styleUrl: './merchant.component.scss'
})
export class MerchantComponent implements OnInit{
  @ViewChild('blockUnblockModal') blockUnblockModal!: TemplateRef<any>;

  customers: any[] = [];
  merchants: any[] = []; 
  page: number = 0;
  size: number = 10;
  error: string | null = null;
  closeResult = '';
  selectedCustomer: any = null; // To store selected customer data
  selectedMerchant: any = null; 
  private modalService = inject(NgbModal);
  private modalRef: NgbModalRef | null = null;
  blockUnblockModalRef: NgbModalRef | undefined
  options = ['High', 'Medium', 'Low'];
  selectedOption: string | null = null;
  totalElements: number = 0; // Total number of users (for pagination)
  totalPages: number[] = [];  // Total pages for pagination
  currentPage: number = 1;  // Current page
  pageSize: number = 10;  // Records per page
  totalRecords: number = 0;
  searchTerm: string = ''; 
  merchantOriginal: any[] = [];
  pageSizeOptions: number[] = [5, 10, 20, 50, 100]; // Customize page size options

  constructor(private http: HttpClient, private router: Router, private customersService: CustomersService) {}

  ngOnInit(): void {
    this.loadMerchants();
  }

  // loadMerchants(): void { // Change from 'loadCustomers' to 'loadMerchants'
  //   this.customersService.getAllMerchants(this.page, this.size).subscribe( // Update service call
  //     data => {
  //       this.merchants = data.data; // Adjust based on the actual response structure
  //     },
  //     err => {
  //       this.error = 'Error fetching merchants: ' + err.message; // Update error message
  //     }
  //   );
  // }

  loadMerchants(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    // Aapka API call yahan ho ga to fetch customers for current page
    const pageIndex = this.currentPage - 1;  // API pagination usually starts from 0

    this.customersService.getAllMerchants(pageIndex, this.pageSize).subscribe((response: any) => {
      // this.merchants = response.data;
      this.merchants = response.data.slice(startIndex, endIndex); // Fetch only required records
      this.merchants = response.data.sort((a: any, b: any) => a.id - b.id); // Sorting by ID in ascending order
      this.merchantOriginal = [...this.merchants]; // Save the original customer list
      this.totalRecords = response.totalDocuments;  // Total records
      this.setPagination(this.totalRecords);
    });
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadMerchants();
  }
  
  setPagination(totalRecords: number): void {
    const totalPagesCount = Math.ceil(totalRecords / this.pageSize);
    this.totalPages = Array.from({ length: totalPagesCount }, (_, index) => index + 1);
  }

  // Go to specific page
  goToPage(page: number): void {
    this.currentPage = page;
    this.loadMerchants();
  }

  // Go to previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMerchants();
    }
  }

  // Go to next page
  nextPage(): void {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
      this.loadMerchants();
    }
  }
  open(content: TemplateRef<any>, merchant: any) {
    this.selectedMerchant = merchant;
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
    this.router.navigate(['/create-merchant'], { queryParams: { mode: 'create' } });
  }

  // openEditModal(content: TemplateRef<any>, id: number): void {
  //   this.customersService.getMerchantById(id).subscribe(
  //     data => {
  //       this.selectedMerchant = data; // Load customer data
  //       this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  //     },
  //     err => {
  //       console.error('Error fetching merchant:', err.message);
  //     }
  //   );
  // }
  openEditMerchant(merchantId: number): void {
    this.router.navigate(['/create-merchant'], { queryParams: { mode: 'edit', id: merchantId } });
  }

  openViewMerchant(merchantId: number): void {
    this.router.navigate(['/create-merchant'], { queryParams: { mode: 'view', id: merchantId } });
  }

  updateMerchant(): void {
    if (this.selectedMerchant) {
      this.customersService.updateMerchant(this.selectedMerchant.id, this.selectedMerchant).subscribe(
        () => {
          this.loadMerchants(); // Refresh merchants list after update
          if (this.modalRef) {
            this.modalRef.close(); // Close the modal
          }
        },
        err => {
          console.error('Error updating merchant:', err.message);
        }
      );
    }
  }

  openBlockUnblockModal(content: TemplateRef<any>, merchant: any): void {
    this.selectedMerchant = merchant;
    this.blockUnblockModalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }  

  blockUnblockCMerchant(): void {
    const block = !this.selectedMerchant.blocked;
    this.customersService.blockUnblockMerchant(this.selectedMerchant.id, block).subscribe(
      response => {
        console.log('Block/Unblock response:', response);
        this.selectedMerchant.isBlocked = block;
        this.loadMerchants(); // Refresh the merchant list
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

  // getRowClass(country: string): string {
  //   if (country === 'Andorra') {
  //     return 'bg-success'; // Green background for Andorra
  //   } else if (country === 'Argentina') {
  //     return 'bg-info'; // Blue background for Argentina
  //   } else {
  //     return 'bg-danger'; // Red background for other countries
  //   }
  // }

  getRowClass(risk: number): any {
    if (risk < 10) {
      return 'bg-success'; // Green for risk score < 10
    } else if (risk >= 10 && risk < 15) {
      return 'bg-info'; // Yellow for risk score between 10 and 15
    } else {
      return 'bg-danger'; // Red for risk score >= 15
    }
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  onSearch() {
    const searchTerm = this.searchTerm.toLowerCase();
    if (searchTerm === '') {
      this.merchants = [...this.merchantOriginal]; // Reset to original list if search is cleared
    } else {
      this.merchants = this.merchantOriginal.filter(merchant => {
        return merchant.legalName.toLowerCase().includes(searchTerm);
      });
    }
  }
}