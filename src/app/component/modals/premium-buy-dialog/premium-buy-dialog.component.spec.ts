import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumBuyDialogComponent } from './premium-buy-dialog.component';

describe('PremiumBuyDialogComponent', () => {
  let component: PremiumBuyDialogComponent;
  let fixture: ComponentFixture<PremiumBuyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumBuyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumBuyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
