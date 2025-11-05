import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidesList } from './rides-list';

describe('RidesList', () => {
  let component: RidesList;
  let fixture: ComponentFixture<RidesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RidesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RidesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
