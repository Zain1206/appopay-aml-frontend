import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-create-partner',
  standalone: true,
  imports: [FormsModule, CommonModule,NgbModule],
  templateUrl: './create-partner.component.html',
  styleUrl: './create-partner.component.scss'
})
export class CreatePartnerComponent implements OnInit{
  partner: any = {
    compRegName: '',
    compTradeName: '',
    compTaxNumber: '',
    companyRegNumber: '',
    compRegCountry: '',
    compRegDate: '',
    compRegProvince: '',
    currAddress: {
      zipCode: 'string',
      state: 'string',
      country: 'string',
      province: 'string',
      street: 'string'
    },
    phyAddress: {
      zipCode: 'string',
      state: 'string',
      country: 'string',
      province: 'string',
      street: 'string'
    },
    "postAddress": {
      street: 'string',
      zipCode: 'string',
      state: 'string',
      country: 'string',
      province: 'string'
    },
    mainPhoneNo: '',
    secPhoneNumber: '',
    compWebsite: '',
    tradeNameWebsite: '',
    isListedOnSE: false,
    exchangeName: '',
    symbolListed: '',
    isRegulated: '',
    usFederalRegulator: '',
    financialServicesRegulator: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    primaryContactPosition: '',
    primaryContactExtension: '',
    authorizedSignatoryName: '',
    authorizedSignatoryPosition: '',
    owners: [],
    admins: [],
    financingBankName: '',
    swiftCode: '',
    fundingAccountName: '',
    currenciesUsed: {
      USD: false,
      HEAR: false,
      HKD: false,
      UAE: false,
      EUR: false,
      CAD: false,
      PHP: false,
      XOF: false,
      GBP: false,
      GMD: false,
      SGD: false,
      YEN: false,
      DEA: false
    },
    businessDescription: '',
    sourceOfFunds: '',
    isRegByFinEntity: true,
    isRegByFinSerRegulator: true,
  };

  mode: 'create' | 'edit' | 'view' = 'create';
  isFormDisabled: boolean = false;
  options = ['HIGH', 'MEDIUM', 'LOW'];

  constructor(private customersService: CustomersService, private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] || 'create';
      if (this.mode === 'edit' || this.mode === 'view') {
        this.loadPartner(params['id']);
      }
      this.isFormDisabled = this.mode === 'view';
    });
  }

  selectOption(option: string) {
    this.partner.riskStatus = option;
  }

  loadPartner(id: number): void {
    this.customersService.getPartnerById(id).subscribe(
      data => {
        this.partner = data;
      },
      error => {
        console.error('Error fetching partner:', error.message);
      }
    );
  }

  updatePartner() {
    if (this.mode === 'create') {
      this.customersService.createPartner(this.partner).subscribe(
        () => {
          this.router.navigate(['/partner']);
        },
        error => {
          console.error('Error creating partner:', error.message);
        }
      );
    } else if (this.mode === 'edit') {
      this.customersService.updatePartner(this.partner.id, this.partner).subscribe(
        () => {
          this.router.navigate(['/partner']);
        },
        error => {
          console.error('Error updating partner:', error.message);
        }
      );
    }
  }

  onSubmit(): void {
    this.updatePartner();
  }

  addOwner() {
    this.partner.owners.push({
      name: '',
      dob: '',
      nationality: '',
      address: '',
      ownership: '',
      pepStatus: ''
    });
  }

  removeOwner(index: number) {
    this.partner.owners.splice(index, 1);
  }

  addAdmin() {
    this.partner.admins.push({
      name: '',
      dob: '',
      nationality: '',
      position: '',
      city: '',
      country: '',
      pepStatus: ''
    });
  }

  removeAdmin(index: number) {
    this.partner.admins.splice(index, 1);
  }

  disableForm(): void {
    this.isFormDisabled = true;
  }

  enableEdit() {
    this.isFormDisabled = false;
  }

  cancel(): void {
    this.router.navigate(['/partner']);
  }

}
