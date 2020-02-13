import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAppComponent } from './resource-app.component';

describe('ResourceAppComponent', () => {
  let component: ResourceAppComponent;
  let fixture: ComponentFixture<ResourceAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
