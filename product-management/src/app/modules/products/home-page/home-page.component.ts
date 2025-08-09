import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  constructor(private router: Router){

  }
  navManageProduct(){
    // this.router.navigate(['/products']);
    this.router.navigateByUrl('/products');
  }
  navPriceOptimization(){
    this.router.navigate(['/price']);
  }

}
