import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderFriendsDialogComponent } from './reminder-friends-dialog.component';

describe('ReminderFriendsDialogComponent', () => {
  let component: ReminderFriendsDialogComponent;
  let fixture: ComponentFixture<ReminderFriendsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderFriendsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderFriendsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
