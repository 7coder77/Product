import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHomeLayoutComponent } from './product-home-layout.component';

describe('ProductHomeLayoutComponent', () => {
  let component: ProductHomeLayoutComponent;
  let fixture: ComponentFixture<ProductHomeLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductHomeLayoutComponent]
    });
    fixture = TestBed.createComponent(ProductHomeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
