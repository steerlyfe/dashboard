import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubStoresComponent } from './add-sub-stores.component';

describe('AddSubStoresComponent', () => {
  let component: AddSubStoresComponent;
  let fixture: ComponentFixture<AddSubStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
