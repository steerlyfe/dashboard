import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBigCommerceKeyComponent } from './add-big-commerce-key.component';

describe('AddBigCommerceKeyComponent', () => {
  let component: AddBigCommerceKeyComponent;
  let fixture: ComponentFixture<AddBigCommerceKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBigCommerceKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBigCommerceKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
