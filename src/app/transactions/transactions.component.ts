import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  selectedTransaction: any;
  modalRef: NgbModalRef;

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.http.get<any[]>('http://localhost:8080/customer/transactions/1').subscribe(
      data => {
        console.log('Transactions loaded:', data);
        this.transactions = data;
      },
      error => {
        console.error('Error loading transactions:', error.message);
      }
    );
  }

  viewTransaction(transaction: any, content: TemplateRef<any>): void {
    this.selectedTransaction = transaction;
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  flagTransaction(transaction: any): void {
    transaction.allowed = !transaction.allowed;
    console.log('Transaction flag status changed:', transaction);
  }
}
