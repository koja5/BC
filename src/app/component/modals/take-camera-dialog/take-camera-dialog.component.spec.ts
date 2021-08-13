import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeCameraDialogComponent } from './take-camera-dialog.component';

describe('TakeCameraDialogComponent', () => {
  let component: TakeCameraDialogComponent;
  let fixture: ComponentFixture<TakeCameraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeCameraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeCameraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
