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

@Component({
  selector: 'app-users',
  imports: [CommonModule, SharedModule, NavigationComponent, NavBarComponent, RouterModule],
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: [] // Remove or replace with a valid CSS path
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  page: number = 0;
  size: number = 10;
  error: string | null = null;
  selectedUser: any;
  private modalRef: NgbModalRef | null = null;

  constructor(private http: HttpClient, private router: Router, private customersService: CustomersService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.customersService.getAllUsers(this.page, this.size).subscribe(
      data => {
        this.users = data.data; // Adjust based on the actual response structure
      },
      err => {
        this.error = 'Error fetching users: ' + err.message;
      }
    );
  }

  openCreateUserDialog(): void {
    this.router.navigate(['/create-user']);
  }

  viewUser(content: TemplateRef<any>, user: any): void {
    this.selectedUser = user;
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  editUser(content: TemplateRef<any>, user: any): void {
    this.http.get<any>(`http://localhost:8080/user/${user.userName}`).subscribe(
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
    console.log('Data being sent to the server:', this.selectedUser);
    this.http.put(`http://localhost:8080/user`, this.selectedUser).subscribe(
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
  
  

  blockUnblockUser(user: any): void {
    const action = user.blocked ? 'unblock' : 'block';
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      this.http.put(`your-api-endpoint-here/${user.id}`, { blocked: !user.blocked })
        .subscribe(() => {
          this.loadUsers();
        });
    }
  }
}
