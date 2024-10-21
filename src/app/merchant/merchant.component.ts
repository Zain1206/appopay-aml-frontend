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
  selectedCustomer: any = null;
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
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];

  constructor(private http: HttpClient, private router: Router, private customersService: CustomersService) {}

  ngOnInit(): void {
    this.loadMerchants();
  }

  loadMerchants(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const pageIndex = this.currentPage - 1;

    this.customersService.getAllMerchants(pageIndex, this.pageSize).subscribe((response: any) => {
      this.merchants = response.data.slice(startIndex, endIndex);
      this.merchants = response.data.sort((a: any, b: any) => a.id - b.id);
      this.merchantOriginal = [...this.merchants];
      this.totalRecords = response.totalDocuments;
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

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadMerchants();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMerchants();
    }
  }

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
          this.loadMerchants();
          if (this.modalRef) {
            this.modalRef.close();
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
        this.loadMerchants();
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

  getRowClass(risk: number): any {
    if (risk < 10) {
      return 'bg-success';
    } else if (risk >= 10 && risk < 15) {
      return 'bg-info';
    } else {
      return 'bg-danger';
    }
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  onSearch() {
    const searchTerm = this.searchTerm.toLowerCase();
    if (searchTerm === '') {
      this.merchants = [...this.merchantOriginal];
    } else {
      this.merchants = this.merchantOriginal.filter(merchant => {
        return merchant.legalName.toLowerCase().includes(searchTerm);
      });
    }
  }
}
