import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoocommercetutorialComponent } from './woocommercetutorial.component';

describe('WoocommercetutorialComponent', () => {
  let component: WoocommercetutorialComponent;
  let fixture: ComponentFixture<WoocommercetutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoocommercetutorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoocommercetutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
