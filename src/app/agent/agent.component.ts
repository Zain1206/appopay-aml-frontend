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
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, SharedModule, NavigationComponent, NavBarComponent, RouterModule],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss'
})
export class AgentComponent {
  @ViewChild('blockUnblockModal') blockUnblockModal!: TemplateRef<any>;

  customers: any[] = [];
  agents: any[] = [];
  page: number = 0;
  size: number = 10;
  error: string | null = null;
  closeResult = '';
  selectedAgent: any = null; // To store selected customer data
  private modalService = inject(NgbModal);
  private modalRef: NgbModalRef | null = null;
  blockUnblockModalRef: NgbModalRef | undefined
  options = ['HIGH', 'MEDIUM', 'LOW'];
  selectedOption: string | null = null;
  totalElements: number = 0; // Total number of users (for pagination)
  totalPages: number[] = [];  // Total pages for pagination
  currentPage: number = 1;  // Current page
  pageSize: number = 10;  // Records per page
  totalRecords: number = 0;
  showDropdown = -1; 
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  agentsOriginal: any[] = [];
  searchTerm: string = ''; 

  constructor(private http: HttpClient, private router: Router, private customersService: CustomersService) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    const pageIndex = this.currentPage - 1;
    this.customersService.getAllAgents(pageIndex, this.pageSize).subscribe((response: any) => {
      // this.agents = response.data;
      this.agents = response.data.sort((a: any, b: any) => a.id - b.id);
      this.agentsOriginal = [...this.agents]; 
      this.totalRecords = response.totalDocuments;
      this.setPagination(this.totalRecords); 
           },
        err => {
            this.error = 'Error fetching agents: ' + err.message;
        }
    );
}

onPageChange(pageNumber: number): void {
  this.page = pageNumber;
  this.loadAgents();
}

setPagination(totalRecords: number): void {
  const totalPagesCount = Math.ceil(totalRecords / this.pageSize);
  this.totalPages = Array.from({ length: totalPagesCount }, (_, index) => index + 1);
}

// Go to specific page
goToPage(page: number): void {
  this.currentPage = page;
  this.loadAgents();
}

// Go to previous page
prevPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadAgents();
  }
}

// Go to next page
nextPage(): void {
  if (this.currentPage < this.totalPages.length) {
    this.currentPage++;
    this.loadAgents();
  }
}

  open(content: TemplateRef<any>, agent: any) {
    this.selectedAgent = agent;
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
    this.router.navigate(['/create-agent'], { queryParams: { mode: 'create' } });
  }

  openEditAgent(agentId: number): void {
    this.router.navigate(['/create-agent'], { queryParams: { mode: 'edit', id: agentId } });
  }

  openViewAgent(agentId: number): void {
    this.router.navigate(['/create-agent'], { queryParams: { mode: 'view', id: agentId } });
  }

  updateAgent(): void {
    if (this.selectedAgent) {
      this.customersService.updateAgent(this.selectedAgent.id, this.selectedAgent).subscribe(
        () => {
          this.loadAgents(); // Refresh agent list after update
          if (this.modalRef) {
            this.modalRef.close(); // Close the modal
          }
        },
        err => {
          console.error('Error updating agent:', err.message);
        }
      );
    }
  }

  openBlockUnblockModal(content: TemplateRef<any>, agent: any): void {
    this.selectedAgent = agent;
    this.blockUnblockModalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }  

  blockUnblockAgent(): void {
    const block = !this.selectedAgent.blocked;
    console.log('Block/Unblock response1:', block);
    this.customersService.blockUnblockAgent(this.selectedAgent.id, block).subscribe(
      response => {
        console.log('Block/Unblock response:', response);
        this.selectedAgent.isBlocked = block;
        this.loadAgents(); // Refresh the agent list
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
      this.agents = [...this.agentsOriginal]; // Reset to original list if search is cleared
    } else {
      this.agents = this.agentsOriginal.filter(agent => {
        return agent.compRegName.toLowerCase().includes(searchTerm);
      });
    }
  }
}
