import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesDialogComponent } from './add-sales-dialog.component';

describe('AddSalesDialogComponent', () => {
  let component: AddSalesDialogComponent;
  let fixture: ComponentFixture<AddSalesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalesDialogComponent]
    });
    fixture = TestBed.createComponent(AddSalesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
