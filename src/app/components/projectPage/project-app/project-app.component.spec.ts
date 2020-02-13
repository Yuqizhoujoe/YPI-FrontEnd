import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAppComponent } from './project-app.component';

describe('ProjectAppComponent', () => {
  let component: ProjectAppComponent;
  let fixture: ComponentFixture<ProjectAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
