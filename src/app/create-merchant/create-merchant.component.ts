import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../services/customers.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-merchant',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbDropdownModule, NgbNavModule],
  templateUrl: './create-merchant.component.html',
  styleUrls: ['./create-merchant.component.scss']
})
export class CreateMerchantComponent implements OnInit {
  merchant: any = {
    legalName: '',
    tradeName: '',
    typeOfBusiness: '',
    startDate: '',
    country: '',
    telephone: '',
    email: '',
    ruc: '',
    legalRepName: '',
    license: '',
    title: '',
    dob: '',
    nationality: '',
    address: '',
    contactName: '',
    contactTelephone: '',
    contactEmail: '',
    monthlySales: '',
    transactionType: { ach: false, cash: false, creditCards: false },
    transactionTypech: '',
    averageTicket: '',
    monthlyTransactions: '',
    commercialReferences: '',
    accountName: '',
    accountType: '',
    bankName: '',
    accountNumber: '',
    pepStatus: '',
    pepPosition: '',
    pepStartDate: '',
    pepEndDate: '',
    associatedPEPStatus: '',
    pepFamilyDetails: []
  };
  options = ['HIGH', 'MEDIUM', 'LOW'];
  showPEPDetails: boolean = false;
  showAssociatedPEPDetails: boolean = false;
  mode: 'create' | 'edit' | 'view' = 'create';
  isFormDisabled: boolean = false;

  constructor(
    private customersService: CustomersService,
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] || 'create';
      if (this.mode === 'edit' || this.mode === 'view') {
        this.loadMerchant(params['id']);
      }
      this.isFormDisabled = this.mode === 'view';
    });
  }

  selectOption(option: string) {
    this.merchant.riskStatus = option;
  }
  
  loadMerchant(id: number): void {
    this.customersService.getMerchantById(id).subscribe(
      data => {
        this.merchant = data;
      },
      error => {
        console.error('Error fetching merchant:', error.message);
      }
    );
  }


  disableForm(): void {
    this.isFormDisabled = true;
  }

  enableEdit() {
    this.isFormDisabled = false;
  }

  updateMerchant() {
    if (this.mode === 'create') {
      this.customersService.createMerchant(this.merchant).subscribe(
        () => {
          this.router.navigate(['/merchant']);
        },
        error => {
          console.error('Error creating merchant:', error.message);
        }
      );
    } else if (this.mode === 'edit') {
      this.customersService.updateMerchant(this.merchant.id, this.merchant).subscribe(
        () => {
          this.router.navigate(['/merchant']);
        },
        error => {
          console.error('Error updating merchant:', error.message);
        }
      );
    }
  }

  onSubmit() {
    this.updateMerchant();
  }

  cancel(): void {
    this.router.navigate(['/merchant']);
  }

  togglePEPDetails(show: boolean): void {
    this.showPEPDetails = show;
    if (!show) {
      this.merchant.pepPosition = '';
      this.merchant.pepStartDate = '';
      this.merchant.pepEndDate = '';
    }
  }

  toggleAssociatedPEPDetails(show: boolean): void {
    this.showAssociatedPEPDetails = show;
  }

  addPEPFamily(): void {
    if (!Array.isArray(this.merchant.pepFamilyDetails)) {
      this.merchant.pepFamilyDetails = [];
    }
    this.merchant.pepFamilyDetails.push({
      name: '',
      kinship: '',
      position: '',
      startDate: '',
      endDate: ''
    });
  }

  removePEPFamily(index: number): void {
    this.merchant.pepFamilyDetails.splice(index, 1);
  }
}
