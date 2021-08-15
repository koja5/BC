import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeEventDetailsDialogComponent } from './life-event-details-dialog.component';

describe('LifeEventDetailsDialogComponent', () => {
  let component: LifeEventDetailsDialogComponent;
  let fixture: ComponentFixture<LifeEventDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeEventDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeEventDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
