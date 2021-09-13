import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedInviteDialogComponent } from './feed-invite-dialog.component';

describe('FeedInviteDialogComponent', () => {
  let component: FeedInviteDialogComponent;
  let fixture: ComponentFixture<FeedInviteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedInviteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedInviteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
