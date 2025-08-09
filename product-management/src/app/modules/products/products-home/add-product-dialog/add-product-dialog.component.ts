import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss']
})
export class AddProductDialogComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      productCategory: ['', Validators.required],
      costPrice: ['', Validators.required],
      sellingPrice: ['', Validators.required],
      description: [''],
      availableStock: ['', Validators.required],
      unitsSold: ['', Validators.required]
    });
    console.log('Received data:', this.data);
    if (this.data) {
      this.productForm.patchValue({
        productName: this.data.name,
        productCategory: this.data.category,
        costPrice: this.data.cost_price,
        sellingPrice: this.data.selling_price,
        description: this.data.description,
        availableStock: this.data.stock,
        unitsSold: this.data.unitsold
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }
}
