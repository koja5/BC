import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedPostLikesDialogComponent } from './feed-post-likes-dialog.component';

describe('FeedPostLikesDialogComponent', () => {
  let component: FeedPostLikesDialogComponent;
  let fixture: ComponentFixture<FeedPostLikesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedPostLikesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedPostLikesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
