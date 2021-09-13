import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedDialogComponent } from './recommended-dialog.component';

describe('RecommendedDialogComponent', () => {
  let component: RecommendedDialogComponent;
  let fixture: ComponentFixture<RecommendedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
