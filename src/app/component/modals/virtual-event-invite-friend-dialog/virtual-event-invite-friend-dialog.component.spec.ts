import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualEventInviteFriendDialogComponent } from './virtual-event-invite-friend-dialog.component';

describe('VirtualEventInviteFriendDialogComponent', () => {
  let component: VirtualEventInviteFriendDialogComponent;
  let fixture: ComponentFixture<VirtualEventInviteFriendDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualEventInviteFriendDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualEventInviteFriendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
