import { Component } from '@angular/core';

@Component({
  selector: 'app-product-home-layout',
  templateUrl: './product-home-layout.component.html',
  styleUrls: ['./product-home-layout.component.scss']
})
export class ProductHomeLayoutComponent {
username=localStorage.getItem('name') || 'Guest'; // Default to 'Guest' if no name is found
}
