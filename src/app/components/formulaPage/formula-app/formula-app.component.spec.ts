import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaAppComponent } from './formula-app.component';

describe('FormulaAppComponent', () => {
  let component: FormulaAppComponent;
  let fixture: ComponentFixture<FormulaAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
