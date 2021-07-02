import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindConnectionComponent } from './find-connection.component';

describe('FindConnectionComponent', () => {
  let component: FindConnectionComponent;
  let fixture: ComponentFixture<FindConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
