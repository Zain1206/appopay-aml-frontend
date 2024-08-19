import { TestBed } from '@angular/core/testing';

import { CustomerDetailDialogService } from './customer-detail-dialog.service';

describe('CustomerDetailDialogService', () => {
  let service: CustomerDetailDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerDetailDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
