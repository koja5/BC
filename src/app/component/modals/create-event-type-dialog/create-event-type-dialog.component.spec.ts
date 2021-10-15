import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventTypeDialogComponent } from './create-event-type-dialog.component';

describe('CreateEventTypeDialogComponent', () => {
  let component: CreateEventTypeDialogComponent;
  let fixture: ComponentFixture<CreateEventTypeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEventTypeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
