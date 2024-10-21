import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavBarComponent } from 'src/app/theme/layouts/admin-layout/nav-bar/nav-bar.component';
import { NavigationComponent } from 'src/app/theme/layouts/admin-layout/navigation/navigation.component';
import { CustomersService } from 'src/app/services/customers.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  imports: [CommonModule, SharedModule, NavigationComponent, NavBarComponent, RouterModule, NgbPaginationModule],
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'] // Remove or replace with a valid CSS path
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  page: number = 1; // Set default to 1 (page numbers start from 1)
  size: number = 10; // Number of users per page
  totalElements: number = 0; // Total number of users (for pagination)
  totalPages: number[] = [];  // Total pages for pagination
  currentPage: number = 1;  // Current page
  pageSize: number = 5;  // Records per page
  pageSizeOptions: number[] = [5, 10, 20, 50, 100]; // Customize page size options
  totalRecords: number = 0;
  error: string | null = null;
  selectedUser: any = {
    username: '',
    password: '',
    designation: '',
    isBlocked: false
  };
  
  totalMerchants: number = 0;
  totalAgents: number = 0;
  totalCustomers: number = 0;

  private modalRef: NgbModalRef | null = null;
  private environment = 'https://aml-backend.appopay.com'
  // private environment = 'http://localhost:8080'

  constructor(private http: HttpClient, private router: Router, private customersService: CustomersService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadUsers();
    this.totalMerchants = parseInt(localStorage.getItem('totalMerchants') || '0');
    this.totalAgents = parseInt(localStorage.getItem('totalAgents') || '0');
    this.totalCustomers = parseInt(localStorage.getItem('totalCustomers') || '0');
  }

  openCreateCustomerDialog(): void {
    this.router.navigate(['/create-customer']);
  }

  // loadUsers(): void {
  //   this.customersService.getAllUsers(this.currentPage - 1, this.size).subscribe(
  //     data => {
  //       this.users = data.data; // Adjust based on the actual response structure
  //       this.totalElements = data.totalElements;
  //     },
  //     err => {
  //       this.error = 'Error fetching users: ' + err.message;
  //     }
  //   );
  // }

  loadUsers(): void {
    // Aapka API call yahan ho ga to fetch customers for current page
    const pageIndex = this.currentPage - 1;  // API pagination usually starts from 0

    this.customersService.getAllUsers(pageIndex, this.pageSize).subscribe((response: any) => {
      // this.users = response.data;
      this.users = response.data.sort((a: any, b: any) => a.id - b.id);
      this.totalRecords = response.totalDocuments;  // Total records
      this.setPagination(this.totalRecords);
    });
  }

  onPageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.loadUsers();
  }
  
  setPagination(totalRecords: number): void {
    const totalPagesCount = Math.ceil(totalRecords / this.pageSize);
    this.totalPages = Array.from({ length: totalPagesCount }, (_, index) => index + 1);
  }

  // Go to specific page
  goToPage(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  // Go to previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  // Go to next page
  nextPage(): void {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  openCreateUserDialog(content: TemplateRef<any>): void {
    this.selectedUser = {
      username: '',
      password: '',
      designation: '',
      isBlocked: false
    };
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  createUser(): void {
    const payload = {
      username: this.selectedUser.username,
      password: this.selectedUser.password,
      designation: this.selectedUser.designation,
      isBlocked: this.selectedUser.isBlocked
    };

    this.http.post(`${this.environment}/user/sign-up`, payload).subscribe(
    // this.http.post('http://localhost:8080/user/sign-up', payload).subscribe(
      (response) => {
        console.log('User created successfully:', response);
        this.loadUsers(); // Refresh the user list after creating a new user
        if (this.modalRef) {
          this.modalRef.close(); // Close the modal if it's open
        }
      },
      (err) => {
        console.error('Error creating user:', err.message);
      }
    );
  }


  viewUser(content: TemplateRef<any>, user: any): void {
    this.selectedUser = user;
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  editUser(content: TemplateRef<any>, user: any): void {
    this.http.get<any>(`${this.environment}/user/${user.userName}`).subscribe(
      data => {
        console.log('API Response:', data);
        this.selectedUser = data;
        this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
      },
      err => {
        console.error('Error fetching user:', err.message);
      }
    );
  }
  

  updateUser(): void {
    const userToSend = { ...this.selectedUser, username: this.selectedUser.userName };
    console.log('Data being sent to the server:', this.selectedUser);
    this.http.put(`${this.environment}/user`, userToSend).subscribe(
      (response) => {
        console.log('User updated:', response);
        this.loadUsers(); 
        if (this.modalRef) {
          this.modalRef.close(); // Close the modal if it's open
        }
      },
      (err) => {
        console.error('Error updating user:', err.message);
      }
    );
  }

  openBlockUnblockModal(content: TemplateRef<any>, user: any): void {
    this.selectedUser = user; // Set the selected user
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  confirmBlockUnblock(): void {
    if (this.selectedUser) {
      // Update only the block/unblock status
      const updatedUser = {
        username: this.selectedUser.userName,
        password: this.selectedUser.password,
        designation: this.selectedUser.designation,
        isBlocked: !this.selectedUser.blocked
      };

      this.http.put(`${this.environment}/user`, updatedUser).subscribe(
        response => {
          console.log('User block/unblock status updated:', response);
          this.selectedUser.blocked = !this.selectedUser.blocked;
          if (this.modalRef) {
            this.modalRef.close(); // Close the modal
          }
        },
        error => {
          console.error('Error updating block/unblock status:', error);
        }
      );
    }
  }

}
