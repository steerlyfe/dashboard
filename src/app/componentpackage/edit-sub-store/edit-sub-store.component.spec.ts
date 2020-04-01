import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubStoreComponent } from './edit-sub-store.component';

describe('EditSubStoreComponent', () => {
  let component: EditSubStoreComponent;
  let fixture: ComponentFixture<EditSubStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSubStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
