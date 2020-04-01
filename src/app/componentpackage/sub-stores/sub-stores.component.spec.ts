import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubStoresComponent } from './sub-stores.component';

describe('SubStoresComponent', () => {
  let component: SubStoresComponent;
  let fixture: ComponentFixture<SubStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
