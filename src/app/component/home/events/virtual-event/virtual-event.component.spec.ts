import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualEventComponent } from './virtual-event.component';

describe('VirtualEventComponent', () => {
  let component: VirtualEventComponent;
  let fixture: ComponentFixture<VirtualEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
