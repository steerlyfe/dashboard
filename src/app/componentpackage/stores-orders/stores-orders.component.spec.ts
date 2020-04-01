import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresOrdersComponent } from './stores-orders.component';

describe('StoresOrdersComponent', () => {
  let component: StoresOrdersComponent;
  let fixture: ComponentFixture<StoresOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoresOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoresOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
