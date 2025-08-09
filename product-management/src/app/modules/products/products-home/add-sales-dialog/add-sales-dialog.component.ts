import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-add-sales-dialog',
  templateUrl: './add-sales-dialog.component.html',
  styleUrls: ['./add-sales-dialog.component.scss']
})
export class AddSalesDialogComponent {
  productForm: FormGroup;

    constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<AddSalesDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.productForm = this.fb.group({
        date: [null, Validators.required],
        units_sold: [null, Validators.required],
        price: [null, Validators.required]
      });
      console.log('Received data:', this.data);
    }

    onCancel(): void {
      this.dialogRef.close();
    }

    onAdd(): void {
      console.log('Form Value:', this.productForm);
      if (this.productForm.valid) {
        this.dialogRef.close(this.productForm.value);
      }
    }
}
