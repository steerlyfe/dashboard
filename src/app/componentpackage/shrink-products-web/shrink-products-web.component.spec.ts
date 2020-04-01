import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShrinkProductsWebComponent } from './shrink-products-web.component';

describe('ShrinkProductsWebComponent', () => {
  let component: ShrinkProductsWebComponent;
  let fixture: ComponentFixture<ShrinkProductsWebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShrinkProductsWebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShrinkProductsWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
