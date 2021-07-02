import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationButtonComponent } from './recommendation-button.component';

describe('RecommendationButtonComponent', () => {
  let component: RecommendationButtonComponent;
  let fixture: ComponentFixture<RecommendationButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendationButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
