import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPostDialogComponent } from './preview-post-dialog.component';

describe('PreviewPostDialogComponent', () => {
  let component: PreviewPostDialogComponent;
  let fixture: ComponentFixture<PreviewPostDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewPostDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
