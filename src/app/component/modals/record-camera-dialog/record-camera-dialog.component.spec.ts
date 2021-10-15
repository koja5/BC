import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordCameraDialogComponent } from './record-camera-dialog.component';

describe('RecordCameraDialogComponent', () => {
  let component: RecordCameraDialogComponent;
  let fixture: ComponentFixture<RecordCameraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordCameraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordCameraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
