import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFieldsComponent } from './app-fields.component';

describe('AppFieldsComponent', () => {
  let component: AppFieldsComponent;
  let fixture: ComponentFixture<AppFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
