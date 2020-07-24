import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntputErrorsComponent } from './intput-errors.component';

describe('IntputErrorsComponent', () => {
  let component: IntputErrorsComponent;
  let fixture: ComponentFixture<IntputErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntputErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntputErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
