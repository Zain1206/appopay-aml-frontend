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
  selector: 'app-partner',
  standalone: true,
  imports: [CommonModule, SharedModule, NavigationComponent, NavBarComponent, RouterModule],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.scss'
})
export class PartnerComponent implements OnInit{
  @ViewChild('blockUnblockModal') blockUnblockModal!: TemplateRef<any>;

  partners: any[] = [];
  page: number = 0;
  size: number = 50;
  error: string | null = null;
  closeResult = '';
  selectedPartner: any = null; 
  blockUnblockModalRef: NgbModalRef | undefined
  options = ['High', 'Medium', 'Low'];
  selectedOption: string | null = null;
  totalElements: number = 0; // Total number of users (for pagination)
  totalPages: number[] = [];  // Total pages for pagination
  currentPage: number = 1;  // Current page
  pageSize: number = 10;  // Records per page
  totalRecords: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100]; // Customize page size options
  partnersOriginal: any[] = [];
  searchTerm: string = ''; 

  private modalService = inject(NgbModal);
  private modalRef: NgbModalRef | null = null;

  constructor(private http: HttpClient, private router: Router, private customersService: CustomersService) {}

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    const pageIndex = this.currentPage - 1;
    this.customersService.getPartners(pageIndex, this.pageSize).subscribe((response: any)=> {
      this.partners = response.data.sort((a: any, b: any) => a.id - b.id); // Sorting by ID in ascending order
      this.partnersOriginal = [...this.partners]; // Save the original customer list
      this.totalRecords = response.totalDocuments;  // Total records
      this.setPagination(this.totalRecords);
           },
      err => {
        this.error = 'Error fetching partners: ' + err.message;
      }
    );
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadPartners();
  }
  
  setPagination(totalRecords: number): void {
    const totalPagesCount = Math.ceil(totalRecords / this.pageSize);
    this.totalPages = Array.from({ length: totalPagesCount }, (_, index) => index + 1);
  }
  
  // Go to specific page
  goToPage(page: number): void {
    this.currentPage = page;
    this.loadPartners();
  }
  
  // Go to previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPartners();
    }
  }
  
  // Go to next page
  nextPage(): void {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
      this.loadPartners();
    }
  }

  open(content: TemplateRef<any>, partner: any) {
    this.selectedPartner = partner;
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
    this.router.navigate(['/create-partner'], { queryParams: { mode: 'create' } });
  }

  openEditPartner(partnerId: number): void {
    this.router.navigate(['/create-partner'], { queryParams: { mode: 'edit', id: partnerId } });
  }

  openViewPartner(partnerId: number): void {
    this.router.navigate(['/create-partner'], { queryParams: { mode: 'view', id: partnerId } });
  }

  // openEditModal(content: TemplateRef<any>, id: number): void {
  //   this.customersService.getPartnerById(id).subscribe(
  //     data => {
  //       this.selectedPartner = data; // Load customer data
  //       this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  //     },
  //     err => {
  //       console.error('Error fetching partner:', err.message);
  //     }
  //   );
  // }

  updatePartner(): void {
    if (this.selectedPartner) {
      this.customersService.updatePartner(this.selectedPartner.id, this.selectedPartner).subscribe(
        () => {
          this.loadPartners(); // Refresh partner list after update
          if (this.modalRef) {
            this.modalRef.close(); // Close the modal
          }
        },
        err => {
          console.error('Error updating partner:', err.message);
        }
      );
    }
  }

  openBlockUnblockModal(content: TemplateRef<any>, partner: any): void {
    this.selectedPartner = partner;
    this.blockUnblockModalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }  

  blockUnblockPartner(): void {
    const block = !this.selectedPartner.blocked;
    this.customersService.blockUnblockPartner(this.selectedPartner.id, block).subscribe(
      response => {
        console.log('Block/Unblock response:', response);
        this.selectedPartner.blocked = block;
        this.loadPartners(); // Refresh the partner list
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
      this.partners = [...this.partnersOriginal]; // Reset to original list if search is cleared
    } else {
      this.partners = this.partnersOriginal.filter(partner => {
        return partner.compRegName.toLowerCase().includes(searchTerm);
      });
    }
  }
}
