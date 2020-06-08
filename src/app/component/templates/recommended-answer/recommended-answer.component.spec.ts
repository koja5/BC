import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedAnswerComponent } from './recommended-answer.component';

describe('RecommendedAnswerComponent', () => {
  let component: RecommendedAnswerComponent;
  let fixture: ComponentFixture<RecommendedAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendedAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
