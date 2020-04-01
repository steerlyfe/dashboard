import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncBigcommerceProductsComponent } from './sync-bigcommerce-products.component';

describe('SyncBigcommerceProductsComponent', () => {
  let component: SyncBigcommerceProductsComponent;
  let fixture: ComponentFixture<SyncBigcommerceProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncBigcommerceProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncBigcommerceProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
