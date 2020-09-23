import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeCameraComponent } from './take-camera.component';

describe('TakeCameraComponent', () => {
  let component: TakeCameraComponent;
  let fixture: ComponentFixture<TakeCameraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeCameraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
