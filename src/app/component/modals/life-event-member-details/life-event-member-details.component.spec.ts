import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeEventMemberDetailsComponent } from './life-event-member-details.component';

describe('LifeEventMemberDetailsComponent', () => {
  let component: LifeEventMemberDetailsComponent;
  let fixture: ComponentFixture<LifeEventMemberDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeEventMemberDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeEventMemberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
