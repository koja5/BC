import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewCustomerDialogComponent } from './create-new-customer-dialog.component';

describe('CreateNewCustomerDialogComponent', () => {
  let component: CreateNewCustomerDialogComponent;
  let fixture: ComponentFixture<CreateNewCustomerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewCustomerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
