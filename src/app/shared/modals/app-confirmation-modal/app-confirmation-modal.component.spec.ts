import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppConfirmationModalComponent } from './app-confirmation-modal.component';

describe('ConfirmationModalComponent', () => {
  let component: AppConfirmationModalComponent;
  let fixture: ComponentFixture<AppConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppConfirmationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
