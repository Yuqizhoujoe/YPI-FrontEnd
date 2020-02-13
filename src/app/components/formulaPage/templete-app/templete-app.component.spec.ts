import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempleteAppComponent } from './templete-app.component';

describe('TempleteAppComponent', () => {
  let component: TempleteAppComponent;
  let fixture: ComponentFixture<TempleteAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempleteAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempleteAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
