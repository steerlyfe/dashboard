import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocodeListComponent } from './promocode-list.component';

describe('PromocodeListComponent', () => {
  let component: PromocodeListComponent;
  let fixture: ComponentFixture<PromocodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromocodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
