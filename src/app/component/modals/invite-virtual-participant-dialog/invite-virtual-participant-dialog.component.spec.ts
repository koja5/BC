import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteVirtualParticipantDialogComponent } from './invite-virtual-participant-dialog.component';

describe('InviteVirtualParticipantDialogComponent', () => {
  let component: InviteVirtualParticipantDialogComponent;
  let fixture: ComponentFixture<InviteVirtualParticipantDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteVirtualParticipantDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteVirtualParticipantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
