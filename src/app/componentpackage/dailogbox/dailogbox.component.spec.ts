import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailogboxComponent } from './dailogbox.component';

describe('DailogboxComponent', () => {
  let component: DailogboxComponent;
  let fixture: ComponentFixture<DailogboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailogboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailogboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
