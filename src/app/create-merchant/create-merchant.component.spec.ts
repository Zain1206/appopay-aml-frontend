import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMerchantComponent } from './create-merchant.component';

describe('CreateMerchantComponent', () => {
  let component: CreateMerchantComponent;
  let fixture: ComponentFixture<CreateMerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMerchantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
