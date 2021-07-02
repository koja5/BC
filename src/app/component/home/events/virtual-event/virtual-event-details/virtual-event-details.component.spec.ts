import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualEventDetailsComponent } from './virtual-event-details.component';

describe('VirtualEventDetailsComponent', () => {
  let component: VirtualEventDetailsComponent;
  let fixture: ComponentFixture<VirtualEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
