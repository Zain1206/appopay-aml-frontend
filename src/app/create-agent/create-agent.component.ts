import { Component, OnInit  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-create-agent',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbModule],
  templateUrl: './create-agent.component.html',
  styleUrls: ['./create-agent.component.scss']
})
export class CreateAgentComponent implements OnInit{
  partner: any = {
    compRegName: '',
    compTradeName: '',
    compTaxNumber: '',
    companyRegNumber: '',
    compRegCountry: '',
    compRegDate: '',
    compRegProvince: '',
    currentAddressStreet: '',
    currentAddressZipCode: '',
    currentAddressState: '',
    currentAddressProvince: '',
    currentAddressCountry: '',
    physicalAddressStreet: '',
    physicalAddressZipCode: '',
    physicalAddressState: '',
    physicalAddressProvince: '',
    physicalAddressCountry: '',
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
    owners: [],  // Array to hold multiple owners
    admins: [],  // Array to hold multiple administrators
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

  options = ['HIGH', 'MEDIUM', 'LOW'];

  mode: 'create' | 'edit' | 'view' = 'create';  // Mode to control form behavior
  isFormDisabled: boolean = false; // Variable to control form disable state

  constructor(private customersService: CustomersService,
    private router: Router, 
    private http: HttpClient, private route: ActivatedRoute) {}

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.mode = params['mode'] || 'create';
        if (this.mode === 'edit' || this.mode === 'view') {
          this.loadAgent(params['id']);
        }
        this.isFormDisabled = this.mode === 'view';
      });
    }

    selectOption(option: string) {
      this.partner.riskStatus = option;
    }
    
  // Method to add a new owner
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

  // Method to remove an owner
  removeOwner(index: number) {
    this.partner.owners.splice(index, 1);
  }

  // Method to add a new administrator
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

  // Method to remove an administrator
  removeAdmin(index: number) {
    this.partner.admins.splice(index, 1);
  }

  loadAgent(id: number): void {
    this.customersService.getAgentById(id).subscribe(
      data => {
        this.partner = data;
      },
      error => {
        console.error('Error fetching agent:', error.message);
      }
    );
  }

  updateAgent() {
    if (this.mode === 'create') {
      this.customersService.createAgent(this.partner).subscribe(
        () => {
          this.router.navigate(['/agent']);
        },
        error => {
          console.error('Error creating agent:', error.message);
        }
      );
    } else if (this.mode === 'edit') {
      this.customersService.updateAgent(this.partner.id, this.partner).subscribe(
        () => {
          this.router.navigate(['/agent']);
        },
        error => {
          console.error('Error updating agent:', error.message);
        }
      );
    }
  }
  onSubmit(): void {
    this.updateAgent();
  }

  disableForm(): void {
    this.isFormDisabled = true;
  }

  enableEdit() {
    this.isFormDisabled = false;
  }

  cancel(): void {
    this.router.navigate(['/agent']);
  }
}



