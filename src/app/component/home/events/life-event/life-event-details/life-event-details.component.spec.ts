import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeEventDetailsComponent } from './life-event-details.component';

describe('LifeEventDetailsComponent', () => {
  let component: LifeEventDetailsComponent;
  let fixture: ComponentFixture<LifeEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
