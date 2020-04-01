import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresOrdersDetailsComponent } from './stores-orders-details.component';

describe('StoresOrdersDetailsComponent', () => {
  let component: StoresOrdersDetailsComponent;
  let fixture: ComponentFixture<StoresOrdersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoresOrdersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoresOrdersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
