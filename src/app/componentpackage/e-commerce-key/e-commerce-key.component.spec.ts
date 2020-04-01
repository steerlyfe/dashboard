import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ECommerceKeyComponent } from './e-commerce-key.component';

describe('ECommerceKeyComponent', () => {
  let component: ECommerceKeyComponent;
  let fixture: ComponentFixture<ECommerceKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ECommerceKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ECommerceKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
