import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShopifyKeyComponent } from './add-shopify-key.component';

describe('AddShopifyKeyComponent', () => {
  let component: AddShopifyKeyComponent;
  let fixture: ComponentFixture<AddShopifyKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShopifyKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShopifyKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
