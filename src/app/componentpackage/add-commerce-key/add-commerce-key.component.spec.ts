import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommerceKeyComponent } from './add-commerce-key.component';

describe('AddCommerceKeyComponent', () => {
  let component: AddCommerceKeyComponent;
  let fixture: ComponentFixture<AddCommerceKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCommerceKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommerceKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
