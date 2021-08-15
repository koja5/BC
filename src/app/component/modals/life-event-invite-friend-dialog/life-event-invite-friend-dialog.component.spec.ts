import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeEventInviteFriendDialogComponent } from './life-event-invite-friend-dialog.component';

describe('LifeEventInviteFriendDialogComponent', () => {
  let component: LifeEventInviteFriendDialogComponent;
  let fixture: ComponentFixture<LifeEventInviteFriendDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeEventInviteFriendDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeEventInviteFriendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
