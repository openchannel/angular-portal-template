import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppDeveloperComponent } from './app-developer.component';

describe('AppDeveloperComponent', () => {
  let component: AppDeveloperComponent;
  let fixture: ComponentFixture<AppDeveloperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppDeveloperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
