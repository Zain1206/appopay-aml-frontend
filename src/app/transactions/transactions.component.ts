import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { CustomersService } from '../services/customers.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  selectedTransaction: any;
  modalRef: NgbModalRef;
  totalElements: number = 0; // Total number of users (for pagination)
  totalPages: number[] = [];  // Total pages for pagination
  currentPage: number = 1;  // Current page
  pageSize: number = 5;  // Records per page
  totalRecords: number = 0;
  page: number = 0;
  error: string | null = null;
  size: number = 50;
  selectedOption: string | null = null;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100]; // Customize page size options
  searchTerm: string = ''; 
  transactionOriginal: any[] = [];

  constructor(private http: HttpClient, private modalService: NgbModal, private customersService: CustomersService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }


  loadTransactions(): void {
    const pageIndex = this.currentPage - 1;
    this.customersService.getAllTransactions(pageIndex, this.pageSize).subscribe((response: any) => {
      this.transactions = response.data.sort((a: any, b: any) => a.id - b.id); // Sorting by ID in ascending order
      this.transactionOriginal = [...this.transactions]; // Save the original customer list
      this.totalRecords = response.totalDocuments;  // Total records
      this.setPagination(this.totalRecords); 
           },
        err => {
            this.error = 'Error fetching agents: ' + err.message;
        }
    );
}

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadTransactions();
  }
  
  setPagination(totalRecords: number): void {
    const totalPagesCount = Math.ceil(totalRecords / this.pageSize);
    this.totalPages = Array.from({ length: totalPagesCount }, (_, index) => index + 1);
  }
  
  // Go to specific page
  goToPage(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }
  
  // Go to previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTransactions();
    }
  }
  
  // Go to next page
  nextPage(): void {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  viewTransaction(transaction: any, content: TemplateRef<any>): void {
    this.selectedTransaction = transaction;
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // flagTransaction(transaction: any): void {
  //   transaction.allowed = !transaction.allowed;
  //   console.log('Transaction flag status changed:', transaction);
  // }

  flagTransaction(transaction: any): void {
    // Assume transaction has a reference to customer ID
    const block = !transaction.allowed; // 'allowed' determines whether to block/unblock
    this.customersService.blockUnblockCustomer(transaction.customerId, block).subscribe(
      response => {
        console.log('Block/Unblock response:', response);
        transaction.allowed = !transaction.allowed; // Toggle the allowed state
        console.log(`Transaction for Customer ID ${transaction.customerId} is now ${block ? 'Blocked' : 'Unblocked'}`);
      },
      error => {
        console.error('Error in Block/Unblock:', error);
        // Handle error
      }
    );
}

getRowClass(riskScore: number): string {
  if (riskScore < 10) {
    return 'bg-success';
  } else if (riskScore >= 10 && riskScore < 15) {
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
      this.transactions = [...this.transactionOriginal]; // Reset to original list if search is cleared
    } else {
      this.transactions = this.transactionOriginal.filter(transaction => {
        return transaction.amount.toLowerCase().includes(searchTerm);
      });
    }
}

}
